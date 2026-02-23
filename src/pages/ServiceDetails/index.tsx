import { Container, IconButton, Table, TableCell } from "@mui/material";
import { Timestamp, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { auth, db } from "../../firebase.ts";
import type { ServiceDoc } from "../../types/service.ts";
import { ModalAddService } from "../../components/ModalAddService/index.tsx";
import { ModalDeleteService } from "../../components/ModalDeleteService/index.tsx";
import { ModalAddMaintenance } from "../../components/ModalAddMaintenance/index.tsx";
import { ModalAddNotification } from "../../components/ModalAddNotification/index.tsx";
import {
  normalizeServiceType,
  SERVICE_TYPE_LABELS,
} from "../../constants/serviceTypes.ts";
import {
  BoxActions,
  BoxButtons,
  BoxInfo,
  ButtonAddModification,
  ButtonAddNotification,
  ButtonDelete,
  ButtonEdit,
  InfoItem,
  TableValue,
} from "./styles.ts";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [maintenanceToEdit, setMaintenanceToEdit] = useState<any>(null);

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
  }, [id]);

  const handleCloseEditModal = (open: boolean) => {
    setShowEditModal(open);
    if (!open) fetchService();
  };

  const handleCloseMaintenanceModal = (open: boolean) => {
    setShowAddMaintenanceModal(open);
    if (!open) {
      setMaintenanceToEdit(null);
      fetchService();
    }
  };

  const openEditMaintenance = (maintenance: any) => {
    setMaintenanceToEdit(maintenance);
    setShowAddMaintenanceModal(true);
  };

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

  return (
    <Container>
      <BoxButtons>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBackIcon />
        </IconButton>
        <BoxActions>
          <ButtonAddModification onClick={() => setShowAddMaintenanceModal(true)}>
            Adicionar modificacao
          </ButtonAddModification>
          <ButtonEdit onClick={() => navigate("/edit-service/" + id)}>Editar</ButtonEdit>
          <ButtonDelete onClick={() => setShowDeleteModal(true)}>Deletar</ButtonDelete>
        </BoxActions>
      </BoxButtons>
      {!loading && service && (
        <BoxInfo>
          <Table>
            {/* DADOS DO CLIENTE */}
            <InfoItem>
              <TableCell scope="row"><strong>CLIENTE</strong></TableCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Nome</TableCell>
              <TableValue>{service.clientName || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Telefone</TableCell>
              <TableValue>{service.phone || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Email</TableCell>
              <TableValue>{service.email || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">CPF</TableCell>
              <TableValue>{service.cpf || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Endereço</TableCell>
              <TableValue>{service.address || "-"}</TableValue>
            </InfoItem>

            {/* DADOS DO SERVIÇO */}
            <InfoItem>
              <TableCell scope="row"><strong>SERVIÇO</strong></TableCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Tipo de Serviço</TableCell>
              <TableValue>
                {SERVICE_TYPE_LABELS[normalizeServiceType(service.serviceType)]}
              </TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Descricao</TableCell>
              <TableValue>{service.description || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Valor</TableCell>
              <TableValue>R$ {Number(service.valueService || 0).toFixed(2)}</TableValue>
            </InfoItem>

            {/* DADOS DO EQUIPAMENTO */}
            <InfoItem>
              <TableCell scope="row"><strong>EQUIPAMENTO</strong></TableCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Modelo</TableCell>
              <TableValue>{service.equipmentModel || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Marca</TableCell>
              <TableValue>{service.equipmentBrand || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Peças Utilizadas</TableCell>
              <TableValue>{service.usedParts || "-"}</TableValue>
            </InfoItem>

            {/* MANUTENÇÕES */}
            {Array.isArray(service.manutencoes) && service.manutencoes.length > 0 && (
              <>
                <InfoItem>
                  <TableCell scope="row"><strong>MANUTENÇÕES</strong></TableCell>
                  <TableValue />
                </InfoItem>

                {service.manutencoes
                  .filter((maintenance) => maintenance && maintenance.description)
                  .map((maintenance: any) => (
                    <InfoItem key={maintenance.id}>
                      <TableCell scope="row">Manutencao</TableCell>
                      <TableValue>
                        <div>
                          <strong>{maintenance.description}</strong>
                          <br />
                          <small>
                            {maintenance.createdAt?.toDate?.()?.toLocaleDateString() ?? "-"}
                          </small>
                        </div>
                        <IconButton onClick={() => openEditMaintenance(maintenance)}>
                          <EditIcon />
                        </IconButton>

                        <IconButton onClick={() => deleteMaintenance(maintenance.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableValue>
                    </InfoItem>
                  ))}
              </>
            )}

            {/* DATAS */}
            <InfoItem>
              <TableCell scope="row"><strong>DATAS</strong></TableCell>
              <TableValue />
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Data de Criação</TableCell>
              <TableValue>
                {service.createdAt?.toDate?.()?.toLocaleDateString() ?? "-"}
              </TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Notificacao</TableCell>
              <TableValue>
                {service.notificationDate?.toDate?.()?.toLocaleDateString() ?? (
                  <ButtonAddNotification onClick={() => setShowNotificationModal(true)}>
                    Adicionar Notificacao <AddIcon />
                  </ButtonAddNotification>
                )}
              </TableValue>
            </InfoItem>
          </Table>

          <ModalAddService
            showModal={showEditModal}
            setShowModal={handleCloseEditModal}
            serviceId={service.id}
            initialData={{
              clientName: service.clientName,
              serviceType: service.serviceType,
              description: service.description,
              valueService: service.valueService,
              notificationDate:
                (service.notificationDate as { toDate: () => Date } | null) ?? null,
            }}
          />

          <ModalAddNotification
            showModal={showNotificationModal}
            setShowModal={setShowNotificationModal}
            serviceId={service.id}
            fetchService={fetchService}
            clientName={service.clientName}
            serviceType={SERVICE_TYPE_LABELS[normalizeServiceType(service.serviceType)]}
          />

          <ModalDeleteService
            showModal={showDeleteModal}
            setShowModal={setShowDeleteModal}
            serviceId={id}
          />

          <ModalAddMaintenance
            showModal={showAddMaintenanceModal}
            setShowModal={handleCloseMaintenanceModal}
            serviceId={id}
            fetchService={fetchService}
            maintenanceToEdit={maintenanceToEdit}
            maintenances={service.manutencoes || []}
          />
        </BoxInfo>
      )}
    </Container>
  );
}

export default ServiceDetails;
