import { useEffect, useState } from "react";

import Grid from "@mui/material/GridLegacy";

import { Container, MenuItem } from "@mui/material";
import { CardService } from "../../components/CardService/index.tsx";
import { ModalAddService } from "../../components/ModalAddService/index.tsx";
import {
  BoxNav,
  BoxSelect,
  BoxServices,
  ButtonAddService,
  Label,
  LinkToService,
  SelectTypeService,
} from "./styles.ts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase.ts";

export type ServiceDoc = {
  manutencoes: any;
  id: string;
  clientName: string;
  serviceType: string;
  description: string;
  valueService: string;
  notificationDate: { toDate: () => Date } | null;
  userId: string;
  createdAt: { toDate: () => Date };
};

const serviceTypeLabels: Record<string, string> = {
  all: "todos...",
  arcondicionado: "Arcondicionado",
  sistemas_solares: "Sistemas Solares",
  motor_portao: "Motor de Portão",
  cameras: "Câmeras",
};

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [services, setServices] = useState<ServiceDoc[]>([]);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      unsubscribeSnapshot?.();
      if (!user) {
        setServices([]);
        return;
      }
      const servicesRef = collection(db, "services");
      const q = query(servicesRef, where("userId", "==", user.uid));
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ServiceDoc[];
        // Ordenação no cliente como fallback (do mais recente para o mais antigo)
        list.sort((a, b) => {
          const ta = a?.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0;
          const tb = b?.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0;
          return tb - ta;
        });
        setServices(list);
      });
    });
    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot?.();
    };
  }, []);

  return (
    <Container>
      <BoxNav>
        <BoxSelect>
          <Label>Tipos de Serviço:</Label>
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
          onChange={(e) => setFilter(e.target.value as string)}
        >
          {Object.entries(serviceTypeLabels).map(([key, label]) => (
            <MenuItem key={key} value={key}>
              {label}
            </MenuItem>
          ))}
        </SelectTypeService>
        </BoxSelect>
        <ButtonAddService onClick={() => setShowModal(true)}>
          Adcionar Serviço +
        </ButtonAddService>
      </BoxNav>

      <BoxServices>
        <Grid container spacing={2}>
          {services
            .filter((s) => (filter === "all" ? true : s.serviceType === filter))
            .map((s) => (
            <Grid item xs={12} md={6} lg={4} key={s.id}>
              <LinkToService to={`/serviceDetails/${s.id}`}>
                <CardService
                  serviceType={
                    serviceTypeLabels[s.serviceType] ?? s?.serviceType
                  }
                  clientName={s?.clientName}
                  createdAt={s?.createdAt}
                  notificationDate={s?.notificationDate}
                />
              </LinkToService>
            </Grid>
          ))}
        </Grid>
      </BoxServices>
      {showModal && (
        <ModalAddService showModal={showModal} setShowModal={setShowModal} />
      )}
    </Container>
  );
}

export default Home;
