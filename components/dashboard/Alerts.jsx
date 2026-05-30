import Card from "../ui/Card";

export default function Alerts({ dark }) {
  return (
    <Card title="Alerts" dark={dark}>
      <div className="min-h-[560px] flex flex-col justify-center px-2">
        <ul className="text-base space-y-3">
          <li className="flex items-center gap-2">⚠ Intrusion detected</li>
          <li className="flex items-center gap-2">🔥 Fire alert</li>
          <li className="flex items-center gap-2">🚗 Wrong parking</li>
        </ul>
      </div>
    </Card>
  );
}