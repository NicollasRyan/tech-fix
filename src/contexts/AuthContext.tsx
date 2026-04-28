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
import { doc, updateDoc, getDoc } from "firebase/firestore";

type AuthContextType = {
  user?: User | null;
  accessToken?: string | null;
  connectGoogleCalendar?: () => Promise<void>;
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

const GOOGLE_CONNECTION_EXPIRY_DAYS = 30;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  const connectGoogleCalendar = async () => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;

    window.location.href = `${process.env.REACT_APP_BASE_URL}/auth/google?uid=${uid}`;
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

          if (data.googleConnected) {
            if (data.googleConnectedAt) {
              const connectedAt = data.googleConnectedAt.toDate();
              const now = new Date();
              const diffInDays =
                (now.getTime() - connectedAt.getTime()) / (1000 * 60 * 60 * 24);

              if (diffInDays > GOOGLE_CONNECTION_EXPIRY_DAYS) {
                await updateDoc(userRef, {
                  googleConnected: false,
                  googleConnectedAt: null,
                });

                setGoogleConnected(false);
                setAccessToken(null);
                localStorage.removeItem("googleAccessToken");
                localStorage.removeItem("googleTokenCreated");
                setError(
                  `A conexão com Google Calendar expirou (${GOOGLE_CONNECTION_EXPIRY_DAYS} dias). Reconecte no perfil.`,
                );
              } else {
                setGoogleConnected(true);
              }
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
