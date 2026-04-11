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

const callGroqJson = async (
  systemPrompt: string,
  userPrompt: string
): Promise<JsonMap> => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY missing");
  }

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      model: model,
      response_format: { type: "json_object" },
      temperature: 0.2
    })
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq error: ${text}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };

  const content = data.choices?.[0]?.message?.content || "{}";
  const jsonText = extractJsonText(content);
  return JSON.parse(jsonText) as JsonMap;
};

export const parseJobDescription = async (
  jobDescription: string
): Promise<ParsedJob> => {
  const systemPrompt =
    "Extract JSON with keys: company, role, requiredSkills (array), niceToHaveSkills (array), seniority, location. Return only JSON.";

    const json = await callGroqJson(systemPrompt, jobDescription);

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
    const json = await callGroqJson(systemPrompt, userPrompt);

  if (Array.isArray(json.suggestions)) {
    return json.suggestions.map(String);
  }

  return [];
};
