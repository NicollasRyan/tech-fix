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
  handleLogout: () => void;
};

export const ModalLogout = ({
  showModal,
  setShowModal,
  handleLogout
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
              Você tem certeza que deseja sair da sua conta?
            </TextModal>
              <BoxButtons>
                <ButtonCancel onClick={() => setShowModal(false)}>
                  Cancelar
                </ButtonCancel>
                <ButtonSubmit type="button" onClick={handleLogout}>
                  Sim, tenho certeza!
                </ButtonSubmit>
              </BoxButtons>
          </Container>
        </LocalizationProvider>
      }
    />
  );
};
