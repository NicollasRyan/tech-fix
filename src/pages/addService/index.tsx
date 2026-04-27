import { useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";
import { auth, db } from "../../firebase.ts";
import type { ServiceDoc } from "../../types/service.ts";
import { serviceSchema } from "./serviceSchema.ts";
import {
  normalizeServiceType,
  SERVICE_TYPES,
  SERVICE_TYPE_LABELS,
} from "../../constants/serviceTypes.ts";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  Text,
  Label,
  BoxLine,
  Title,
  BoxHeader,
  FormCard,
  BoxDate,
} from "./styles.ts";
import { PatternFormat, NumericFormat } from "react-number-format";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";
import { ptBR } from "@mui/x-date-pickers/locales";

import {
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  TextField,
  Container,
  IconButton,
  InputAdornment,
  Chip,
  Box,
  Alert,
  AlertTitle,
  Snackbar,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import "dayjs/locale/pt-br";
import { Add, ArrowBack } from "@mui/icons-material";
import dayjs from "dayjs";
import z from "zod";
import { createCalendarEvent } from "../../services/calendarService.ts";
import React from "react";
import { getServicePrimaryDate } from "../../utils/firestoreDate.ts";
dayjs.locale("pt-br");

type FormValues = z.infer<typeof serviceSchema>;

export type ModalAddServiceInitialData = {
  clientName: string;
  serviceType: string;
  description?: string;
  valueService: number | null;
  notificationDate: { toDate: () => Date } | null;
  descriptionMaintenance: string;
  serviceDate: { toDate: () => Date } | null;
  phone?: string;
  email?: string;
  cpf?: string;
  address?: string;
  city?: string;
  equipmentModel?: string;
  equipmentBrand?: string;
  usedParts?: string[];
};

const defaultValues: FormValues = {
  clientName: "",
  serviceType: "",
  description: "",
  valueService: null,
  notify: false,
  notificationDate: null,
  descriptionMaintenance: "",
  serviceDate: null,
  phone: "",
  email: "",
  cpf: "",
  address: "",
  city: "",
  equipmentModel: "",
  equipmentBrand: "",
  usedParts: [],
};

type ModalAddServiceProps = {
  propsInitialData?: ModalAddServiceInitialData;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export const AddService = ({
  propsInitialData,
  onSuccess,
  onError,
}: ModalAddServiceProps) => {
  const { id: paramServiceId } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<
    ModalAddServiceInitialData | undefined
  >(propsInitialData);
  const [loading, setLoading] = useState(false);

  const servicesRef = collection(db, "services");
  const isEdit = Boolean(paramServiceId);
  const { googleConnected } = useAuth();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const notifySuccess = useCallback(
    (message: string) => {
      if (onSuccess) {
        onSuccess(message);
        return;
      }
      setFeedback({
        open: true,
        severity: "success",
        message,
      });
    },
    [onSuccess],
  );

  const notifyError = useCallback(
    (message: string) => {
      if (onError) {
        onError(message);
        return;
      }
      setFeedback({
        open: true,
        severity: "error",
        message,
      });
    },
    [onError],
  );

  useEffect(() => {
    if (!isEdit || initialData || loading) return;

    const fetchServiceData = async () => {
      try {
        setLoading(true);
        if (!paramServiceId) return;

        const docRef = doc(db, "services", paramServiceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as ServiceDoc;
          setInitialData({
            clientName: data.clientName,
            serviceType: data.serviceType,
            description: data.description,
            valueService: data.valueService,
            notificationDate: data.notificationDate,
            descriptionMaintenance: data.descriptionMaintenance,
            serviceDate: getServicePrimaryDate(data),
            phone: data.phone,
            email: data.email,
            cpf: data.cpf,
            address: data.address,
            city: data.city,
            equipmentModel: data.equipmentModel,
            equipmentBrand: data.equipmentBrand,
            usedParts: data.usedParts,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
        notifyError("Erro ao carregar os dados do serviço.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [isEdit, paramServiceId, initialData, loading, notifyError]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(serviceSchema),
  });
  const notify = watch("notify");
  const usedParts = watch("usedParts") ?? [];
  const [pieceInput, setPieceInput] = useState("");

  console.log("Initial Data:", initialData);

  useEffect(() => {
    if (isEdit && initialData) {
      const hasNotification = !!initialData.notificationDate;
      reset({
        clientName: initialData.clientName,
        serviceType: normalizeServiceType(initialData.serviceType),
        description: initialData.description,
        valueService: Number(initialData.valueService ?? 0),
        notify: hasNotification,
        notificationDate:
          hasNotification && initialData.notificationDate
            ? dayjs(initialData.notificationDate.toDate())
            : null,
        serviceDate: initialData.serviceDate
          ? dayjs(initialData.serviceDate.toDate())
          : dayjs(),
        descriptionMaintenance: initialData.descriptionMaintenance,
        phone: initialData.phone?.toString() ?? "",
        email: initialData.email || "",
        cpf: initialData.cpf || "",
        address: initialData.address || "",
        city: initialData.city || "",
        equipmentModel: initialData.equipmentModel || "",
        equipmentBrand: initialData.equipmentBrand || "",
        usedParts: initialData.usedParts || [],
      });
    } else {
      reset({ ...defaultValues, serviceDate: dayjs() });
    }
  }, [isEdit, initialData, reset]);

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

  const handleAddPiece = () => {
    if (!pieceInput.trim()) return;

    const updatedParts = [...usedParts, pieceInput.trim()];
    setValue("usedParts", updatedParts);
    setPieceInput("");
  };

  const handleRemovePiece = (index: number) => {
    const updatedParts = usedParts.filter((_, i) => i !== index);
    setValue("usedParts", updatedParts);
  };

  const onSubmit = async (data: FormValues) => {
    const user = auth.currentUser;
    if (!user) {
      notifyError("Usuario nao autenticado. Faça login novamente.");
      return;
    }

    const normalizedServiceType = normalizeServiceType(data.serviceType);

    const parsedValue = data.valueService;
    const notificationTimestamp =
      data.notify && data.notificationDate
        ? Timestamp.fromDate(data.notificationDate.toDate())
        : null;
    const serviceDateTimestamp = data.serviceDate
      ? Timestamp.fromDate(data.serviceDate.toDate())
      : Timestamp.now();
    if (!parsedValue || parsedValue <= 0) {
      notifyError("Valor do serviço inválido. Informe um número positivo.");
      return;
    }
    try {
      if (isEdit && paramServiceId) {
        const updateData: Record<string, any> = {
          clientName: data.clientName,
          serviceType: normalizedServiceType,
          description: data?.description,
          valueService: parsedValue,
          notificationDate: notificationTimestamp,
          serviceDate: serviceDateTimestamp,
          descriptionMaintenance: data.descriptionMaintenance,
          phone: data?.phone,
          email: data?.email,
          cpf: data?.cpf,
          address: data?.address,
          city: data?.city,
          equipmentModel: data?.equipmentModel,
          equipmentBrand: data?.equipmentBrand,
          usedParts: data?.usedParts || [],
          createdAt: serviceDateTimestamp,
          updatedAt: Timestamp.now(),
        };

        await updateDoc(doc(db, "services", paramServiceId), updateData);
      } else {
        const createData: Record<string, any> = {
          clientName: data.clientName,
          serviceType: normalizedServiceType,
          description: data?.description,
          valueService: parsedValue,
          notificationDate: notificationTimestamp,
          descriptionMaintenance: data.descriptionMaintenance,
          phone: data?.phone,
          email: data?.email,
          cpf: data?.cpf,
          address: data?.address,
          city: data?.city,
          equipmentModel: data?.equipmentModel,
          equipmentBrand: data?.equipmentBrand,
          usedParts: data?.usedParts || [],
          userId: user.uid,
          serviceDate: serviceDateTimestamp,
          createdAt: serviceDateTimestamp,
          updatedAt: Timestamp.now(),
          manutencoes: [],
        };

        await addDoc(servicesRef, createData);
      }

      if (notificationTimestamp && googleConnected) {
        await createCalendarEvent(user.uid, {
          clientName: data.clientName,
          serviceType: data.serviceType,
          notificationDate: notificationTimestamp.toDate(),
          description: data.descriptionMaintenance,
        });
      }

      reset(defaultValues);
      const successMessage = isEdit
        ? "Servico atualizado com sucesso."
        : "Servico salvo com sucesso.";
      notifySuccess(successMessage);
      navigate(isEdit ? "/serviceDetails/" + (paramServiceId || "") : "/", {
        state: {
          feedback: {
            severity: "success",
            message: successMessage,
          },
        },
      });
    } catch (error) {
      console.error("Erro ao salvar servico:", error);
      notifyError(toUserErrorMessage(error));
    }
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pt-br"
      localeText={
        ptBR.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <Container maxWidth="md">
        <BoxHeader>
          <IconButton
            onClick={() =>
              navigate(isEdit ? "/serviceDetails/" + paramServiceId : "/")
            }
            sx={{ mr: 1 }}
          >
            <ArrowBack />
          </IconButton>
          <Title>{isEdit ? "Editar Serviço" : "Adicionar Novo Serviço"}</Title>
        </BoxHeader>
        {isEdit && loading && <p>Carregando dados do serviço...</p>}
        {!loading && (
          <FormCard elevation={0} sx={{ mt: 2 }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={2} marginBottom={2}>
                <Grid size={12}>
                  <BoxLine>
                    <Text>Dados do Cliente</Text>
                  </BoxLine>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Nome do cliente</Label>
                  <TextField
                    {...register("clientName")}
                    error={!!errors.clientName}
                    helperText={errors.clientName?.message}
                    fullWidth
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Telefone (Opcional)</Label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <PatternFormat
                        {...field}
                        customInput={TextField}
                        format="(##) #####-####"
                        mask="_"
                        fullWidth
                        placeholder="(XX) XXXXX-XXXX"
                        error={!!errors.phone}
                        helperText={errors.phone?.message}
                        onValueChange={(values) => {
                          field.onChange(values.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Email (Opcional)</Label>
                  <TextField
                    type="email"
                    {...register("email")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>CPF (Opcional)</Label>
                  <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                      <PatternFormat
                        {...field}
                        customInput={TextField}
                        format="###.###.###-##"
                        mask="_"
                        fullWidth
                        placeholder="XXX.XXX.XXX-XX"
                        error={!!errors.cpf}
                        helperText={errors.cpf?.message}
                        onValueChange={(values) => {
                          field.onChange(values.value);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Cidade (Opcional)</Label>
                  <TextField
                    {...register("city")}
                    error={!!errors.city}
                    helperText={errors.city?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Endereço (Opcional)</Label>
                  <TextField
                    {...register("address")}
                    error={!!errors.address}
                    helperText={errors.address?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={12}>
                  <BoxLine>
                    <Text>Dados do Servico</Text>
                  </BoxLine>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Tipo de Serviço</Label>
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
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Valor do Serviço</Label>
                  <Controller
                    name="valueService"
                    control={control}
                    render={({ field }) => (
                      <NumericFormat
                        value={field.value ?? ""}
                        customInput={TextField}
                        fullWidth
                        thousandSeparator="."
                        decimalSeparator=","
                        prefix="R$ "
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        error={!!errors.valueService}
                        helperText={errors.valueService?.message}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? null);
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 12 }}>
                  <Label>Data do Serviço</Label>
                  <Controller
                    name="serviceDate"
                    control={control}
                    render={({ field }) => (
                      <DatePicker
                        value={field.value}
                        onChange={(date) => field.onChange(date)}
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            fullWidth: true,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
                <Grid size={12}>
                  <Label>Descrição do Serviço (Opcional)</Label>
                  <TextField
                    {...register("description")}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Modelo do Equipamento (Opcional)</Label>
                  <TextField
                    {...register("equipmentModel")}
                    error={!!errors.equipmentModel}
                    helperText={errors.equipmentModel?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Marca (Opcional)</Label>
                  <TextField
                    {...register("equipmentBrand")}
                    error={!!errors.equipmentBrand}
                    helperText={errors.equipmentBrand?.message}
                    fullWidth
                  />
                </Grid>
                <Grid size={12}>
                  <Label>Peças Utilizadas (Opcional)</Label>

                  <TextField
                    value={pieceInput}
                    onChange={(e) => setPieceInput(e.target.value)}
                    fullWidth
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <ButtonSubmit onClick={handleAddPiece}>
                              <Add />
                            </ButtonSubmit>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <Box
                    sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}
                  >
                    {usedParts?.map((piece, index) => (
                      <Chip
                        key={index}
                        label={piece}
                        onDelete={() => handleRemovePiece(index)}
                      />
                    ))}
                  </Box>
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
                    <>
                      {googleConnected ? (
                        <BoxDate>
                          <Controller
                            name="notificationDate"
                            control={control}
                            render={({ field }) => (
                              <>
                                <Label>Data de Notificação:</Label>

                                <DatePicker
                                  value={field.value || dayjs()}
                                  onChange={(date) => field.onChange(date)}
                                  minDate={dayjs()}
                                  format="DD/MM/YYYY"
                                  slotProps={{
                                    textField: {
                                      fullWidth: true,
                                    },
                                  }}
                                />
                              </>
                            )}
                          />
                          <Label>Proxima Manutenção</Label>
                          <TextField
                            fullWidth
                            {...register("descriptionMaintenance")}
                          />
                        </BoxDate>
                      ) : (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                          <AlertTitle>Google Calendar não conectado</AlertTitle>
                          Para usar notificações automáticas, conecte sua conta
                          do Google nas configurações do perfil.
                        </Alert>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>

              <BoxButtons>
                <ButtonCancel onClick={() => navigate("/")}>
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
          </FormCard>
        )}
      </Container>
      <Snackbar
        open={feedback.open}
        autoHideDuration={4000}
        onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setFeedback((prev) => ({ ...prev, open: false }))}
          severity={feedback.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </LocalizationProvider>
  );
};
