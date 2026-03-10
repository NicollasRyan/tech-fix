import { Modal, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import { useState } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase.ts";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  Container,
  Label,
  TextModal,
} from "./styles.ts";
import { createEventWithAutoReconnect } from "../../services/createEventWithAutoReconnect.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import React from "react";

type Props = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  serviceId: string;
  fetchService: () => void;
  clientName?: string;
  serviceType?: string;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export const ModalAddNotification = ({
  showModal,
  setShowModal,
  serviceId,
  fetchService,
  clientName = "Cliente",
  serviceType = "Servico",
  onSuccess,
  onError,
}: Props) => {
  const [date, setDate] = useState<Dayjs | null>(null);
  const [description, setDescription] = useState<string>("");
  const { accessToken, googleConnected } = useAuth();

  const handleSave = async () => {
    if (!date) {
      onError?.("Selecione uma data para notificação.");
      return;
    }

    try {
      await updateDoc(doc(db, "services", serviceId), {
        notificationDate: Timestamp.fromDate(date.toDate()),
        descriptionMaintenance: description,
        updatedAt: Timestamp.now(),
      });

      if (accessToken && googleConnected) {
        await createEventWithAutoReconnect(accessToken, {
          clientName,
          serviceType,
          notificationDate: date.toDate(),
          description,
        });
      }

      setShowModal(false);
      fetchService();
      onSuccess?.("Notificação salva com sucesso.");
    } catch (error) {
      console.error("Erro ao salvar notificação:", error);
      onError?.("Erro ao salvar notificação.");
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      slotProps={{
        backdrop: {
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(4px)",
          },
        },
      }}
    >
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="pt-br"
        localeText={
          ptBR.components.MuiLocalizationProvider.defaultProps.localeText
        }
      >
        <Container>
          <TextModal>Adicionar notificação</TextModal>

          <DatePicker
            label="Data da notificação"
            value={date}
            onChange={(newValue) => setDate(newValue)}
            minDate={dayjs()}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <Label>Proxima Manutenção</Label>
          <TextField
            value={description}
            fullWidth
            onChange={(e) => setDescription(e.target.value)}
          />

          <BoxButtons>
            <ButtonCancel onClick={() => setShowModal(false)}>
              Cancelar
            </ButtonCancel>
            <ButtonSubmit onClick={handleSave}>Salvar</ButtonSubmit>
          </BoxButtons>
        </Container>
      </LocalizationProvider>
    </Modal>
  );
};
