import { FormEvent, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AuthForm from "./components/AuthForm";
import Board from "./components/Board";
import CardModal from "./components/CardModal";
import ParseBox from "./components/ParseBox";
import Suggestions from "./components/Suggestions";
import {
  addApplication,
  deleteApplication,
  fetchApplications,
  loginUser,
  parseJobDescription,
  registerUser,
  updateApplication
} from "./api";
import { Application, AppStatus } from "./types";

type DraftApp = {
  company: string;
  role: string;
  jdLink: string;
  notes: string;
  dateApplied: string;
  status: AppStatus;
  salaryRange: string;
  skillsText: string;
  niceSkillsText: string;
  seniority: string;
  location: string;
};

const emptyDraft = (): DraftApp => ({
  company: "",
  role: "",
  jdLink: "",
  notes: "",
  dateApplied: new Date().toISOString().slice(0, 10),
  status: "Applied",
  salaryRange: "",
  skillsText: "",
  niceSkillsText: "",
  seniority: "",
  location: ""
});

const splitList = (text: string): string[] => {
  return text
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [userData, setUserData] = useState<string>(
    localStorage.getItem("email") || ""
  );
  const [userdata, setUserdata] = useState<string>("");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [formData, setFormData] = useState<DraftApp>(emptyDraft());
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [parseLoading, setParseLoading] = useState(false);
  const [parseError, setParseError] = useState("");
  const [activeCard, setActiveCard] = useState<Application | null>(null);

  const queryClient = useQueryClient();

  const appsQuery = useQuery({
    queryKey: ["applications"],
    queryFn: () => fetchApplications(token || ""),
    enabled: !!token
  });

  const createMutation = useMutation({
    mutationFn: (payload: Partial<Application>) =>
      addApplication(token || "", payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: { id: string; payload: Partial<Application> }) =>
      updateApplication(token || "", data.id, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteApplication(token || "", id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await loginUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      setToken(data.token);
      setUserData(data.email);
      setUserdata(data.email); // not sure if needed
    } catch (err) {
      setAuthError("Login failed (check email/password)");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const data = await registerUser(email, password);
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.email);
      setToken(data.token);
      setUserData(data.email);
    } catch (err) {
      setAuthError("Register failed (maybe email already used)");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    setToken(null);
    setUserData("");
    setUserdata("");
  };

  const handleParse = async (text: string) => {
    if (!token) {
      return;
    }

    setParseLoading(true);
    setParseError("");
    try {
      const result = await parseJobDescription(token, text);
      setSuggestions(result.suggestions || []);

      setFormData((prev) => ({
        ...prev,
        company: result.parsed.company || prev.company,
        role: result.parsed.role || prev.role,
        location: result.parsed.location || prev.location,
        seniority: result.parsed.seniority || prev.seniority,
        skillsText: result.parsed.requiredSkills.join(", "),
        niceSkillsText: result.parsed.niceToHaveSkills.join(", ")
      }));
    } catch (err) {
      setParseError("AI parse failed. Try again or edit manual.");
    } finally {
      setParseLoading(false);
    }
  };

  const handleCreate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      return;
    }

    createMutation.mutate({
      company: formData.company,
      role: formData.role,
      jdLink: formData.jdLink,
      notes: formData.notes,
      dateApplied: formData.dateApplied,
      status: formData.status,
      salaryRange: formData.salaryRange,
      requiredSkills: splitList(formData.skillsText),
      niceToHaveSkills: splitList(formData.niceSkillsText),
      seniority: formData.seniority,
      location: formData.location,
      aiSuggestions: suggestions
    });

    setFormData(emptyDraft());
    setSuggestions([]);
  };

  const handleStatusChange = (id: string, status: AppStatus) => {
    updateMutation.mutate({ id, payload: { status } });
  };

  const handleSaveCard = (updated: Application) => {
    updateMutation.mutate({ id: updated._id, payload: updated });
    setActiveCard(null);
  };

  const handleDeleteCard = (id: string) => {
    deleteMutation.mutate(id);
    setActiveCard(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1115]">
        <AuthForm
          mode={authMode}
          onModeChange={setAuthMode}
          onLogin={handleLogin}
          onRegister={handleRegister}
          loading={authLoading}
          error={authError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1115] text-[#e6e6e6]">
      <header className="px-4 py-3 bg-[#161b22] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-serif">Job Tracker</h1>
          <div className="text-xs text-[#9aa4b2]">
            {userData || userdata}
          </div>
        </div>
        <button
          className="bg-[#b91c1c] text-white px-3 py-1 rounded"
          onClick={handleLogout}
        >
          logout
        </button>
      </header>

      <div className="p-4 grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1 bg-[#151a21] p-3 silly-shadow">
          <h2 className="font-bold mb-2">Add Application</h2>

          <ParseBox
            onParse={handleParse}
            loading={parseLoading}
            error={parseError}
          />

          {suggestions.length > 0 && (
            <Suggestions suggestions={suggestions} />
          )}

          <form onSubmit={handleCreate} className="mt-3 space-y-2">
            <input
              className="w-full border p-2"
              placeholder="Company"
              value={formData.company}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, company: e.target.value }))
              }
            />
            <input
              className="w-full border p-2"
              placeholder="Role"
              value={formData.role}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value }))
              }
            />
            <input
              className="w-full border p-2"
              placeholder="Location"
              value={formData.location}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, location: e.target.value }))
              }
            />
            <input
              className="w-full border p-2"
              placeholder="Seniority"
              value={formData.seniority}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, seniority: e.target.value }))
              }
            />
            <input
              className="w-full border p-2"
              placeholder="JD link"
              value={formData.jdLink}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, jdLink: e.target.value }))
              }
            />
            <input
              className="w-full border p-2"
              placeholder="Salary range (optional)"
              value={formData.salaryRange}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, salaryRange: e.target.value }))
              }
            />
            <input
              className="w-full border p-2"
              placeholder="Required skills (comma)"
              value={formData.skillsText}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, skillsText: e.target.value }))
              }
            />
            <input
              className="w-full border p-2"
              placeholder="Nice skills (comma)"
              value={formData.niceSkillsText}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  niceSkillsText: e.target.value
                }))
              }
            />
            <textarea
              className="w-full border p-2"
              placeholder="Notes"
              rows={3}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
            <div className="flex gap-2">
              <input
                className="border p-2 flex-1"
                type="date"
                value={formData.dateApplied}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    dateApplied: e.target.value
                  }))
                }
              />
              <select
                className="border p-2"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as AppStatus
                  }))
                }
              >
                <option>Applied</option>
                <option>Phone Screen</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>
            <button
              className="bg-[#1d4ed8] text-white px-3 py-2 w-full"
              type="submit"
            >
              save application
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          <div className="mb-2 text-sm text-[#9aa4b2]">
            drag cards to change status
          </div>
          {appsQuery.isLoading && <div>Loading board...</div>}
          {appsQuery.isError && <div>Something broke. refresh?</div>}
          {appsQuery.data && (
            <Board
              applications={appsQuery.data}
              onStatusChange={handleStatusChange}
              onOpen={setActiveCard}
            />
          )}
        </div>
      </div>

      {activeCard && (
        <CardModal
          application={activeCard}
          onClose={() => setActiveCard(null)}
          onSave={handleSaveCard}
          onDelete={handleDeleteCard}
        />
      )}
    </div>
  );
}

export default App;
