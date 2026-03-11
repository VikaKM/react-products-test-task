const AUTH_STORAGE_KEY = "auth_data";

export interface AuthData {
  accessToken: string;
  refreshToken: string;
}

export function saveAuthData(data: AuthData, rememberMe: boolean) {
  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
}

export function getAuthData(): AuthData | null {
  const data =
    localStorage.getItem(AUTH_STORAGE_KEY) ??
    sessionStorage.getItem(AUTH_STORAGE_KEY);

  return data ? (JSON.parse(data) as AuthData) : null;
}

export function clearAuthData() {
  localStorage.removeItem(AUTH_STORAGE_KEY);
  sessionStorage.removeItem(AUTH_STORAGE_KEY);
}
