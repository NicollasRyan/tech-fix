import {
  TextField,
  Container,
  Grid,
  IconButton,
  Chip,
  Box,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase.ts";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BoxButtons,
  ButtonCancel,
  ButtonSubmit,
  FormCard,
  Label,
  Title,
} from "./styles.ts";
import { maintenanceSchema } from "./maintenanceSchema.ts";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import { Add, ArrowBack } from "@mui/icons-material";
import React from "react";
import z from "zod";

type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;

type Maintenance = {
  id: string;
  title: string;
  valueService: number;
  description?: string;
  usedParts?: string[];
  createdAt: Timestamp;
};

const defaultValues = {
  title: "",
  description: "",
  valueService: null,
  notify: false,
  usedParts: [],
  notificationDate: null,
  serviceDate: null,
};

export const AddMaintenance = () => {
  const navigate = useNavigate();
  const { serviceId, maintenanceId: paramMaintenanceId } = useParams<{
    serviceId: string;
    maintenanceId?: string;
  }>();
  const [searchParams] = useSearchParams();
  const queryMaintenanceId = searchParams.get("maintenanceId");

  const maintenanceId = paramMaintenanceId || queryMaintenanceId;

  const [maintenanceToEdit, setMaintenanceToEdit] =
    useState<Maintenance | null>(null);
  const [loading, setLoading] = useState(false);
  const [allMaintenances, setAllMaintenances] = useState<Maintenance[]>([]);
  const [feedback, setFeedback] = useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({
    open: false,
    severity: "success",
    message: "",
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema),
    defaultValues,
    
  });
  const usedParts = watch("usedParts") ?? [];
  const [pieceInput, setPieceInput] = useState("");

  useEffect(() => {
    if (!maintenanceId || !serviceId || maintenanceToEdit || loading) return;

    const fetchMaintenanceData = async () => {
      try {
        setLoading(true);
        const docRef = doc(db, "services", serviceId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          const manutencoes = data.manutencoes || [];
          setAllMaintenances(manutencoes);

          const maintenance = manutencoes.find(
            (m: any) => m.id === maintenanceId,
          );
          if (maintenance) {
            setMaintenanceToEdit(maintenance);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar manutenção:", error);
        setFeedback({
          open: true,
          severity: "error",
          message: "Erro ao carregar manutenção.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceData();
  }, [maintenanceId, serviceId, maintenanceToEdit, loading]);

  useEffect(() => {
    if (maintenanceToEdit) {
      reset({
        title: maintenanceToEdit.title,
        description: maintenanceToEdit.description || "",
        valueService: Number(maintenanceToEdit.valueService ?? 0),
        usedParts: maintenanceToEdit.usedParts || [],
        notify: false,
        notificationDate: null,
        serviceDate: maintenanceToEdit.createdAt
          ? dayjs(maintenanceToEdit.createdAt.toDate())
          : dayjs(),
      });
    } else if (!loading) {
      reset({ ...defaultValues, serviceDate: dayjs() });
    }
  }, [maintenanceToEdit, loading, reset]);

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

  const handleAddMaintenance = async (data: any) => {
    if (!serviceId) return;

    try {
      const parsedValue = data.valueService;
      const serviceDateTimestamp = data.serviceDate
        ? Timestamp.fromDate(data.serviceDate.toDate())
        : Timestamp.now();

      if (!parsedValue || parsedValue <= 0) {
        setFeedback({
          open: true,
          severity: "error",
          message: "Valor do serviço inválido.",
        });
        return;
      }

      if (maintenanceToEdit) {
        const updated = allMaintenances.map((m: any) =>
          m.id === maintenanceToEdit.id
            ? {
              ...m,
              title: data.title,
              description: data?.description,
              valueService: parsedValue || 0,
              createdAt: serviceDateTimestamp,
              usedParts: data?.usedParts || [],
            }
            : m,
        );

        await updateDoc(doc(db, "services", serviceId), {
          manutencoes: updated,
          updatedAt: Timestamp.now(),
        });
      } else {
        await updateDoc(doc(db, "services", serviceId), {
          manutencoes: arrayUnion({
            id: crypto.randomUUID(),
            title: data.title,
            description: data?.description,
            valueService: parsedValue || 0,
            usedParts: data?.usedParts || [],
            createdAt: serviceDateTimestamp,
          }),
          updatedAt: Timestamp.now(),
        });
      }

      navigate("/serviceDetails/" + serviceId, {
        state: {
          feedback: {
            severity: "success",
            message: maintenanceToEdit
              ? "Manutenção atualizada com sucesso."
              : "Manutenção adicionada com sucesso.",
          },
        },
      });
    } catch (error) {
      console.error("Erro ao salvar manutenção:", error);
      setFeedback({
        open: true,
        severity: "error",
        message: "Erro ao salvar manutenção.",
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={"pt-BR"}>
      <Container maxWidth="md">
        <Title>
          <IconButton onClick={() => navigate("/serviceDetails/" + serviceId)} sx={{ mr: 0.5 }}>
            <ArrowBack />
          </IconButton>
          {maintenanceToEdit
            ? "Editar manutenção"
            : "Adicionar nova manutenção"}
        </Title>
        {loading && <p>Carregando dados da manutenção...</p>}
        {!loading && (
          <FormCard elevation={0}>
            <form onSubmit={handleSubmit(handleAddMaintenance)}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Label>Título</Label>
                  <TextField
                    {...register("title", { required: "Título é obrigatório" })}
                    variant="outlined"
                    fullWidth
                    error={!!errors.title}
                    helperText={errors.title?.message}
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
                        value={field.value || dayjs()}
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
                <Grid size={{ xs: 12 }}>
                  <Label>Descrição da manutenção (Opcional)</Label>
                  <TextField
                    {...register("description")}
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
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
                  <Box sx={{ mt: 2, display: "flex", gap: 1, flexWrap: "wrap" }}>
                    {usedParts?.map((piece, index) => (
                      <Chip
                        key={index}
                        label={piece}
                        onDelete={() => handleRemovePiece(index)}
                      />
                    ))}
                  </Box>
                </Grid>
              </Grid>

              <BoxButtons>
                <ButtonCancel
                  onClick={() => navigate("/serviceDetails/" + serviceId)}
                >
                  Cancelar
                </ButtonCancel>
                <ButtonSubmit type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : maintenanceToEdit ? "Salvar alterações" : "Adicionar"}
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
