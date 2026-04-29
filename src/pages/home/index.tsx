import { useEffect, useState } from "react";
import Grid from "@mui/material/GridLegacy";
import {
  Alert,
  AlertTitle,
  Container,
  MenuItem,
  CircularProgress,
  Box,
  Snackbar,
} from "@mui/material";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { CardService } from "../../components/CardService/index.tsx";
import { auth, db } from "../../firebase.ts";
import {
  normalizeServiceType,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
  type ServiceType,
} from "../../constants/serviceTypes.ts";
import type { ServiceDoc } from "../../types/service.ts";
import {
  BoxNav,
  BoxSelect,
  BoxServices,
  ButtonAddService,
  Label,
  LinkToService,
  SelectTypeService,
} from "./styles.ts";
import { NoService } from "../../components/NoService/index.tsx";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import React from "react";
import { getServicePrimaryDate, toJsDate } from "../../utils/firestoreDate.ts";

type FilterType = "all" | ServiceType;

function Home() {
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const authContext = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [feedback, setFeedback] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!authContext) return; // Verificação dentro do useEffect

    const { setLoadingData } = authContext;
    let unsubscribeSnapshot: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeSnapshot?.();
      setLoadingData(true);
      if (!user) {
        setServices([]);
        setLoadingData(false);
        return;
      }

      const servicesRef = collection(db, "services");
      const q = query(servicesRef, where("userId", "==", user.uid));
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((serviceDoc) => ({
          id: serviceDoc.id,
          ...serviceDoc.data(),
        })) as ServiceDoc[];

        list.sort((a, b) => {
          const ta = toJsDate(getServicePrimaryDate(a))?.getTime() ?? 0;
          const tb = toJsDate(getServicePrimaryDate(b))?.getTime() ?? 0;
          return tb - ta;
        });

        setServices(list);
        setLoadingData(false);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Intencionalmente vazio - só roda na montagem

  useEffect(() => {
    const stateFeedback = (location.state as any)?.feedback;
    if (!stateFeedback?.message) return;

    setFeedback({
      open: true,
      severity: stateFeedback.severity === "error" ? "error" : "success",
      message: stateFeedback.message,
    });
    navigate(location.pathname, { replace: true });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!authContext?.error) return;

    setFeedback({
      open: true,
      severity: "error",
      message: authContext.error,
    });
    authContext.clearError?.();
  }, [authContext.error, authContext.clearError, authContext]);

  // Verificação condicional APÓS todos os hooks
  if (!authContext) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Erro</AlertTitle>
          Contexto de autenticação não encontrado
        </Alert>
      </Container>
    );
  }

  const { googleConnected, loadingData } = authContext;

  return (
    <Container>
      <BoxNav>
        <BoxSelect>
          <Label>Tipos de Servico:</Label>
          <SelectTypeService
            sx={{
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
          >
            <MenuItem value="all">Todos...</MenuItem>
            {SERVICE_TYPES.map((serviceType) => (
              <MenuItem key={serviceType} value={serviceType}>
                {SERVICE_TYPE_LABELS[serviceType]}
              </MenuItem>
            ))}
          </SelectTypeService>
        </BoxSelect>
        <ButtonAddService onClick={() => navigate("/addService")}>
          Adicionar Servico +
        </ButtonAddService>
      </BoxNav>

      {googleConnected ? (
        <></>
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>
          <AlertTitle>Google Calendar não conectado</AlertTitle>
          Para usar a funcionalidade de notificações, conecte sua conta do
          Google Calendar nas configurações do perfil.
        </Alert>
      )}

      <BoxServices>
        {loadingData ? (
          <Box sx={{ display: "flex", justifyContent: "center", p: 6 }}>
            <CircularProgress />
          </Box>
        ) : services.length > 0 ? (
          <Grid container spacing={2}>
            {services
              .filter((service) =>
                filter === "all"
                  ? true
                  : normalizeServiceType(service.serviceType) === filter,
              )
              .map((service) => (
                <Grid item xs={12} md={6} lg={4} key={service.id}>
                  <LinkToService to={`/serviceDetails/${service.id}`}>
                    <CardService
                      serviceType={service.serviceType}
                      city={service?.city}
                      clientName={service.clientName}
                      serviceDate={getServicePrimaryDate(service)}
                    />
                  </LinkToService>
                </Grid>
              ))}
          </Grid>
        ) : (
          <NoService />
        )}
      </BoxServices>

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
    </Container>
  );
}

export default Home;
