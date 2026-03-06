import { useEffect, useState } from "react";
import Grid from "@mui/material/GridLegacy";
import {
  Alert,
  AlertTitle,
  Container,
  MenuItem,
  CircularProgress,
  Box,
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
import { useNavigate } from "react-router-dom";
import React from "react";

type FilterType = "all" | ServiceType;

function Home() {
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const { googleConnected, loadingData, setLoadingData } = useAuth();
  const navigate = useNavigate();

  console.log("Google Connected:", googleConnected);

  useEffect(() => {
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
          const ta = a?.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tb = b?.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
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
  }, [setLoadingData]);

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
                      createdAt={service.createdAt as { toDate: () => Date }}
                    />
                  </LinkToService>
                </Grid>
              ))}
          </Grid>
        ) : (
          <NoService />
        )}
      </BoxServices>
    </Container>
  );
}

export default Home;
