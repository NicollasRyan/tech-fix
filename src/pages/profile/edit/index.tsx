import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword, User } from "firebase/auth";
import { db } from "../../../firebase.ts";
import { useAuth } from "../../../contexts/AuthContext.tsx";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { profileEditSchema } from "./profileEditSchema.ts";
import {
  ContainerEdit,
  Header,
  Title,
  FormCard,
  FormGroup,
  FormLabel,
  StyledTextField,
  FormActions,
  ButtonCancel,
  ButtonSave,
  ErrorMessage,
  SuccessMessage,
} from "./styles.ts";
import { Box, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";
import React from "react";

function ProfileEdit() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Função para formatar telefone
  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length <= 2) {
      return cleaned;
    }
    if (cleaned.length <= 7) {
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    }
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileEditSchema),
    defaultValues: {
      displayName: "",
      phoneNumber: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      // Buscar dados do usuário do Firestore
      const fetchUserData = async () => {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            reset({
              displayName: user.displayName || "",
              phoneNumber: userData?.phoneNumber || "",
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          } else {
            // Se não existe documento, apenas reseta com dados do Auth
            reset({
              displayName: user.displayName || "",
              phoneNumber: "",
              currentPassword: "",
              newPassword: "",
              confirmPassword: "",
            });
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          // Fallback: reseta com dados apenas do Auth
          reset({
            displayName: user.displayName || "",
            phoneNumber: "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        }
      };

      fetchUserData();
    }
  }, [user, authLoading, navigate, reset]);

  const onSubmit = async (data: any) => {
    if (!user) return;

    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      // Atualizar displayName no Firebase Auth
      await updateProfile(user, {
        displayName: data.displayName,
      });

      // Salvar phoneNumber em um documento customizado no Firestore
      await setDoc(
        doc(db, "users", user.uid),
        {
          displayName: data.displayName,
          phoneNumber: data.phoneNumber,
          email: user.email,
          updatedAt: new Date(),
        },
        { merge: true }
      );

      // Se fornecidos, atualizar a senha
      if (data.currentPassword && data.newPassword) {
        // Reautenticar o usuário com a senha atual
        const credentials = EmailAuthProvider.credential(
          user.email!,
          data.currentPassword
        );
        
        await reauthenticateWithCredential(user as User, credentials);
        
        // Atualizar para nova senha
        await updatePassword(user as User, data.newPassword);
      }

      setSuccessMessage("Perfil atualizado com sucesso!");
      
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      
      if (error.code === "auth/wrong-password") {
        setErrorMessage("Senha atual incorreta.");
      } else if (error.code === "auth/requires-recent-login") {
        setErrorMessage("Para alterar a senha, você precisa fazer login novamente.");
      } else {
        setErrorMessage("Erro ao atualizar perfil. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <ContainerEdit>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </ContainerEdit>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <ContainerEdit>
      <Header>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton onClick={() => navigate("/profile")} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Title>Editar Perfil</Title>
          </Box>
        </Box>
      </Header>

      {successMessage && (
        <SuccessMessage>{successMessage}</SuccessMessage>
      )}

      {errorMessage && (
        <Alert severity="error" style={{ marginBottom: "24px" }}>
          {errorMessage}
        </Alert>
      )}

      <FormCard>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <FormLabel>Nome Completo</FormLabel>
            <Controller
              name="displayName"
              control={control}
              render={({ field }) => (
                <Box>
                  <StyledTextField
                    {...field}
                    placeholder="Digite seu nome completo"
                    error={!!errors.displayName}
                    disabled={loading}
                  />
                  {errors.displayName && (
                    <ErrorMessage>
                      {errors.displayName.message}
                    </ErrorMessage>
                  )}
                </Box>
              )}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Telefone</FormLabel>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <Box>
                  <StyledTextField
                    value={field.value}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value);
                      field.onChange(formatted);
                    }}
                    onBlur={field.onBlur}
                    placeholder="(11) 9XXXX-XXXX"
                    error={!!errors.phoneNumber}
                    disabled={loading}
                  />
                  {errors.phoneNumber && (
                    <ErrorMessage>
                      {errors.phoneNumber.message}
                    </ErrorMessage>
                  )}
                </Box>
              )}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Senha Atual (Opcional)</FormLabel>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <Box>
                  <StyledTextField
                    {...field}
                    type="password"
                    placeholder="Digite sua senha atual (opcional)"
                    error={!!errors.currentPassword}
                    disabled={loading}
                  />
                  {errors.currentPassword && (
                    <ErrorMessage>
                      {errors.currentPassword.message}
                    </ErrorMessage>
                  )}
                </Box>
              )}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Nova Senha (Opcional)</FormLabel>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Box>
                  <StyledTextField
                    {...field}
                    type="password"
                    placeholder="Digite sua nova senha (opcional)"
                    error={!!errors.newPassword}
                    disabled={loading}
                  />
                  {errors.newPassword && (
                    <ErrorMessage>
                      {errors.newPassword.message}
                    </ErrorMessage>
                  )}
                </Box>
              )}
            />
          </FormGroup>

          <FormGroup>
            <FormLabel>Confirmar Nova Senha (Opcional)</FormLabel>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Box>
                  <StyledTextField
                    {...field}
                    type="password"
                    placeholder="Confirme sua nova senha (opcional)"
                    error={!!errors.confirmPassword}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <ErrorMessage>
                      {errors.confirmPassword.message}
                    </ErrorMessage>
                  )}
                </Box>
              )}
            />
          </FormGroup>

          <FormActions>
            <ButtonCancel
              onClick={() => navigate("/profile")}
              disabled={loading}
            >
              Cancelar
            </ButtonCancel>
            <ButtonSave type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar"}
            </ButtonSave>
          </FormActions>
        </form>
      </FormCard>
    </ContainerEdit>
  );
}

export default ProfileEdit;
