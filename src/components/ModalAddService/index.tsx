import { Box, Button, Checkbox, FormControlLabel, FormHelperText, MenuItem, Modal, Select, TextField, Typography } from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Timestamp, addDoc, collection, doc, updateDoc } from "firebase/firestore"
import { auth, db } from "../../firebase.ts"

type FormValues = {
    clientName: string
    serviceType: string
    description: string
    valueService: string
    notify: boolean
    notificationDate: Dayjs | null
}

export type ModalAddServiceInitialData = {
    clientName: string
    serviceType: string
    description: string
    valueService: string
    notificationDate: { toDate: () => Date } | null
}

const defaultValues: FormValues = {
    clientName: "",
    serviceType: "",
    description: "",
    valueService: "",
    notify: false,
    notificationDate: null,
}

type ModalAddServiceProps = {
    showModal: boolean
    setShowModal: (showModal: boolean) => void
    serviceId?: string
    initialData?: ModalAddServiceInitialData
}

export const ModalAddService = ({ showModal, setShowModal, serviceId, initialData }: ModalAddServiceProps) => {
    const servicesRef = collection(db, "services")
    const isEdit = Boolean(serviceId && initialData)

    const { control, handleSubmit, register, reset, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
        defaultValues,
    })
    const notify = watch("notify")

    useEffect(() => {
        if (!showModal) return
        if (isEdit && initialData) {
            const hasNotification = !!initialData.notificationDate
            reset({
                clientName: initialData.clientName,
                serviceType: initialData.serviceType,
                description: initialData.description,
                valueService: initialData.valueService,
                notify: hasNotification,
                notificationDate: hasNotification && initialData.notificationDate ? dayjs(initialData.notificationDate.toDate()) : null,
            })
        } else {
            reset(defaultValues)
        }
    }, [showModal, isEdit, initialData, reset])

    const onSubmit = async (data: FormValues) => {
        const user = auth.currentUser
        if (!user) return
        try {
            if (isEdit && serviceId) {
                await updateDoc(doc(db, "services", serviceId), {
                    clientName: data.clientName,
                    serviceType: data.serviceType,
                    description: data.description,
                    valueService: data.valueService,
                    notificationDate: data.notify && data.notificationDate
                        ? Timestamp.fromDate(data.notificationDate.toDate())
                        : null,
                })
            } else {
                await addDoc(servicesRef, {
                    clientName: data.clientName,
                    serviceType: data.serviceType,
                    description: data.description,
                    valueService: data.valueService,
                    notificationDate: data.notify && data.notificationDate
                        ? Timestamp.fromDate(data.notificationDate.toDate())
                        : null,
                    userId: user.uid,
                    createdAt: Timestamp.now(),
                })
            }
            reset(defaultValues)
            setShowModal(false)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <Modal
            open={showModal}
            onClose={() => setShowModal(false)}
            children={
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Box sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", bgcolor: "background.paper", p: 3 }}>
                        <Typography>{isEdit ? "Editar Serviço" : "Adcionar Novo Serviço"}</Typography>
                        <Button onClick={() => setShowModal(false)}>Cancelar</Button>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <TextField
                                label="Nome do cliente"
                                {...register("clientName", { required: "Nome do cliente é obrigatório" })}
                                error={!!errors.clientName}
                                helperText={errors.clientName?.message}
                                fullWidth
                            />
                            <Controller
                                name="serviceType"
                                control={control}
                                rules={{ required: "Tipo de serviço é obrigatório" }}
                                render={({ field }) => (
                                    <>
                                        <Select
                                            {...field}
                                            label="Nome do Serviço"
                                            error={!!errors.serviceType}
                                            fullWidth
                                            displayEmpty
                                        >
                                            <MenuItem value="">Selecione</MenuItem>
                                            <MenuItem value="arcondicionado">Arcondicionado</MenuItem>
                                            <MenuItem value="sistemas_solares">Sistemas Solares</MenuItem>
                                            <MenuItem value="motor_portao">Motor de Portão</MenuItem>
                                            <MenuItem value="cameras">Câmeras</MenuItem>
                                        </Select>
                                        {errors.serviceType && <FormHelperText error>{errors.serviceType.message}</FormHelperText>}
                                    </>
                                )}
                            />
                            <TextField
                                label="Descrição do Serviço"
                                {...register("description", { required: "Descrição é obrigatória" })}
                                error={!!errors.description}
                                helperText={errors.description?.message}
                                fullWidth
                            />
                            <TextField
                                label="Valor do Serviço"
                                {...register("valueService", { required: "Valor é obrigatório" })}
                                error={!!errors.valueService}
                                helperText={errors.valueService?.message}
                                fullWidth
                            />
                            <Controller
                                name="notify"
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Checkbox checked={!!field.value} onChange={(_, checked) => field.onChange(checked)} />}
                                        label="Notificar"
                                    />
                                )}
                            />
                            {notify && (
                                <Controller
                                    name="notificationDate"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Data de Notificação"
                                            value={field.value ?? dayjs()}
                                            onChange={field.onChange}
                                            slotProps={{ textField: { fullWidth: true } }}
                                        />
                                    )}
                                />
                            )}
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Salvando..." : isEdit ? "Salvar" : "Adicionar"}
                            </Button>
                        </form>
                    </Box>
                </LocalizationProvider>
            }
        />
    )
}
