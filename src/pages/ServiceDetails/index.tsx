import { Button, Container, Typography } from "@mui/material";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase.ts";
import { ServiceDoc } from "../Home";
import { ModalAddService } from "../../components/ModalAddService/index.tsx";

function ServiceDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [service, setService] = useState<ServiceDoc | null>(null);
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);

    const fetchService = () => {
        if (!id) return;
        setLoading(true);
        getDoc(doc(db, "services", id))
            .then((snap) => {
                if (snap.exists())
                    setService({ id: snap.id, ...snap.data() } as ServiceDoc);
                setLoading(false);
            })
            .catch((err) => {
                console.error("getDoc error", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchService();
    }, [id]);
    console.log(    service)

    const handleCloseEditModal = (open: boolean) => {
        setShowEditModal(open);
        if (!open) fetchService();
    };

    return (
        <Container>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
            {!loading && service && (
                <>
                    <h1>Service Details {id}</h1>
                    <Button onClick={() => setShowEditModal(true)}>Editar</Button>
                    <Typography>Cliente: {service.clientName}</Typography>
                    <Typography>Descrição: {service.description}</Typography>
                    <Typography>Valor: {service.valueService}</Typography>
                    <Typography>Data: {service.createdAt?.toDate?.()?.toLocaleDateString() ?? "-"}</Typography>
                    <Typography>Tipo de Serviço: {service.serviceType}</Typography>
                    <Typography>Notificações: {service.notificationDate?.toDate?.()?.toLocaleDateString() ?? "-"}</Typography>

                    <ModalAddService
                        showModal={showEditModal}
                        setShowModal={handleCloseEditModal}
                        serviceId={service.id}
                        initialData={{
                            clientName: service.clientName,
                            serviceType: service.serviceType,
                            description: service.description,
                            valueService: service.valueService,
                            notificationDate: service.notificationDate ?? null,
                        }}
                    />
                </>
            )}
        </Container>
    );
}

export default ServiceDetails;