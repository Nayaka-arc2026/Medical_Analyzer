
import { FileText } from "lucide-react";

export default function Reports() {
  return (
    <div className="bg-white rounded-2xl p-8">
      <FileText size={36} className="text-cyan-600" />
      <h1 className="text-2xl font-bold mt-4">Medical Reports</h1>
      <p className="text-gray-500 mt-2">
        Reviewed medical reports will appear here.
      </p>
    </div>
  );
}
