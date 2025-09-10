export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

const getEnv = (key: string): string | undefined => {
  // Vite exposes client envs via import.meta.env
  // We keep it typed as string for convenience
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const env = (import.meta as any).env?.[key] as string | undefined
  return env
}

const BASE_URL = (getEnv("VITE_API_BASE_URL") || "").trim()

// Configurable auth endpoint paths (optional)
const LOGIN_PATH = (getEnv("VITE_AUTH_LOGIN_PATH") || "/auth/login").trim()
const SIGNUP_PATH = (getEnv("VITE_AUTH_SIGNUP_PATH") || "/auth/register").trim()
const PROFILE_PATH = (getEnv("VITE_AUTH_ME_PATH") || "/auth/me").trim()

export const apiBase = BASE_URL || "" // same-origin by default

export type RequestOptions = {
  method?: HttpMethod
  headers?: Record<string, string>
  query?: Record<string, string | number | boolean | null | undefined>
  body?: unknown
  auth?: boolean
  signal?: AbortSignal
}

const buildUrl = (path: string, query?: RequestOptions["query"]) => {
  const url = new URL(path, apiBase || window.location.origin)
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v))
    })
  }
  return url.toString()
}

export async function request<T = unknown>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", headers, body, query, auth = true, signal } = opts

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers || {}),
  }

  if (auth) {
    const token = localStorage.getItem("auth_token")
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
    credentials: "include",
  })

  const text = await res.text()
  let json: unknown
  try {
    json = text ? JSON.parse(text) : undefined
  } catch {
    json = text as unknown
  }

  if (!res.ok) {
    const message = (json as any)?.message || (json as any)?.error || res.statusText
    const error = new Error(typeof message === "string" ? message : "Request failed") as Error & {
      status?: number
      data?: unknown
    }
    error.status = res.status
    error.data = json
    throw error
  }

  return json as T
}

export type AuthResult = {
  token: string
  user?: any
}

function extractToken(data: any): string | null {
  if (!data) return null
  return (
    data.token || data.accessToken || data.jwt || data.id_token || data.idToken || null
  )
}

export const authApi = {
  async login(credentials: { email: string; password: string }): Promise<AuthResult> {
    const data = await request<any>(LOGIN_PATH, { method: "POST", body: credentials, auth: false })
    const token = extractToken(data)
    if (!token) throw new Error("Token not found in response")
    return { token, user: data.user ?? data.profile ?? data }
  },
  async signup(payload: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirm: string;
  }): Promise<AuthResult> {
    const data = await request<any>(SIGNUP_PATH, { method: "POST", body: payload, auth: false })
    const token = extractToken(data)
    if (!token) throw new Error("Token not found in response")
    return { token, user: data.user ?? data.profile ?? data }
  },
  async me(): Promise<any> {
    return request<any>(PROFILE_PATH, { method: "GET" })
  },
}
