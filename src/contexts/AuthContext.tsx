import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { GoogleAuthProvider, unlink, User } from "firebase/auth";
import { auth, db, googleProvider } from "../firebase.ts";
import { onAuthStateChanged } from "firebase/auth";
import { linkWithPopup } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user?: User | null;
  accessToken?: string | null;
  connectGoogleCalendar?: () => Promise<void>;
  disconnectGoogleCalendar?: () => Promise<void>;
  googleConnected?: boolean;
  loading?: boolean;
  loadingAuth?: boolean;
  loadingData?: boolean;
  setLoadingData: (value: boolean) => void;
  error?: string | null;
  googleLoading?: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const connectGoogleCalendar = async () => {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado.");
    }

    if (googleLoading) return; // evita abrir 2 popups

    try {
      setGoogleLoading(true);

      const result = await linkWithPopup(auth.currentUser, googleProvider);

      const credential = GoogleAuthProvider.credentialFromResult(result);

      const token = credential?.accessToken || null;

      setAccessToken(token);
      setGoogleConnected(true);

      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          googleConnected: true,
          email: auth.currentUser.email,
        },
        { merge: true },
      );
    } catch (error: any) {
      if (error.code !== "auth/cancelled-popup-request") {
        console.error("Erro ao conectar Google Calendar:", error);
        setError("Essa conta do Google já está conectada a outro usuário. Tente novamente.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    if (!auth.currentUser) return;

    await unlink(auth.currentUser, "google.com");

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      googleConnected: false,
    });

    setAccessToken(null);
    setGoogleConnected(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAccessToken(null);

        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          const data = userDoc.data();
          setGoogleConnected(!!data.googleConnected);
        } else {
          setGoogleConnected(false);
        }
      } else {
        setUser(null);
        setAccessToken(null);
        setGoogleConnected(false);
      }

      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        connectGoogleCalendar,
        disconnectGoogleCalendar,
        googleConnected,
        googleLoading,
        error,
        loadingAuth,
        loadingData,
        setLoadingData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
