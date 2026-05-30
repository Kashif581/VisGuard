export default function LiveHeader({ dark }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold">
        CCTV Live Monitoring
      </h1>

      <p
        className={`text-sm ${
          dark ? "text-gray-400" : "text-gray-600"
        }`}
      >
        Real-time multi-camera surveillance
      </p>
    </div>
  );
}