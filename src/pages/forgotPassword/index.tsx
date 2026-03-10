import React, { useState } from "react";
import { Alert, TextField } from "@mui/material";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { ButoonForm, Container, ContainerForm, LinkForm, Title } from "./styles.ts";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      setIsError(false);
      setMessage("Email de redefinição enviado!");
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Erro ao enviar email.");
    }
  };

  return (
    <Container>
      <ContainerForm>
        <img
          src="/logo.png"
          alt="Logo Tech Fix"
          width={110}
          style={{ marginBottom: 16 }}
        />
        <Title variant="h4">Esqueci minha senha</Title>

        <form onSubmit={handleResetPassword}>
          <TextField
            size="small"
            label="Email"
            type="email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <ButoonForm type="submit" fullWidth>
            Enviar email de redefinição
          </ButoonForm>
        </form>

        {message && (
          <Alert severity={isError ? "error" : "success"}>{message}</Alert>
        )}

        <LinkForm to="/login">Voltar para o login</LinkForm>
      </ContainerForm>
    </Container>
  );
}
