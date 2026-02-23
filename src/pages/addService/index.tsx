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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ArrowBack } from "@mui/icons-material";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, useState } from "react";
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
  Text,
  Label,
  BoxLine,
  Title,
  BoxHeader
} from "./styles.ts";
import { PatternFormat, NumericFormat } from "react-number-format";
import { useAuth } from "../../contexts/AuthContext.tsx";
import { createCalendarEvent } from "../../services/calendarService.ts";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useNavigate, useParams } from "react-router-dom";

type FormValues = {
  clientName: string;
  serviceType: string;
  description?: string;
  valueService: string;
  notify: boolean;
  notificationDate: Dayjs | null;
  phone?: string;
  email?: string;
  cpf?: string;
  address?: string;
  equipmentModel?: string;
  equipmentBrand?: string;
  usedParts?: string;
};

export type ModalAddServiceInitialData = {
  clientName: string;
  serviceType: string;
  description?: string;
  valueService: number | string;
  notificationDate: { toDate: () => Date } | null;
  phone?: string;
  email?: string;
  cpf?: string;
  address?: string;
  equipmentModel?: string;
  equipmentBrand?: string;
  usedParts?: string;
};

const defaultValues: FormValues = {
  clientName: "",
  serviceType: "",
  description: "",
  valueService: "",
  notify: false,
  notificationDate: null,
  phone: "",
  email: "",
  cpf: "",
  address: "",
  equipmentModel: "",
  equipmentBrand: "",
  usedParts: "",
};

type ModalAddServiceProps = {
  propsServiceId?: string;
  propsInitialData?: ModalAddServiceInitialData;
  onSuccess?: (message: string) => void;
  onError?: (message: string) => void;
};

export const AddService = ({
  propsServiceId,
  propsInitialData,
  onSuccess,
  onError,
}: ModalAddServiceProps) => {
  const { id: paramServiceId } = useParams<{ id: string }>();
  const serviceId = propsServiceId || paramServiceId;
  const [initialData, setInitialData] = useState<
    ModalAddServiceInitialData | undefined
  >(propsInitialData);
  const [loading, setLoading] = useState(false);

  const servicesRef = collection(db, "services");
  const isEdit = Boolean(serviceId);
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isEdit || initialData || loading) return;

    const fetchServiceData = async () => {
      try {
        setLoading(true);
        if (!serviceId) return;

        const docRef = doc(db, "services", serviceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setInitialData({
            clientName: data.clientName,
            serviceType: data.serviceType,
            description: data.description,
            valueService: data.valueService,
            notificationDate: data.notificationDate,
            phone: data.phone,
            email: data.email,
            cpf: data.cpf,
            address: data.address,
            equipmentModel: data.equipmentModel,
            equipmentBrand: data.equipmentBrand,
            usedParts: data.usedParts,
          });
        }
      } catch (error) {
        console.error("Erro ao buscar serviço:", error);
        onError?.("Erro ao carregar os dados do serviço.");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [isEdit, serviceId, initialData, loading, onError]);

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
        phone: initialData.phone || "",
        email: initialData.email || "",
        cpf: initialData.cpf || "",
        address: initialData.address || "",
        equipmentModel: initialData.equipmentModel || "",
        equipmentBrand: initialData.equipmentBrand || "",
        usedParts: initialData.usedParts || "",
      });
    } else {
      reset(defaultValues);
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
          phone: data?.phone,
          email: data?.email,
          cpf: data?.cpf,
          address: data?.address,
          equipmentModel: data?.equipmentModel,
          equipmentBrand: data?.equipmentBrand,
          usedParts: data?.usedParts,
          updatedAt: Timestamp.now(),
        });
      } else {
        await addDoc(servicesRef, {
          clientName: data.clientName,
          serviceType: normalizedServiceType,
          description: data?.description,
          valueService: parsedValue,
          notificationDate: notificationTimestamp,
          phone: data?.phone,
          email: data?.email,
          cpf: data?.cpf,
          address: data?.address,
          equipmentModel: data?.equipmentModel,
          equipmentBrand: data?.equipmentBrand,
          usedParts: data?.usedParts,
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
      onSuccess?.(
        isEdit
          ? "Servico atualizado com sucesso."
          : "Servico salvo com sucesso.",
      );
      navigate("/serviceDetails/" + (serviceId || ""));
    } catch (error) {
      console.error("Erro ao salvar servico:", error);
      onError?.(toUserErrorMessage(error));
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ptBR">
      <Container>
        <BoxHeader>
          <IconButton onClick={() => navigate(isEdit ? "/serviceDetails/" + serviceId : "/")}>
            <ArrowBack />
          </IconButton>
          <Title>{isEdit ? "Editar Servico" : "Adicionar Novo Servico"}</Title>
        </BoxHeader>
        {isEdit && loading && <p>Carregando dados do serviço...</p>}
        {!loading && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} marginBottom={2}>
              <Grid size={12}>
                <BoxLine>
                  <Text>Dados do Cliente</Text>
                </BoxLine>
              </Grid>
              <Grid size={6}>
                <Label>Nome do cliente</Label>
                <TextField
                  {...register("clientName")}
                  error={!!errors.clientName}
                  helperText={errors.clientName?.message}
                  fullWidth
                />
              </Grid>

              <Grid size={6}>
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
              <Grid size={6}>
                <Label>Email (Opcional)</Label>
                <TextField
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
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
              <Grid size={12}>
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
              <Grid size={6}>
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
              <Grid size={6}>
                <Label>Valor do Serviço</Label>
                <Controller
                  name="valueService"
                  control={control}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
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
                        field.onChange(values.value);
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid size={12}>
                <Label>Descrição do Serviço</Label>
                <TextField
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
                <Label>Modelo do Equipamento (Opcional)</Label>
                <TextField
                  {...register("equipmentModel")}
                  error={!!errors.equipmentModel}
                  helperText={errors.equipmentModel?.message}
                  fullWidth
                />
              </Grid>
              <Grid size={6}>
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
                  multiline
                  rows={3}
                  {...register("usedParts")}
                  error={!!errors.usedParts}
                  helperText={errors.usedParts?.message}
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
                        <Label>Data de Notificacao:</Label>
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
              <ButtonCancel onClick={() => navigate("/")}>
                Cancelar
              </ButtonCancel>
              <ButtonSubmit type="submit">
                {isSubmitting ? "Salvando..." : isEdit ? "Salvar" : "Adicionar"}
              </ButtonSubmit>
            </BoxButtons>
          </form>
        )}
      </Container>
    </LocalizationProvider>
  );
};
