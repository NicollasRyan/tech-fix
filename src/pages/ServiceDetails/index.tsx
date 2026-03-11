import {
  Container,
  Grid,
  IconButton,
  Table,
  Typography,
  Alert,
  AlertTitle,
  Snackbar,
  useTheme,
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import {
  Timestamp,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  ActionButtonGroup,
  ActionIconButton,
  BoxActions,
  BoxButtons,
  BoxInfo,
  BoxMaintenances,
  ButtonAddModification,
  ButtonAddNotification,
  ButtonDelete,
  ButtonEdit,
  CardDateBadge,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPartsSection,
  CardServiceContent,
  CardTitle,
  CardValue,
  DeleteIconButton,
  DividerLine,
  EditIconButton,
  EmptyMaintenances,
  InfoItem,
  InfoLabelCell,
  MaintenancesTitle,
  PartsWrapper,
  StyledChip,
  TableValue,
} from "./styles.ts";
import React from "react";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { CardEquipment } from "../../components/CardEquipment/index.tsx";
import { CalendarToday, NotificationAdd } from "@mui/icons-material";

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
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <CardDateBadge>
           <CalendarToday fontSize="small" />
          {date.toDate().toLocaleDateString("pt-BR")}
        </CardDateBadge>
      </CardHeader>

      <CardValue>
        {Number(valueService || 0).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </CardValue>

      <DividerLine />

      <CardDescription>{description || "---"}</CardDescription>

      <CardPartsSection>
        <strong>Peças:</strong>

        {safeParts && safeParts.length > 0 ? (
          <PartsWrapper>
            {safeParts.map((part: string, index: number) => (
              <StyledChip key={index} label={part} size="small" />
            ))}
          </PartsWrapper>
        ) : (
          " -"
        )}
      </CardPartsSection>

      <CardFooter>
        <ActionButtonGroup>
          <EditIconButton
            size="small"
            onClick={() => navigate(`/edit-maintenance/${id}/${maintenanceId}`)}
          >
            <EditIcon fontSize="small" />
          </EditIconButton>

          <DeleteIconButton
            size="small"
            onClick={() => setShowDeleteMaintenance(true)}
          >
            <DeleteIcon fontSize="small" />
          </DeleteIconButton>
        </ActionButtonGroup>
      </CardFooter>

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
  const location = useLocation();
  const { googleConnected } = useAuth();

  const [service, setService] = useState<ServiceDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeleteMaintenance, setShowDeleteMaintenance] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const safeParts = Array.isArray(service?.usedParts) ? service.usedParts : [];

  const fetchService = useCallback(() => {
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
  }, [id, navigate]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

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

  const deleteMaintenance = async (maintenanceId: string) => {
    if (!service) return;
    try {
      const updated = (service.manutencoes || []).filter(
        (maintenance: any) => maintenance.id !== maintenanceId,
      );

      await updateDoc(doc(db, "services", service.id), {
        manutencoes: updated,
        updatedAt: Timestamp.now(),
      });

      fetchService();
      setFeedback({
        open: true,
        severity: "success",
        message: "Manutenção removida com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao excluir manutenção:", error);
      setFeedback({
        open: true,
        severity: "error",
        message: "Erro ao excluir manutenção.",
      });
    }
  };

  const handleDelete = async () => {
    if (!service?.id) return;
    try {
      await deleteDoc(doc(db, "services", service.id));
      setShowDeleteModal(false);
      navigate("/", {
        state: {
          feedback: {
            severity: "success",
            message: "Serviço excluído com sucesso.",
          },
        },
      });
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      setFeedback({
        open: true,
        severity: "error",
        message: "Erro ao excluir serviço.",
      });
    }
  };

  const notificationDate = service?.notificationDate?.toDate?.();
  const today = new Date();

  const isExpired =
    notificationDate &&
    notificationDate.setHours(0, 0, 0, 0) < today.setHours(0, 0, 0, 0);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Container>
      <BoxButtons>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <BoxActions>
          {isMobile ? (
            <>
              <Tooltip title="Adicionar Manutenção">
                <ActionIconButton
                  variantcolor="success"
                  onClick={() => navigate(`/addMaintenance/${id}`)}
                >
                  <AddIcon fontSize="small" />{" "}
                  <Typography>Manutenção</Typography>
                </ActionIconButton>
              </Tooltip>

              <Tooltip title="Editar">
                <ActionIconButton
                  variantcolor="primary"
                  onClick={() => navigate("/edit-service/" + id)}
                >
                  <EditIcon fontSize="small" />
                </ActionIconButton>
              </Tooltip>

              <Tooltip title="Deletar">
                <ActionIconButton
                  variantcolor="error"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <DeleteIcon fontSize="small" />
                </ActionIconButton>
              </Tooltip>
            </>
          ) : (
            <>
              <ButtonAddModification
                onClick={() => navigate(`/addMaintenance/${id}`)}
              >
                Adicionar Manutenção
              </ButtonAddModification>

              <ButtonEdit onClick={() => navigate("/edit-service/" + id)}>
                Editar
              </ButtonEdit>

              <ButtonDelete onClick={() => setShowDeleteModal(true)}>
                Deletar
              </ButtonDelete>
            </>
          )}
        </BoxActions>
      </BoxButtons>
      {!loading && service && (
        <>
          <BoxInfo>
            <Table>
              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Data de Criação
                </InfoLabelCell>
                <TableValue>
                  {service.createdAt?.toDate?.()?.toLocaleDateString() ?? "-"}
                </TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Notificação
                </InfoLabelCell>
                <TableValue>
                  {notificationDate && !isExpired ? (
                    notificationDate.toLocaleDateString()
                  ) : googleConnected ? (
                    <>
                      {isMobile ? (
                        <Tooltip title="Adicionar Notificação">
                          <ActionIconButton
                            onClick={() => setShowNotificationModal(true)}
                            size="small"
                            variantcolor="primary"
                          >
                            <NotificationAdd />
                          </ActionIconButton>
                        </Tooltip>
                      ) : (
                        <ButtonAddNotification
                          onClick={() => setShowNotificationModal(true)}
                        >
                          Adicionar Notificação <AddIcon />
                        </ButtonAddNotification>
                      )}
                    </>
                  ) : (
                    <Alert severity="warning">
                      <AlertTitle>Google Calendar não conectado</AlertTitle>
                      Para usar notificações automáticas, conecte sua conta do
                      Google nas configurações do perfil.
                    </Alert>
                  )}
                </TableValue>
              </InfoItem>
              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  <strong>CLIENTE</strong>
                </InfoLabelCell>
                <TableValue />
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Nome
                </InfoLabelCell>
                <TableValue>{service.clientName || "-"}</TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Telefone
                </InfoLabelCell>
                <TableValue>{service.phone || "-"}</TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Email
                </InfoLabelCell>
                <TableValue>{service.email || "-"}</TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  CPF
                </InfoLabelCell>
                <TableValue>{service.cpf || "-"}</TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Cidade
                </InfoLabelCell>
                <TableValue>{service.city || "-"}</TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Endereço
                </InfoLabelCell>
                <TableValue>{service.address || "-"}</TableValue>
              </InfoItem>
              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  <strong>SERVIÇO</strong>
                </InfoLabelCell>
                <TableValue />
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Tipo de Serviço
                </InfoLabelCell>
                <TableValue>
                  {
                    SERVICE_TYPE_LABELS[
                      normalizeServiceType(service.serviceType)
                    ]
                  }
                </TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Valor
                </InfoLabelCell>
                <TableValue>
                  {Number(service.valueService || 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </TableValue>
              </InfoItem>

              <InfoItem>
                <InfoLabelCell component="th" scope="row">
                  Descrição
                </InfoLabelCell>
                <TableValue>{service.description || "-"}</TableValue>
              </InfoItem>
            </Table>
          </BoxInfo>

          <BoxMaintenances>
            <MaintenancesTitle>Dados do Equipamento</MaintenancesTitle>

            <CardEquipment
              brand={service.equipmentBrand}
              model={service.equipmentModel}
              parts={safeParts}
            />
          </BoxMaintenances>

          <BoxMaintenances>
            <MaintenancesTitle>Manutenções</MaintenancesTitle>
            {service.manutencoes && service.manutencoes.length === 0 ? (
              <EmptyMaintenances>
                <Typography color="text.secondary" sx={{ fontSize: 15 }}>
                  Nenhuma manutenção registrada
                </Typography>
                <Typography
                  color="text.secondary"
                  sx={{ fontSize: 13, mt: 0.5 }}
                >
                  Clique em &quot;Adicionar Manutenção&quot; no topo da página
                  para registrar uma.
                </Typography>
              </EmptyMaintenances>
            ) : (
              <Grid container spacing={2}>
                {(service.manutencoes || []).map((maintenance: any) => (
                  <Grid size={{ xs: 12, md: 6 }}>
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
            onSuccess={(message) =>
              setFeedback({
                open: true,
                severity: "success",
                message,
              })
            }
            onError={(message) =>
              setFeedback({
                open: true,
                severity: "error",
                message,
              })
            }
          />

          <ModalDeleteService
            submitAction={handleDelete}
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            serviceId={id}
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
        </>
      )}
    </Container>
  );
}

export default ServiceDetails;
