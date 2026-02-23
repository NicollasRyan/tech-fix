import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
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
} from "./styles.ts";
import { Box, CircularProgress, Container, IconButton } from "@mui/material";
import { ModalLogout } from "../../components/ModalLogout/index.tsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Profile() {
  const navigate = useNavigate();
  const {
    user,
    loading: authLoading,
    googleConnected,
    connectGoogleCalendar,
    disconnectGoogleCalendar,
    googleLoading,
  } = useAuth();
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loadingServices, setLoadingServices] = useState(true);
  const [userPhone, setUserPhone] = useState<string>("");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      // Buscar dados customizados do usuário (telefone)
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserPhone(userDoc.data()?.phoneNumber || "");
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        }
      };

      fetchUserData();

      // Buscar serviços do usuário
      const q = query(
        collection(db, "services"),
        where("userId", "==", user.uid),
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const servicesList: ServiceDoc[] = [];
        snapshot.forEach((doc) => {
          servicesList.push({ id: doc.id, ...doc.data() } as ServiceDoc);
        });
        setServices(servicesList);
        setLoadingServices(false);
      });

      return () => unsubscribe();
    }
  }, [user, authLoading, navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const totalServices = services.length;
  const totalValue = services.reduce((sum, service) => {
    return sum + Number(service.valueService || 0);
  }, 0);

  const totalMaintenances = services.reduce((sum, service) => {
    return (
      sum +
      (Array.isArray(service.manutencoes) ? service.manutencoes.length : 0)
    );
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
            <Title>Editar Perfil</Title>
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

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* Status */}
            <InfoValue
              style={{
                color: googleConnected ? "#2e7d32" : "#d32f2f",
                fontWeight: 600,
              }}
            >
              {googleConnected ? "● Conectada" : "● Não conectada"}
            </InfoValue>

            {/* Botão */}
            {googleConnected ? (
              <button
                onClick={disconnectGoogleCalendar}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1px solid #d32f2f",
                  background: "transparent",
                  color: "#d32f2f",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Desconectar
              </button>
            ) : (
              <button
                onClick={connectGoogleCalendar}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: "#4285F4",
                  color: "#fff",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                {googleLoading ? "Conectando..." : "Conectar Google"}
              </button>
            )}
          </div>
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
          <StatValue>R$ {totalValue.toFixed(2)}</StatValue>
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
    </ContainerProfile>
  );
}

export default Profile;
