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
import { ptBR } from "@mui/x-date-pickers/locales";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../../firebase.ts";
import { serviceSchema } from "./serviceSchema.ts";
// import { sendNotificationEmail } from "../../services/notificationEmail.ts";
import {
  normalizeServiceType,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
} from "../../constants/serviceTypes.ts";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  Container,
  TextModal,
} from "./styles.ts";
import { createCalendarEvent } from "../../services/calendarService.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";

type FormValues = {
  clientName: string;
  serviceType: string;
  description?: string;
  valueService: string;
  notify: boolean;
  notificationDate: Dayjs | null;
};

export type ModalAddServiceInitialData = {
  clientName: string;
  serviceType: string;
  description?: string;
  valueService: number | string;
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
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export const ModalAddService = ({
  showModal,
  setShowModal,
  serviceId,
  initialData,
  onSuccess,
  onError,
}: ModalAddServiceProps) => {
  const servicesRef = collection(db, "services");
  const isEdit = Boolean(serviceId && initialData);
  const { accessToken } = useAuth();

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(serviceSchema),
  });
  const notify = watch("notify");

  useEffect(() => {
    if (!showModal) return;
    if (isEdit && initialData) {
      const hasNotification = !!initialData.notificationDate;
      reset({
        clientName: initialData.clientName,
        serviceType: normalizeServiceType(initialData.serviceType),
        description: initialData.description,
        valueService: String(initialData.valueService ?? "").replace(",", "."),
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

  const toUserErrorMessage = (error: unknown) => {
    if (error instanceof FirebaseError) {
      const byCode: Record<string, string> = {
        "permission-denied":
          "Sem permissao para salvar. Verifique as regras do Firestore.",
        unauthenticated: "Sessao expirada. Faca login novamente.",
        unavailable: "Firebase indisponivel no momento. Tente novamente.",
      };
      return byCode[error.code] || `${error.code}: ${error.message}`;
    }
    if (error instanceof Error) return error.message;
    return "Nao foi possivel salvar o servico no Firebase.";
  };

  const onSubmit = async (data: FormValues) => {
    const user = auth.currentUser;
    if (!user) {
      onError?.("Usuario nao autenticado. Faca login novamente.");
      return;
    }

    const normalizedServiceType = normalizeServiceType(data.serviceType);
    const parsedValue = Number.parseFloat(
      String(data.valueService).replace(",", "."),
    );
    const notificationTimestamp =
      data.notify && data.notificationDate
        ? Timestamp.fromDate(data.notificationDate.toDate())
        : null;
    try {
      if (isEdit && serviceId) {
        await updateDoc(doc(db, "services", serviceId), {
          clientName: data.clientName,
          serviceType: normalizedServiceType,
          description: data?.description,
          valueService: parsedValue,
          notificationDate: notificationTimestamp,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(servicesRef, {
          clientName: data.clientName,
          serviceType: normalizedServiceType,
          description: data?.description,
          valueService: parsedValue,
          notificationDate: notificationTimestamp,
          userId: user.uid,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          manutencoes: [],
        });
      }

      if (notificationTimestamp && accessToken) {
        await createCalendarEvent(accessToken, {
          clientName: data.clientName,
          serviceType: data.serviceType,
          notificationDate: notificationTimestamp.toDate(),
        });
      }

      reset(defaultValues);
      setShowModal(false);
      onSuccess?.(
        isEdit
          ? "Servico atualizado com sucesso."
          : "Servico salvo com sucesso.",
      );
    } catch (error) {
      console.error("Erro ao salvar servico:", error);
      onError?.(toUserErrorMessage(error));
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
          localeText={
            ptBR.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <Container>
            <TextModal>
              {isEdit ? "Editar Servico" : "Adicionar Novo Servico"}
            </TextModal>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} marginBottom={2}>
                <Grid size={6}>
                  <TextField
                    label="Nome do cliente"
                    {...register("clientName")}
                    error={!!errors.clientName}
                    helperText={errors.clientName?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={6}>
                  <Controller
                    name="serviceType"
                    control={control}
                    render={({ field }) => (
                      <>
                        <Select
                          {...field}
                          error={!!errors.serviceType}
                          fullWidth
                          displayEmpty
                        >
                          <MenuItem value="">Selecione</MenuItem>
                          {SERVICE_TYPES.map((serviceType) => (
                            <MenuItem key={serviceType} value={serviceType}>
                              {SERVICE_TYPE_LABELS[serviceType]}
                            </MenuItem>
                          ))}
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
                    label="Descricao do Servico"
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={6}>
                  <TextField
                    label="Valor do Servico"
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    {...register("valueService")}
                    error={!!errors.valueService}
                    helperText={errors.valueService?.message}
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
                          <Typography>Data de Notificacao:</Typography>
                          <DatePicker
                            value={field.value || dayjs()}
                            onChange={(date) => field.onChange(date)}
                            minDate={dayjs()}
                            slotProps={{ textField: { fullWidth: true } }}
                          />
                          {errors.notificationDate && (
                            <FormHelperText error>
                              {errors.notificationDate.message}
                            </FormHelperText>
                          )}
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
                <ButtonSubmit type="submit">
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
