import React, { useEffect, useState } from "react";

import { Box, Button, Container, Grid, Modal, Typography } from "@mui/material";
import { CardService } from "../../components/CardService/index.tsx";
import { ModalAddService } from "../../components/ModalAddService/index.tsx";
import { BoxNav, BoxServices } from "./styles.ts";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase.ts";
import { Link } from "react-router-dom";

export type ServiceDoc = {
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
    arcondicionado: "Arcondicionado",
    sistemas_solares: "Sistemas Solares",
    motor_portao: "Motor de Portão",
    cameras: "Câmeras",
};

function Home() {
    const [showModal, setShowModal] = useState(false);
    const [services, setServices] = useState<ServiceDoc[]>([]);

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
                setServices(list);
            });
        });
        return () => {
            unsubscribeAuth();
            unsubscribeSnapshot?.();
        };
    }, [auth]);

    return (
        <Container>
            <BoxNav>
                <Button>Arcondicionado</Button>
                <Button>Sistemas Solares</Button>
                <Button>Motor de portão</Button>
                <Button>Câmeras</Button>
                <Button onClick={() => setShowModal(true)}>Adcionar Serviço +</Button>
            </BoxNav>

            <BoxServices>
                <Grid container spacing={2}>
                    {services.map((s) => (
                        <Grid item xs={12} md={6} lg={4} key={s.id}>
                            <Link to={`/serviceDetails/${s.id}`}>
                                <CardService
                                    title={serviceTypeLabels[s.serviceType] ?? s.serviceType}
                                    description={s.description}
                                />
                            </Link>
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