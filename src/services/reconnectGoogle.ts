import { getGoogleCalendarAccessTokenFromPopup } from "./googleTokenPopup.ts";

export async function reconnectGoogle() {
  const newToken = await getGoogleCalendarAccessTokenFromPopup();
  localStorage.setItem("googleAccessToken", newToken);
  localStorage.setItem("googleTokenCreated", Date.now().toString());
  window.dispatchEvent(
    new CustomEvent("google-token-updated", { detail: { token: newToken } }),
  );
  return newToken;
}
