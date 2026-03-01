import {
  Container,
  Grid,
  IconButton,
  Table,
  Typography,
  Stack,
  Chip,
  Box,
} from "@mui/material";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth, db } from "../../firebase.ts";
import type { ServiceDoc } from "../../types/service.ts";
import { ModalDeleteService } from "../../components/ModalDeleteService/index.tsx";
import { ModalAddNotification } from "../../components/ModalAddNotification/index.tsx";
import {
  normalizeServiceType,
  SERVICE_TYPE_LABELS,
} from "../../constants/serviceTypes.ts";
import {
  BoxActions,
  BoxButtons,
  BoxInfo,
  BoxMaintenances,
  ButtonAddModification,
  ButtonAddNotification,
  ButtonDelete,
  ButtonEdit,
  CardDateBox,
  CardDescription,
  CardFooter,
  CardParts,
  CardRightContent,
  CardServiceContent,
  CardTitle,
  CardTitleRow,
  CardValue,
  EmptyMaintenances,
  InfoItem,
  InfoLabelCell,
  MaintenancesTitle,
  TableValue,
} from "./styles.ts";
import React from "react";

const CardService = ({
  title,
  date,
  description,
  usedParts,
  valueService,
  id,
  maintenanceId,
  showDeleteMaintenance,
  setShowDeleteMaintenance,
  submitAction,
}: any) => {
  const navigate = useNavigate();
  const safeParts = Array.isArray(usedParts) ? usedParts : [];

  return (
    <CardServiceContent>
      {/* Left date box */}
      <CardDateBox>{date.toDate().toLocaleDateString("pt-BR")}</CardDateBox>

      {/* Right content */}
      <CardRightContent>
        <CardTitleRow>
          <CardTitle>{title}</CardTitle>
          <CardValue>
            <Typography>
              {Number(valueService || 0).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Typography>
          </CardValue>
        </CardTitleRow>

        <CardDescription>{description || "---"}</CardDescription>

        <CardFooter>
          <CardParts>
            <strong>Peças:</strong>
            {safeParts && safeParts.length > 0 ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
                {safeParts.map((part: string, index: number) => (
                  <Chip key={index} label={part} size="small" sx={{ mt: 1 }} />
                ))}
              </Box>
            ) : (
              " -"
            )}
          </CardParts>

          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              size="small"
              sx={{
                backgroundColor: "#f5f5f5",
                "&:hover": { backgroundColor: "#e0e0e0" },
              }}
              onClick={() =>
                navigate(`/edit-maintenance/${id}/${maintenanceId}`)
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => setShowDeleteMaintenance(true)}
              size="small"
              sx={{
                backgroundColor: "#fdecea",
                "&:hover": { backgroundColor: "#f8d7da" },
              }}
            >
              <DeleteIcon fontSize="small" color="error" />
            </IconButton>
          </Stack>
        </CardFooter>
      </CardRightContent>
      <ModalDeleteService
        showModal={showDeleteMaintenance}
        setShowModal={setShowDeleteMaintenance}
        submitAction={submitAction}
      />
    </CardServiceContent>
  );
};

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteMaintenance, setShowDeleteMaintenance] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const safeParts = Array.isArray(service?.usedParts) ? service.usedParts : [];

  const fetchService = () => {
    if (!id) return;
    const user = auth.currentUser;
    if (!user) {
      navigate("/login");
      return;
    }

    setLoading(true);
    getDoc(doc(db, "services", id))
      .then((snap) => {
        if (!snap.exists()) {
          setService(null);
          setLoading(false);
          return;
        }

        const data = { id: snap.id, ...snap.data() } as ServiceDoc;
        if (data.userId !== user.uid) {
          setLoading(false);
          navigate("/");
          return;
        }

        setService(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("getDoc error", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchService();
  }, []);

  const deleteMaintenance = async (maintenanceId: string) => {
    if (!service) return;

    const updated = (service.manutencoes || []).filter(
      (maintenance: any) => maintenance.id !== maintenanceId,
    );

    await updateDoc(doc(db, "services", service.id), {
      manutencoes: updated,
      updatedAt: Timestamp.now(),
    });

    fetchService();
  };

  const handleDelete = async () => {
    if (!service?.id) return;
    try {
      await deleteDoc(doc(db, "services", service.id));
      setShowDeleteModal(false);
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      alert("Erro ao excluir serviço");
    }
  };

  return (
    <Container>
      <BoxButtons>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <BoxActions>
          <ButtonAddModification
            onClick={() => navigate(`/addMaintenance/${id}`)}
          >
            Adicionar Manuteção
          </ButtonAddModification>
          <ButtonEdit onClick={() => navigate("/edit-service/" + id)}>
            Editar
          </ButtonEdit>
          <ButtonDelete onClick={() => setShowDeleteModal(true)}>
            Deletar
          </ButtonDelete>
        </BoxActions>
      </BoxButtons>
      {!loading && service && (
        <>
        <BoxInfo>
          <Table>
            {/* DATAS */}
            <InfoItem>
              <InfoLabelCell component="th" scope="row">
                <strong>DATAS</strong>
              </InfoLabelCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Data de Criação</InfoLabelCell>
              <TableValue>
                {service.createdAt?.toDate?.()?.toLocaleDateString() ?? "-"}
              </TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Notificação</InfoLabelCell>
              <TableValue>
                {service.notificationDate?.toDate?.()?.toLocaleDateString() ?? (
                  <ButtonAddNotification
                    onClick={() => setShowNotificationModal(true)}
                  >
                    Adicionar Notificação <AddIcon />
                  </ButtonAddNotification>
                )}
              </TableValue>
            </InfoItem>
            {/* DADOS DO CLIENTE */}
            <InfoItem>
              <InfoLabelCell component="th" scope="row">
                <strong>CLIENTE</strong>
              </InfoLabelCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Nome</InfoLabelCell>
              <TableValue>{service.clientName || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Telefone</InfoLabelCell>
              <TableValue>{service.phone || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Email</InfoLabelCell>
              <TableValue>{service.email || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">CPF</InfoLabelCell>
              <TableValue>{service.cpf || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Endereço</InfoLabelCell>
              <TableValue>{service.address || "-"}</TableValue>
            </InfoItem>

            {/* DADOS DO SERVIÇO */}
            <InfoItem>
              <InfoLabelCell component="th" scope="row">
                <strong>SERVIÇO</strong>
              </InfoLabelCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Tipo de Serviço</InfoLabelCell>
              <TableValue>
                {SERVICE_TYPE_LABELS[normalizeServiceType(service.serviceType)]}
              </TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Valor</InfoLabelCell>
              <TableValue>
                {Number(service.valueService || 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </TableValue>
            </InfoItem>

            {/* DADOS DO EQUIPAMENTO */}
            <InfoItem>
              <InfoLabelCell component="th" scope="row">
                <strong>EQUIPAMENTO</strong>
              </InfoLabelCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Modelo</InfoLabelCell>
              <TableValue>{service.equipmentModel || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Marca</InfoLabelCell>
              <TableValue>{service.equipmentBrand || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <InfoLabelCell component="th" scope="row">Peças Utilizadas</InfoLabelCell>
              <TableValue>
                {safeParts && safeParts.length > 0 ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {safeParts.map((part: string, index: number) => (
                      <Chip
                        key={index}
                        label={part}
                        size="small"
                        sx={{ mt: 1 }}
                      />
                    ))}
                  </Box>
                ) : (
                  "-"
                )}
              </TableValue>
            </InfoItem>
          </Table>
        </BoxInfo>

        <BoxMaintenances>
          <MaintenancesTitle>Manutenções</MaintenancesTitle>
          {service.manutencoes && service.manutencoes.length === 0 ? (
            <EmptyMaintenances>
              <Typography color="text.secondary" sx={{ fontSize: 15 }}>
                Nenhuma manutenção registrada
              </Typography>
              <Typography color="text.secondary" sx={{ fontSize: 13, mt: 0.5 }}>
                Clique em &quot;Adicionar Manutenção&quot; no topo da página para registrar uma.
              </Typography>
            </EmptyMaintenances>
          ) : (
            <Grid container spacing={2}>
              {(service.manutencoes || []).map((maintenance: any) => (
                <Grid size={6}>
                  <CardService
                  key={maintenance.id}
                  id={service.id}
                  maintenanceId={maintenance.id}
                  title={maintenance.title}
                  date={maintenance.createdAt}
                  description={maintenance.description}
                  valueService={maintenance.valueService}
                  usedParts={maintenance.usedParts}
                  showDeleteMaintenance={showDeleteMaintenance}
                  setShowDeleteMaintenance={setShowDeleteMaintenance}
                  submitAction={() => deleteMaintenance(maintenance.id)}
                />
                </Grid>
              ))}
            </Grid>
          )}
        </BoxMaintenances>

        <ModalAddNotification
            showModal={showNotificationModal}
            setShowModal={setShowNotificationModal}
            serviceId={service.id}
            fetchService={fetchService}
            clientName={service.clientName}
            serviceType={
              SERVICE_TYPE_LABELS[normalizeServiceType(service.serviceType)]
            }
          />

          <ModalDeleteService
            submitAction={handleDelete}
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            serviceId={id}
          />
        </>
      )}
    </Container>
  );
}

export default ServiceDetails;
