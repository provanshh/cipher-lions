import apiClient from "./client";

export interface SuperSafeSettings {
  enabled: boolean;
  voiceMessageUrl: string | null;
}

export interface AllowedSite {
  _id: string;
  domain: string;
  createdAt: string;
}

export async function fetchSuperSafeSettings(): Promise<SuperSafeSettings> {
  const { data } = await apiClient.get("/api/supersafe/settings");
  return data;
}

export async function updateSuperSafeToggle(enabled: boolean): Promise<SuperSafeSettings> {
  const { data } = await apiClient.put("/api/supersafe/toggle", { enabled });
  return data;
}

export async function fetchAllowedSites(): Promise<AllowedSite[]> {
  const { data } = await apiClient.get("/api/supersafe/allowed-sites");
  return data;
}

export async function addAllowedSite(domain: string): Promise<AllowedSite> {
  const { data } = await apiClient.post("/api/supersafe/allowed-sites", { domain });
  return data;
}

export async function deleteAllowedSite(id: string): Promise<void> {
  await apiClient.delete(`/api/supersafe/allowed-sites/${id}`);
}

export async function uploadVoiceMessage(formData: FormData): Promise<{ voiceMessageUrl: string }> {
  // Let axios set the correct multipart boundary automatically.
  const { data } = await apiClient.post("/api/supersafe/voice-message", formData);
  return data;
}

export async function fetchVoiceMessage(): Promise<{ voiceMessageUrl: string | null }> {
  const { data } = await apiClient.get("/api/supersafe/voice-message");
  return data;
}

