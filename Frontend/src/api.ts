import { Application, ParseResult } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const jsonHeaders = {
  "Content-Type": "application/json"
};

const authHeader = (token: string) => ({
  Authorization: `Bearer ${token}`
});

type AuthResponse = { token: string; email: string };

export const registerUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Register failed");
  }

  return (await res.json()) as AuthResponse;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ email, password })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return (await res.json()) as AuthResponse;
};

export const fetchApplications = async (
  token: string
): Promise<Application[]> => {
  const res = await fetch(`${API_URL}/applications`, {
    headers: {
      ...authHeader(token)
    }
  });

  if (!res.ok) {
    throw new Error("Fetch failed");
  }

  return (await res.json()) as Application[];
};

export const addApplication = async (
  token: string,
  payload: Partial<Application>
): Promise<Application> => {
  const res = await fetch(`${API_URL}/applications`, {
    method: "POST",
    headers: {
      ...jsonHeaders,
      ...authHeader(token)
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Create failed");
  }

  return (await res.json()) as Application;
};

export const updateApplication = async (
  token: string,
  id: string,
  payload: Partial<Application>
): Promise<Application> => {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: "PUT",
    headers: {
      ...jsonHeaders,
      ...authHeader(token)
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error("Update failed");
  }

  return (await res.json()) as Application;
};

export const deleteApplication = async (
  token: string,
  id: string
): Promise<void> => {
  const res = await fetch(`${API_URL}/applications/${id}`, {
    method: "DELETE",
    headers: {
      ...authHeader(token)
    }
  });

  if (!res.ok) {
    throw new Error("Delete failed");
  }
};

export const parseJobDescription = async (
  token: string,
  jobDescription: string
): Promise<ParseResult> => {
  const res = await fetch(`${API_URL}/ai/parse`, {
    method: "POST",
    headers: {
      ...jsonHeaders,
      ...authHeader(token)
    },
    body: JSON.stringify({ jobDescription })
  });

  if (!res.ok) {
    throw new Error("AI parse failed");
  }

  return (await res.json()) as ParseResult;
};
