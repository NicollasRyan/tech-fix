import { Modal } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs from "dayjs";
import { useState } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase.ts";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  Container,
  TextModal,
} from "./styles.ts";

type Props = {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  serviceId: string;
  fetchService: () => void;
};

export const ModalAddNotification = ({
  showModal,
  setShowModal,
  serviceId,
  fetchService,
}: Props) => {
  const [date, setDate] = useState<any>(null);

  const handleSave = async () => {
    if (!date) return;

    await updateDoc(doc(db, "services", serviceId), {
      notificationDate: Timestamp.fromDate(date.toDate()),
    });

    setShowModal(false);
    fetchService();
  };

  return (
    <Modal open={showModal} onClose={() => setShowModal(false)}>
      <LocalizationProvider 
        dateAdapter={AdapterDayjs}
        adapterLocale="pt-br"
        localeText={ptBR.components.MuiLocalizationProvider.defaultProps.localeText}
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
