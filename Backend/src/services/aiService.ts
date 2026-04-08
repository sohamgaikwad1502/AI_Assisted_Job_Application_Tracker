type ParsedJob = {
  company: string;
  role: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  seniority: string;
  location: string;
};

type JsonMap = Record<string, unknown>;

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models";

const extractJsonText = (text: string): string => {
  const trimmed = text.trim();
  if (trimmed.startsWith("```")) {
    return trimmed
      .replace(/^```[a-zA-Z]*\n?/, "")
      .replace(/\n?```$/, "")
      .trim();
  }

  return trimmed;
};

const callGeminiJson = async (
  systemPrompt: string,
  userPrompt: string
): Promise<JsonMap> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  const model = process.env.GEMINI_MODEL || "gemini-3-flash-preview";
  const url = `${GEMINI_URL}/${encodeURIComponent(model)}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }]
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.2
      }
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini error: ${text}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };

  const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  const jsonText = extractJsonText(content);
  return JSON.parse(jsonText) as JsonMap;
};

export const parseJobDescription = async (
  jobDescription: string
): Promise<ParsedJob> => {
  const systemPrompt =
    "Extract JSON with keys: company, role, requiredSkills (array), niceToHaveSkills (array), seniority, location. Return only JSON.";

  const json = await callGeminiJson(systemPrompt, jobDescription);

  // not sure if this is best way but it works
  return {
    company: String(json.company || ""),
    role: String(json.role || ""),
    requiredSkills: Array.isArray(json.requiredSkills)
      ? json.requiredSkills.map(String)
      : [],
    niceToHaveSkills: Array.isArray(json.niceToHaveSkills)
      ? json.niceToHaveSkills.map(String)
      : [],
    seniority: String(json.seniority || ""),
    location: String(json.location || "")
  };
};

export const generateResumeSuggestions = async (
  jobDescription: string,
  roleHint: string,
  companyHint: string
): Promise<string[]> => {
  const systemPrompt =
    "Return JSON with key suggestions (array of 3-5 resume bullet points). Be specific to the job. No extra text.";

  const userPrompt = `Role: ${roleHint}\nCompany: ${companyHint}\n\n${jobDescription}`;
  const json = await callGeminiJson(systemPrompt, userPrompt);

  if (Array.isArray(json.suggestions)) {
    return json.suggestions.map(String);
  }

  return [];
};
