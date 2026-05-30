from sentence_transformers import SentenceTransformer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import normalize
import numpy as np



dense_model = SentenceTransformer("intfloat/e5-small-v2")



def get_tfidf_vectorizer(all_captions):
    """
    Initializes and fits the TF-IDF vectorizer.
    NOTE: TF-IDF needs to 'see' all captions to understand word importance.
    """
    vectorizer = TfidfVectorizer(max_features=5000, stop_words="english")
    if all_captions:
        vectorizer.fit(all_captions)
    return vectorizer

def get_hybrid_embeddings(caption, dense_model):
    """
    Generates both dense (E5) and sparse (TF-IDF) vectors for a single caption.
    """
    # 1. Generate Dense Vector (E5)
    dense_model = dense_model
    # E5 models REQUIRE the 'passage: ' prefix for document indexing
    prefixed_text = f"passage: {caption}"
    
    dense_vector = dense_model.encode(
        [prefixed_text], 
        normalize_embeddings=True,
        convert_to_numpy=True
    ).astype("float32")[0]

    return dense_vector

def get_sparse_batch(vectorizer, all_captions):
    """
    Transforms captions into sparse vectors and ensures they match 
    the 5000-dimension schema required by Milvus.
    """
    # Transform to sparse matrix
    sparse_matrix = vectorizer.transform(all_captions)
    
    # Convert to dense array for Milvus float_vector field
    sparse_vectors = sparse_matrix.toarray().astype("float32")
    
    # Check if the vectorizer vocabulary is smaller than 5000
    current_dim = sparse_vectors.shape[1]
    target_dim = 5000
    
    if current_dim < target_dim:
        # Pad with zeros to reach exactly 5000 dimensions
        padding = np.zeros((sparse_vectors.shape[0], target_dim - current_dim), dtype="float32")
        sparse_vectors = np.hstack([sparse_vectors, padding])
    elif current_dim > target_dim:
        # This shouldn't happen with max_features=5000, but just in case:
        sparse_vectors = sparse_vectors[:, :target_dim]
        
    # Normalize for Cosine Similarity
    return normalize(sparse_vectors, norm='l2', axis=1)


from pymilvus import AnnSearchRequest, RRFRanker

def search_with_prf(db, query_text, tfidf_vectorizer, dense_model, video_id, top_k=3):
    """
    db: Your VideoDB instance
    query_text: The user's chat input
    tfidf_vectorizer: The vectorizer fitted during the video processing
    dense_model: The E5 model
    """
    
    # 1. Prepare Query Vectors
    # Dense (E5) uses 'query: ' prefix
    query_dense = dense_model.encode([f"query: {query_text}"], normalize_embeddings=True).tolist()
    
    # Sparse (TF-IDF)
    query_sparse = tfidf_vectorizer.transform([query_text]).toarray().astype("float32")
    # Ensure it matches the 5000-dim schema
    if query_sparse.shape[1] < 5000:
        padding = np.zeros((1, 5000 - query_sparse.shape[1]), dtype="float32")
        query_sparse = np.hstack([query_sparse, padding])
    query_sparse = query_sparse.tolist()

    # 2. Hybrid Search Request (Dense + Sparse)
    req_dense = AnnSearchRequest(query_dense, "dense_vector", {"metric_type": "COSINE"}, limit=top_k, expr=f'video_id == "{video_id}"')
    req_sparse = AnnSearchRequest(query_sparse, "sparse_vector", {"metric_type": "COSINE"}, limit=top_k, expr=f'video_id == "{video_id}"')

    # 3. Execute Search with RRF (Reciprocal Rank Fusion)
    # This balances the importance of the dense and sparse results
    res = db.collection.hybrid_search(
        [req_dense, req_sparse], 
        rerank=RRFRanker(),
        limit=top_k,
        output_fields=["video_id", "frame_index", "timestamp", "caption"],
    )
    
    return res[0] # Returns a list of hits

# Note: Sparse vectors are usually calculated in bulk after all captions 
# are generated, because TF-IDF depends on the 'vocabulary' of the whole video.