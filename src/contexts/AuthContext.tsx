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

    if (googleLoading) return;

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

      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          googleConnected: true,
          googleConnectedAt: new Date(),
          email: auth.currentUser.email,
        },
        { merge: true },
      );
    } catch (error: any) {
      if (error.code !== "auth/cancelled-popup-request") {
        console.error("Erro ao conectar Google Calendar:", error);
        setError(
          "Não foi possível concluir a conexão com Google Calendar. Tente novamente.",
        );
      }
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
    localStorage.removeItem("googleAccessToken");
    localStorage.removeItem("googleTokenCreated");
  };

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
          }
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
