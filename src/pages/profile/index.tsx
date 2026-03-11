import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
} from "firebase/firestore";
import { auth, db } from "../../firebase.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import type { ServiceDoc } from "../../types/service.ts";
import {
  Header,
  Title,
  UserInfoCard,
  InfoRow,
  InfoLabel,
  InfoValue,
  StatsContainer,
  StatCard,
  StatValue,
  StatLabel,
  ButtonLogout,
  ActionButtons,
  ContainerProfile,
  ButtonEdit,
  LogoutIconButton,
} from "./styles.ts";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import { ModalLogout } from "../../components/ModalLogout/index.tsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Logout, Login } from "@mui/icons-material";
import React from "react";

function Profile() {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    googleConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    error,
    clearError,
  } = useAuth();
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [userPhone, setUserPhone] = useState<string>("");
  const [feedback, setFeedback] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const location = useLocation()

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      const userRef = doc(db, "users", user.uid);

      const unsubscribeUser = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUserPhone(docSnap.data()?.phoneNumber || "");
        }
      });

      const q = query(
        collection(db, "services"),
        where("userId", "==", user.uid),
      );

      const unsubscribeServices = onSnapshot(q, (snapshot) => {
        const servicesList: ServiceDoc[] = [];

        snapshot.forEach((doc) => {
          servicesList.push({ id: doc.id, ...doc.data() } as ServiceDoc);
        });

        setServices(servicesList);
        setLoadingServices(false);
      });

      return () => {
        unsubscribeUser();
        unsubscribeServices();
      };
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);

  if (params.get("googleConnected") === "true") {
    setFeedback({
      open: true,
      severity: "success",
      message: "Google Calendar conectado com sucesso.",
    });
  }

  if (params.get("googleError")) {
    setFeedback({
      open: true,
      severity: "error",
      message: "Erro ao conectar com o Google.",
    });
  }

    if (!error) return;
    setFeedback({
      open: true,
      severity: "error",
      message: error,
    });
    clearError?.();
  }, [clearError, error, location]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      setFeedback({
        open: true,
        severity: "error",
        message: "Erro ao fazer logout.",
      });
    }
  };

  const handleConnectGoogle = async () => {
    try {
      await connectGoogleCalendar?.();
    } catch (error) {
      console.error("Erro ao conectar Google Calendar:", error);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await disconnectGoogleCalendar?.();
      setFeedback({
        open: true,
        severity: "success",
        message: "Google Calendar desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao desconectar Google Calendar:", error);
      setFeedback({
        open: true,
        severity: "error",
        message: "Erro ao desconectar Google Calendar.",
      });
    }
  };

  const totalServices = services.length;
  const totalValue = services.reduce((total, service) => {
    if (!service) return total;

    const serviceValue = Number(service.valueService ?? 0);

    const maintenanceValue = Array.isArray(service.manutencoes)
      ? service.manutencoes.reduce(
          (sum, m) => sum + Number(m?.valueService ?? 0),
          0,
        )
      : 0;

    return total + serviceValue + maintenanceValue;
  }, 0);

  const totalMaintenances = services.reduce((total, service) => {
    const maintenanceCount = (service.manutencoes || []).length;
    return total + maintenanceCount;
  }, 0);

  const servicesWithNotification = services.filter(
    (service) => service.notificationDate,
  ).length;

  if (authLoading || loadingServices) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ContainerProfile>
      <Header>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate("/")} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Title>Meu Perfil</Title>
          </Box>
        </Box>
        <ActionButtons>
          <ButtonEdit onClick={() => navigate("/profile/edit")}>
            Editar
          </ButtonEdit>
          <ButtonLogout onClick={() => setShowLogoutModal(true)}>
            Sair
          </ButtonLogout>
        </ActionButtons>
      </Header>

      <UserInfoCard>
        <InfoRow>
          <InfoLabel>Email</InfoLabel>
          <InfoValue>{user.email || "-"}</InfoValue>
        </InfoRow>

        <InfoRow>
          <InfoLabel>Nome</InfoLabel>
          <InfoValue>{user.displayName || "-"}</InfoValue>
        </InfoRow>

        <InfoRow>
          <InfoLabel>Numero de telefone</InfoLabel>
          <InfoValue>{userPhone || "-"}</InfoValue>
        </InfoRow>

        <InfoRow>
          <InfoLabel>Conta Google</InfoLabel>

          <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
            <InfoValue
              sx={{
                color: googleConnected ? "#2e7d32" : "#d32f2f",
                fontWeight: 600,
              }}
            >
              {googleConnected ? "● Conectada" : "● Não conectada"}
            </InfoValue>
            {isMobile ? (
              googleConnected ? (
                <LogoutIconButton onClick={handleDisconnectGoogle} size="small">
                  <Logout />
                </LogoutIconButton>
              ) : (
                <IconButton
                  onClick={handleConnectGoogle}
                  size="small"
                  sx={{
                    borderRadius: 2,
                    border: "1px solid #2e7d32",
                    color: "#2e7d32",
                    "&:hover": {
                      backgroundColor: "rgba(46, 125, 34, 0.08)",
                    },
                  }}
                >
                  <Login />
                </IconButton>
              )
            ) : googleConnected ? (
              <Button
                onClick={handleDisconnectGoogle}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#b71c1c",
                    backgroundColor: "rgba(211, 47, 47, 0.04)",
                  },
                }}
              >
                Desconectar
              </Button>
            ) : (
              <Button
                onClick={handleConnectGoogle}
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: 2,
                  borderColor: "#2e7d32",
                  color: "#2e7d32",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#1b5e20",
                    backgroundColor: "rgba(46, 125, 34, 0.04)",
                  },
                }}
              >
                Conectar
              </Button>
            )}
          </Box>
        </InfoRow>

        <InfoRow>
          <InfoLabel>Data de Cadastro</InfoLabel>
          <InfoValue>
            {user.metadata?.creationTime
              ? new Date(user.metadata.creationTime).toLocaleDateString("pt-BR")
              : "-"}
          </InfoValue>
        </InfoRow>
      </UserInfoCard>

      <Box>
        <Title>Resumo de Serviços</Title>
      </Box>

      <StatsContainer>
        <StatCard>
          <StatValue>{totalServices}</StatValue>
          <StatLabel>Total de Serviços</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>
            {totalValue.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </StatValue>
          <StatLabel>Valor Total</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{totalMaintenances}</StatValue>
          <StatLabel>Total de Manutenções</StatLabel>
        </StatCard>

        <StatCard>
          <StatValue>{servicesWithNotification}</StatValue>
          <StatLabel>Serviços com Notificação</StatLabel>
        </StatCard>
      </StatsContainer>

      <ModalLogout
        showModal={showLogoutModal}
        setShowModal={setShowLogoutModal}
        handleLogout={handleLogout}
      />
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </ContainerProfile>
  );
}

export default Profile;
