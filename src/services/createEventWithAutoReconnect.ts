import { createCalendarEvent } from "./calendarService.ts";
import { reconnectGoogle } from "./reconnectGoogle.ts";

export async function createEventWithAutoReconnect(
  token: string,
  eventData: any,
) {
  try {
    return await createCalendarEvent(token, eventData);
  } catch (error: any) {
    if (error.message === "GOOGLE_TOKEN_EXPIRED") {
      const newToken = await reconnectGoogle();
      return await createCalendarEvent(newToken, eventData);
    }

    throw error;
  }
}
