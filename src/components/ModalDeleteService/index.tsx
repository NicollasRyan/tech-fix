import {
  Modal,
} from "@mui/material";
import { deleteDoc, doc } from "firebase/firestore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase.ts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  Container,
  TextModal,
} from "./styles.ts";

type ModalAddServiceProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  serviceId?: string;
};

export const ModalDeleteService = ({
  showModal,
  setShowModal,
  serviceId,
}: ModalAddServiceProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDelete = async () => {
    if (!serviceId) return;
    try {
      setIsSubmitting(true);
      await deleteDoc(doc(db, "services", serviceId));
      setShowModal(false);
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir serviço:", error);
      alert("Erro ao excluir serviço");
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      children={
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container>
            <TextModal>
              Você tem certeza que deseja excluir este serviço?
            </TextModal>
              <BoxButtons>
                <ButtonCancel onClick={() => setShowModal(false)}>
                  Cancelar
                </ButtonCancel>
                <ButtonSubmit type="button" onClick={handleDelete} disabled={isSubmitting}>
                  Sim, tenho certeza!
                </ButtonSubmit>
              </BoxButtons>
          </Container>
        </LocalizationProvider>
      }
    />
  );
};
