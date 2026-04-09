import { useState } from "react";
import { Application, AppStatus } from "../types";

type Props = {
  application: Application;
  onClose: () => void;
  onSave: (app: Application) => void;
  onDelete: (id: string) => void;
};

const splitList = (text: string): string[] => {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

const CardModal = ({ application, onClose, onSave, onDelete }: Props) => {
  const [data, setData] = useState<Application>(application);
  const [skillsText, setSkillsText] = useState(
    (application.requiredSkills || []).join(", ")
  );
  const [niceText, setNiceText] = useState(
    (application.niceToHaveSkills || []).join(", ")
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-[#151a21] p-4 w-full max-w-lg silly-shadow">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold">Edit Application</div>
          <button
            className="bg-[#0f172a] text-[#cbd5e1] px-2 py-1"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <div className="space-y-2">
          <input
            className="w-full border p-2"
            value={data.company}
            onChange={(e) => setData({ ...data, company: e.target.value })}
          />
          <input
            className="w-full border p-2"
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.target.value })}
          />
          <input
            className="w-full border p-2"
            value={data.location || ""}
            onChange={(e) => setData({ ...data, location: e.target.value })}
          />
          <input
            className="w-full border p-2"
            value={data.seniority || ""}
            onChange={(e) => setData({ ...data, seniority: e.target.value })}
          />
          <input
            className="w-full border p-2"
            value={data.jdLink || ""}
            onChange={(e) => setData({ ...data, jdLink: e.target.value })}
          />
          <input
            className="w-full border p-2"
            value={data.salaryRange || ""}
            onChange={(e) => setData({ ...data, salaryRange: e.target.value })}
          />
          <input
            className="w-full border p-2"
            value={skillsText}
            onChange={(e) => setSkillsText(e.target.value)}
          />
          <input
            className="w-full border p-2"
            value={niceText}
            onChange={(e) => setNiceText(e.target.value)}
          />
          <textarea
            className="w-full border p-2"
            rows={3}
            value={data.notes || ""}
            onChange={(e) => setData({ ...data, notes: e.target.value })}
          />
          <div className="flex gap-2">
            <input
              className="border p-2 flex-1"
              type="date"
              value={data.dateApplied || ""}
              onChange={(e) =>
                setData({ ...data, dateApplied: e.target.value })
              }
            />
            <select
              className="border p-2"
              value={data.status}
              onChange={(e) =>
                setData({ ...data, status: e.target.value as AppStatus })
              }
            >
              <option>Applied</option>
              <option>Phone Screen</option>
              <option>Interview</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <button
            className="bg-[#1d4ed8] text-white px-3 py-2"
            onClick={() =>
              onSave({
                ...data,
                requiredSkills: splitList(skillsText),
                niceToHaveSkills: splitList(niceText)
              })
            }
          >
            save
          </button>
          <button
            className="bg-[#b91c1c] text-white px-3 py-2"
            onClick={() => onDelete(data._id)}
          >
            delete
          </button>
          <button
            className="bg-[#0f172a] text-[#cbd5e1] px-3 py-2"
            onClick={onClose}
          >
            close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardModal;
