import { DragEvent } from "react";
import { Application, AppStatus } from "../types";

type Props = {
  applications: Application[];
  onStatusChange: (id: string, status: AppStatus) => void;
  onOpen: (app: Application) => void;
};

const columns: AppStatus[] = [
  "Applied",
  "Phone Screen",
  "Interview",
  "Offer",
  "Rejected"
];

const Board = ({ applications, onStatusChange, onOpen }: Props) => {
  const handleDrop = (e: DragEvent<HTMLDivElement>, status: AppStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) {
      onStatusChange(id, status);
    }
  };

  return (
    <div className="grid md:grid-cols-5 gap-3">
      {columns.map((status) => {
        const list = applications.filter((a) => a.status === status);
        return (
          <div
            key={status}
            className="bg-[#1b222c] p-2 min-h-[300px] silly-shadow"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, status)}
          >
            <div className="font-bold text-sm mb-2 text-[#cbd5e1]">
              {status}
            </div>
            {list.length === 0 && (
              <div className="text-xs text-[#8b95a7]">Empty</div>
            )}
            {list.map((app) => (
              <div
                key={app._id}
                className="bg-[#111827] p-2 mb-2 border border-[#2b3440] cursor-move"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", app._id)}
                onClick={() => onOpen(app)}
              >
                <div className="font-bold text-sm">{app.company}</div>
                <div className="text-xs">{app.role}</div>
                <div className="text-[11px] text-[#8b95a7]">
                  {app.dateApplied || "no date"}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
