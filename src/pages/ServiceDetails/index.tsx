import { Container, IconButton, Table, TableCell } from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../../firebase.ts";
import { ServiceDoc } from "../Home";
import { ModalAddService } from "../../components/ModalAddService/index.tsx";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
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
import { ModalDeleteService } from "../../components/ModalDeleteService/index.tsx";
import { ModalAddMaintenance } from "../../components/ModalAddMaintenance/index.tsx";
import { ModalAddNotification } from "../../components/ModalAddNotification/index.tsx";

function ServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState<ServiceDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddMaintenanceModal, setShowAddMaintenanceModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [maintenanceToEdit, setMaintenanceToEdit] = useState(null);

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

    const updated = service.manutencoes.filter(
      (m: any) => m.id !== maintenanceId,
    );

    await updateDoc(doc(db, "services", service.id), {
      manutencoes: updated,
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
          <ButtonAddModification
            onClick={() => setShowAddMaintenanceModal(true)}
          >
            Adiconar modificação
          </ButtonAddModification>
          <ButtonEdit onClick={() => setShowEditModal(true)}>Editar</ButtonEdit>
          <ButtonDelete onClick={() => setShowDeleteModal(true)}>
            Deletar
          </ButtonDelete>
        </BoxActions>
      </BoxButtons>
      {!loading && service && (
        <BoxInfo>
          <Table>
            <InfoItem>
              <TableCell scope="row">Cliente</TableCell>
              <TableValue>{service.clientName || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Descrição</TableCell>
              <TableValue>{service.description || "-"}</TableValue>
            </InfoItem>

            {Array.isArray(service.manutencoes) &&
            service.manutencoes.length > 0 ? (
              service.manutencoes
                .filter((m) => m && typeof m === "object" && "description" in m)
                .map((m, index) => (
                  <InfoItem>
                    <TableCell scope="row">Manutenção</TableCell>
                    <TableValue>
                      <div key={index}>
                        <strong>{m.description}</strong>
                        <br />
                        <small>
                          {m.createdAt?.toDate?.()?.toLocaleDateString() ?? "-"}
                        </small>
                      </div>
                      <IconButton onClick={() => openEditMaintenance(m)}>
                        <EditIcon />
                      </IconButton>

                      <IconButton onClick={() => deleteMaintenance(m.id)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableValue>
                  </InfoItem>
                ))
            ) : (
              <></>
            )}

            <InfoItem>
              <TableCell scope="row">Valor</TableCell>
              <TableValue>R$ {service.valueService ?? 0}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Data</TableCell>
              <TableValue>
                {service.createdAt?.toDate?.()?.toLocaleDateString() ?? "-"}
              </TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Tipo de Serviço</TableCell>
              <TableValue>{service.serviceType || "-"}</TableValue>
            </InfoItem>

            <InfoItem>
              <TableCell scope="row">Notificações</TableCell>
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
              notificationDate: service.notificationDate ?? null,
            }}
          />

          <ModalAddNotification
            showModal={showNotificationModal}
            setShowModal={setShowNotificationModal}
            serviceId={service.id}
            fetchService={fetchService}
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
