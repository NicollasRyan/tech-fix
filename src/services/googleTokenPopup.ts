import { getApp, getApps, initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  inMemoryPersistence,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { firebaseConfig } from "../firebase.ts";

const SECONDARY_APP_NAME = "google-calendar-popup";

function buildGoogleProvider() {
  const provider = new GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/calendar");
  provider.addScope("https://www.googleapis.com/auth/calendar.events");
  provider.setCustomParameters({
    prompt: "consent",
    access_type: "offline",
  });
  return provider;
}

export async function getGoogleCalendarAccessTokenFromPopup() {
  const app = getApps().some((item) => item.name === SECONDARY_APP_NAME)
    ? getApp(SECONDARY_APP_NAME)
    : initializeApp(firebaseConfig, SECONDARY_APP_NAME);

  const secondaryAuth = getAuth(app);
  await setPersistence(secondaryAuth, inMemoryPersistence);

  const result = await signInWithPopup(secondaryAuth, buildGoogleProvider());
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const token = credential?.accessToken ?? null;

  try {
    await signOut(secondaryAuth);
  } catch {
    // ignore signOut failures on ephemeral auth instance
  }

  if (!token) {
    throw new Error("GOOGLE_RECONNECT_FAILED");
  }

  return token;
}
