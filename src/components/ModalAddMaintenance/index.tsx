import { Modal, TextField } from "@mui/material";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../firebase.ts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  Container,
  TextModal,
} from "./styles.ts";
import { maintenanceSchema } from "./maintenanceSchema.ts";
import { useForm } from "react-hook-form";

type Maintenance = {
  id: string;
  description: string;
  createdAt: Timestamp;
};

type ModalAddMaintenanceProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  serviceId?: string;
  fetchService?: () => void;
  maintenanceToEdit?: Maintenance | null;
  maintenances?: Maintenance[];
};

export const ModalAddMaintenance = ({
  showModal,
  setShowModal,
  serviceId,
  fetchService,
  maintenanceToEdit,
  maintenances = [],
}: ModalAddMaintenanceProps) => {
  const { handleSubmit, register, reset, formState: { errors } } = useForm<{
    description: string;
  }>({
    resolver: zodResolver(maintenanceSchema),
  });

  useEffect(() => {
    if (maintenanceToEdit) {
      reset({ description: maintenanceToEdit.description });
    } else {
      reset({ description: "" });
    }
  }, [maintenanceToEdit, reset]);

  const handleAddMaintenance = async (data: any) => {
    if (!serviceId) return;

    try {
      if (maintenanceToEdit) {
        await updateDoc(doc(db, "services", serviceId), {
          manutencoes: maintenances.map((m: any) =>
            m.id === maintenanceToEdit.id
              ? { ...m, description: data.description }
              : m
          ),
        });
      } else {
        await updateDoc(doc(db, "services", serviceId), {
          manutencoes: arrayUnion({
            id: crypto.randomUUID(),
            description: data.description,
            createdAt: Timestamp.now(),
          }),
        });
      }

      setShowModal(false);
      fetchService?.();
    } catch (error) {
      console.error("Erro ao salvar manutenção:", error);
      alert("Erro ao salvar manutenção");
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      children={
        <LocalizationProvider 
          dateAdapter={AdapterDayjs}
          adapterLocale="pt-br"
          localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
        >
          <Container>
            <TextModal>{maintenanceToEdit ? "Editar manutenção" : "Adicionar nova manutenção"}</TextModal>
            <form onSubmit={handleSubmit(handleAddMaintenance)}>
              <TextField
                {...register("description", { required: "Descrição é obrigatória" })}
                label="Descrição da manutenção"
                variant="outlined"
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
              />
              <BoxButtons>
                <ButtonCancel onClick={() => setShowModal(false)}>
                  Cancelar
                </ButtonCancel>
                <ButtonSubmit type="submit">{maintenanceToEdit ? "Salvar alterações" : "Adicionar"}</ButtonSubmit>
              </BoxButtons>
            </form>
          </Container>
        </LocalizationProvider>
      }
    />
  );
};
