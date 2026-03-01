import {
  Modal,
} from "@mui/material";
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
  submitAction: () => void;
};

export const ModalDeleteService = ({
  showModal,
  setShowModal,
  submitAction,
}: ModalAddServiceProps) => {
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
                <ButtonSubmit type="button" onClick={() => submitAction()} >
                  Sim, tenho certeza!
                </ButtonSubmit>
              </BoxButtons>
          </Container>
        </LocalizationProvider>
      }
    />
  );
};
