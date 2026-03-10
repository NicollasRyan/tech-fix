import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User } from "firebase/auth";
import { auth, db } from "../firebase.ts";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, updateDoc, getDoc } from "firebase/firestore";
import { getGoogleCalendarAccessTokenFromPopup } from "../services/googleTokenPopup.ts";

type AuthContextType = {
  user?: User | null;
  accessToken?: string | null;
  connectGoogleCalendar?: () => Promise<boolean>;
  disconnectGoogleCalendar?: () => Promise<void>;
  clearError?: () => void;
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

    if (googleLoading) return false;

    try {
      setGoogleLoading(true);
      const token = await getGoogleCalendarAccessTokenFromPopup();

      setAccessToken(token);
      setGoogleConnected(true);

      if (token) {
        localStorage.removeItem("googleAccessToken");
        localStorage.removeItem("googleTokenCreated");
        localStorage.setItem("googleAccessToken", token);
        localStorage.setItem("googleTokenCreated", Date.now().toString());
      }
      setError(null);

      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          googleConnected: true,
          googleConnectedAt: new Date(),
          email: auth.currentUser.email,
        },
        { merge: true },
      );
      return true;
    } catch (error: any) {
      if (error.code === "auth/cancelled-popup-request") return false;
      console.error("Erro ao conectar Google Calendar:", error);
      setError(
        "Não foi possível concluir a conexão com Google Calendar. Tente novamente.",
      );
      throw error;
    } finally {
      setGoogleLoading(false);
    }
  };

  const disconnectGoogleCalendar = async () => {
    if (!auth.currentUser) return;

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      googleConnected: false,
    });

    setAccessToken(null);
    setGoogleConnected(false);
    setError(null);
    localStorage.removeItem("googleAccessToken");
    localStorage.removeItem("googleTokenCreated");
  };

  const clearError = () => setError(null);

  useEffect(() => {
    const onTokenExpired = () => {
      setError("Sua sessão do Google expirou. Reconecte para continuar.");
    };

    const onTokenUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{ token?: string }>;
      const token = customEvent.detail?.token;
      if (!token) return;
      setAccessToken(token);
      setGoogleConnected(true);
      setError(null);
    };

    window.addEventListener("google-token-expired", onTokenExpired);
    window.addEventListener(
      "google-token-updated",
      onTokenUpdated as EventListener,
    );

    return () => {
      window.removeEventListener("google-token-expired", onTokenExpired);
      window.removeEventListener(
        "google-token-updated",
        onTokenUpdated as EventListener,
      );
    };
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const userRef = doc(db, "users", currentUser.uid);
        const userDoc = await getDoc(userRef);

        const savedToken = localStorage.getItem("googleAccessToken");
        const tokenCreated = localStorage.getItem("googleTokenCreated");

        if (savedToken && tokenCreated) {
          const diff = Date.now() - Number(tokenCreated);
          const oneHour = 1000 * 60 * 60;

          if (diff < oneHour) {
            setAccessToken(savedToken);
          } else {
            localStorage.removeItem("googleAccessToken");
            localStorage.removeItem("googleTokenCreated");
            setAccessToken(null);
            setError("Sua sessão do Google expirou. Reconecte para continuar.");
          }
        } else {
          setAccessToken(null);
        }

        if (userDoc.exists()) {
          const data = userDoc.data();

          if (data.googleConnected && data.googleConnectedAt) {
            const connectedAt = data.googleConnectedAt.toDate() ?? new Date();
            const now = new Date();
            const diffInDays =
              (now.getTime() - connectedAt.getTime()) / (1000 * 60 * 60 * 24);

            if (diffInDays > 30) {
              await updateDoc(userRef, {
                googleConnected: false,
                googleConnectedAt: null,
              });

              setGoogleConnected(false);
              setAccessToken(null);
              localStorage.removeItem("googleAccessToken");
              localStorage.removeItem("googleTokenCreated");
              setError(
                "A conexão com Google Calendar expirou (30 dias). Reconecte no perfil.",
              );
            } else {
              setGoogleConnected(true);
            }
          } else {
            setGoogleConnected(false);
          }
        } else {
          setGoogleConnected(false);
        }
      } else {
        setUser(null);
        setAccessToken(null);
        setGoogleConnected(false);
        localStorage.removeItem("googleAccessToken");
        localStorage.removeItem("googleTokenCreated");
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
        clearError,
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
