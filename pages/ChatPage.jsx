import { useState, useRef } from "react";
import {Upload, Send, Play, Sparkles} from "lucide-react";

export default function ChatPage({ dark }) {
  const [videos, setVideos] = useState([]);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedTimestamp, setSelectedTimestamp] = useState(0);

  const playerRef = useRef(null);

    const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    const uploaded = [];
    // need to look her
    for (let file of files) {
      const formData = new FormData();
      formData.append("file", file);
    
      await fetch("http://localhost:8000/upload-video", {
        method: "POST",
        body: formData,
      });
    
      uploaded.push({
        id: Date.now() + Math.random(),
        name: file.name,
        url: URL.createObjectURL(file),
      });
    }
  
    setVideos((prev) => [...prev, ...uploaded]);
  
    if (!selectedVideo && uploaded.length > 0) {
      setSelectedVideo(uploaded[0]);
    }
  };
  /* ================= SEARCH ================= */
  
    const handleSearch = async () => {
      if (!query || videos.length === 0) return;

      try {
        const userMessage = {
          type: "user",
          text: query,
        };
      
        setMessages((prev) => [...prev, userMessage]);
        setLoading(true);
      
        const res = await fetch("http://localhost:8000/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
          }),
        });
      
        const data = await res.json();
      
        console.log("SEARCH RESULTS:", data);
      
        const aiMessage = {
          type: "ai",
          results: data.results.map((r, i) => {
          
            // find uploaded video
            const matchedVideo = videos.find(
              (v) => v.name === r.video_id
            );
          
            return {
              id: i,
              video: matchedVideo,
              timestamp: r.timestamp,
              label: r.caption,
              confidence: "AI match",
              tags: ["scene", "match"],
            };
          }),
        };
      
        setMessages((prev) => [...prev, aiMessage]);
        setQuery("");
      
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

  /* ================= PLAY VIDEO ================= */
  const handlePlay = (item) => {
    setSelectedVideo(item.video);
    setSelectedTimestamp(item.timestamp);

    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.currentTime = item.timestamp;
        playerRef.current.play();
      }
    }, 100);
  };

  return (
    <div
      className={`min-h-screen transition-all duration-300
        ${dark ? "bg-black/40 text-white" : "bg-gray-100 text-black"}
      `}
    >

      {/* ================= EMPTY STATE ================= */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[85vh] px-4">

          {/* Logo */}
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border
              ${
                dark
                  ? "bg-white/5 border-white/10"
                  : "bg-white border-gray-300"
              }
            `}
          >
            <Sparkles className="text-blue-400" />
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-semibold mb-2 text-center">
            Surveillance Video Search
          </h1>

          <p
            className={`mb-8 text-center
              ${dark ? "text-gray-400" : "text-gray-600"}
            `}
          >
            Upload videos and search for events instantly.
          </p>

          {/* CENTER INPUT */}
          <div className="w-full max-w-2xl">

            <div className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">

              <div
                className={`rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl
                  ${dark ? "bg-black/80" : "bg-white"}
                `}
              >
                <Sparkles className="text-blue-400" size={18} />

                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search scenes (fight near car...)"
                  className={`flex-1 bg-transparent outline-none text-sm
                    ${
                      dark
                        ? "text-white placeholder:text-gray-400"
                        : "text-black placeholder:text-gray-500"
                    }
                  `}
                />

                {/* Upload */}
                <label
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition
                    ${
                      dark
                        ? "bg-white/5 hover:bg-white/10"
                        : "bg-gray-200 hover:bg-gray-300"
                    }
                  `}
                >
                  <Upload size={16} />
                  Upload

                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>

                {/* Search */}
                <button
                  onClick={handleSearch}
                  className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition text-white"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>

            {/* Uploaded Count */}
            {videos.length > 0 && (
              <p
                className={`text-xs mt-3 text-center
                  ${dark ? "text-gray-400" : "text-gray-600"}
                `}
              >
                {videos.length} videos uploaded
              </p>
            )}
          </div>
        </div>
      ) : (

        /* ================= MAIN LAYOUT ================= */
        <div className="p-6">

          {/* ================= CONTENT ================= */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ================= LEFT VIDEO PLAYER ================= */}
            <div className="lg:col-span-2 space-y-4">

              {/* PLAYER */}
              <div
                className={`rounded-2xl overflow-hidden border aspect-video
                  ${
                    dark
                      ? "bg-black border-zinc-800"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                {selectedVideo ? (
                  <video
                    ref={playerRef}
                    src={selectedVideo.url}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                    onLoadedMetadata={() => {
                      if (playerRef.current) {
                        playerRef.current.currentTime = selectedTimestamp;
                      }
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Select a scene to play video
                  </div>
                )}
              </div>

              {/* VIDEO INFO */}
              {selectedVideo && (
                <div
                  className={`rounded-2xl border p-4
                    ${
                      dark
                        ? "bg-zinc-900 border-zinc-800"
                        : "bg-white border-gray-300"
                    }
                  `}
                >
                  <h2 className="text-lg font-semibold mb-2">
                    {selectedVideo.name}
                  </h2>

                  <p
                    className={`text-sm
                      ${dark ? "text-gray-400" : "text-gray-600"}
                    `}
                  >
                    AI surveillance analysis result
                  </p>
                </div>
              )}
            </div>

            {/* ================= RIGHT RESULTS ================= */}
            <div className="space-y-4 max-h-[80vh] overflow-y-auto scrollbar-hide pr-1">

              {messages.map((msg, index) => (
                <div key={index} className="space-y-4">

                  {/* USER MESSAGE */}
                  {msg.type === "user" && (
                    <div className="text-right">
                      <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-xl text-sm">
                        {msg.text}
                      </div>
                    </div>
                  )}

                  {/* AI RESULTS */}
                  {msg.type === "ai" && (
                    <>
                      {msg.results.map((item) => (
                        <div
                          key={item.id}
                          className={`rounded-2xl border p-4 transition hover:scale-[1.01]
                            ${
                              dark
                                ? "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                                : "bg-white border-gray-300 hover:bg-gray-50"
                            }
                          `}
                        >
                          <div className="flex gap-3">

                            {/* THUMBNAIL */}
                            <div className="w-36 h-24 rounded-xl overflow-hidden bg-black flex-shrink-0">
                              <video
                                src={item.video?.url}
                                muted
                                autoPlay
                                loop
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* INFO */}
                            <div className="flex-1 min-w-0">

                              <h3 className="font-medium truncate mb-1">
                                {item.video?.name || "Unknown Video"}
                              </h3>

                              <p className="text-sm text-blue-400 mb-2">
                                {item.label} • {item.confidence}
                              </p>

                              {/* TIMESTAMP */}
                              <p
                                className={`text-xs mb-3
                                  ${
                                    dark
                                      ? "text-gray-400"
                                      : "text-gray-600"
                                  }
                                `}
                              >
                                Timestamp: {item.timestamp}s
                              </p>

                              {/* PLAY BUTTON */}
                              <button
                                onClick={() => item.video && handlePlay(item)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm transition"
                              >
                                <Play size={16} />
                                Play Video
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              ))}

              {/* LOADING */}
              {loading && (
                <div
                  className={`text-sm animate-pulse
                    ${dark ? "text-gray-400" : "text-gray-600"}
                  `}
                >
                  Analyzing videos...
                </div>
              )}
            </div>
          </div>

          {/* ================= BOTTOM INPUT ================= */}
          <div className="sticky bottom-10 pt-100 pr-170">

            <div className="max-w-4xl mx-auto">

              <div className="rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-red-500">

                <div
                  className={`rounded-2xl px-4 py-3 flex items-center gap-3 backdrop-blur-xl
                    ${dark ? "bg-black/80" : "bg-white"}
                  `}
                >
                  <Sparkles className="text-blue-400" size={18} />

                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearch();
                      }
                    }}
                    placeholder="Search again..."
                    className={`flex-1 bg-transparent outline-none text-sm
                      ${
                        dark
                          ? "text-white placeholder:text-gray-400"
                          : "text-black placeholder:text-gray-500"
                      }
                    `}
                  />

                  {/* Upload */}
                  <label
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer transition
                      ${
                        dark
                          ? "bg-white/5 hover:bg-white/10"
                          : "bg-gray-200 hover:bg-gray-300"
                      }
                    `}
                  >
                    <Upload size={16} />
                    Upload

                    <input
                      type="file"
                      multiple
                      accept="video/*"
                      onChange={handleUpload}
                      className="hidden"
                    />
                  </label>

                  {/* Search */}
                  <button
                    onClick={handleSearch}
                    className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition text-white"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}