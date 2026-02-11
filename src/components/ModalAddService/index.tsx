import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase.ts";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  Container,
  TextModal,
} from "./styles.ts";

type FormValues = {
  clientName: string;
  serviceType: string;
  description: string;
  valueService: string;
  notify: boolean;
  notificationDate: Dayjs | null;
};

export type ModalAddServiceInitialData = {
  clientName: string;
  serviceType: string;
  description: string;
  valueService: string;
  notificationDate: { toDate: () => Date } | null;
};

const defaultValues: FormValues = {
  clientName: "",
  serviceType: "",
  description: "",
  valueService: "",
  notify: false,
  notificationDate: null,
};

type ModalAddServiceProps = {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  serviceId?: string;
  initialData?: ModalAddServiceInitialData;
};

export const ModalAddService = ({
  showModal,
  setShowModal,
  serviceId,
  initialData,
}: ModalAddServiceProps) => {
  const servicesRef = collection(db, "services");
  const isEdit = Boolean(serviceId && initialData);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues,
  });
  const notify = watch("notify");

  useEffect(() => {
    if (!showModal) return;
    if (isEdit && initialData) {
      const hasNotification = !!initialData.notificationDate;
      reset({
        clientName: initialData.clientName,
        serviceType: initialData.serviceType,
        description: initialData.description,
        valueService: initialData.valueService,
        notify: hasNotification,
        notificationDate:
          hasNotification && initialData.notificationDate
            ? dayjs(initialData.notificationDate.toDate())
            : null,
      });
    } else {
      reset(defaultValues);
    }
  }, [showModal, isEdit, initialData, reset]);

  const onSubmit = async (data: FormValues) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      if (isEdit && serviceId) {
        await updateDoc(doc(db, "services", serviceId), {
          clientName: data.clientName,
          serviceType: data.serviceType,
          description: data.description,
          valueService: data.valueService,
          notificationDate:
            data.notify && data.notificationDate
              ? Timestamp.fromDate(data.notificationDate.toDate())
              : null,
        });
      } else {
        await addDoc(servicesRef, {
          clientName: data.clientName,
          serviceType: data.serviceType,
          description: data.description,
          valueService: data.valueService,
          notificationDate:
            data.notify && data.notificationDate
              ? Timestamp.fromDate(data.notificationDate.toDate())
              : null,
          userId: user.uid,
          createdAt: Timestamp.now(),
        });
      }
      reset(defaultValues);
      setShowModal(false);
    } catch (error) {
      console.error(error);
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
              {isEdit ? "Editar Serviço" : "Adcionar Novo Serviço"}
            </TextModal>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} marginBottom={2}>
                <Grid size={6}>
                  <TextField
                    label="Nome do cliente"
                    {...register("clientName", {
                      required: "Nome do cliente é obrigatório",
                    })}
                    error={!!errors.clientName}
                    helperText={errors.clientName?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="serviceType"
                    control={control}
                    rules={{ required: "Tipo de serviço é obrigatório" }}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          error={!!errors.serviceType}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value="">Selecione</MenuItem>
                          <MenuItem value="arcondicionado">
                            Arcondicionado
                          </MenuItem>
                          <MenuItem value="sistemas_solares">
                            Sistemas Solares
                          </MenuItem>
                          <MenuItem value="motor_portao">
                            Motor de Portão
                          </MenuItem>
                          <MenuItem value="cameras">Câmeras</MenuItem>
                        </Select>
                        {errors.serviceType && (
                          <FormHelperText error>
                            {errors.serviceType.message}
                          </FormHelperText>
                        )}
                      </>
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <TextField
                    label="Descrição do Serviço"
                    {...register("description", {
                      required: "Descrição é obrigatória",
                    })}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={12}>
                  <Controller
                    name="notify"
                    control={control}
                    render={({ field }) => (
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!field.value}
                            onChange={(_, checked) => field.onChange(checked)}
                          />
                        }
                        label="Notificar"
                      />
                    )}
                  />
                  {notify && (
                    <Controller
                      name="notificationDate"
                      control={control}
                      render={({ field }) => (
                        <>
                          <Typography>Data de Notificação:</Typography>
                          <DatePicker
                            value={field.value ?? dayjs()}
                            onChange={field.onChange}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                        </>
                      )}
                    />
                  )}
                </Grid>
              </Grid>

              <BoxButtons>
                <ButtonCancel onClick={() => setShowModal(false)}>
                  Cancelar
                </ButtonCancel>
                <ButtonSubmit type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? "Salvando..."
                    : isEdit
                      ? "Salvar"
                      : "Adicionar"}
                </ButtonSubmit>
              </BoxButtons>
            </form>
          </Container>
        </LocalizationProvider>
      }
    />
  );
};
