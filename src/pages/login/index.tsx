import { TextField, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.ts";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ButoonForm,
  ButtonLogin,
  Container,
  ContainerForm,
  LinkForm,
  TextRegister,
  Title,
} from "./styles.ts";
import {
  FacebookIcon,
  GoogleIcon,
} from "../../components/CustonIcons/index.tsx";
import { loginSchema } from "./loginSchema.ts";
import { FirebaseError } from "firebase/app";

function Login() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    console.log(data);
    try {
      await signInWithEmailAndPassword(auth, data.email, data.password);
      navigate("/");
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case "auth/user-not-found":
            setError("email", {
              type: "manual",
              message: "Usuário não encontrado",
            });
            break;

          case "auth/wrong-password":
            setError("password", {
              type: "manual",
              message: "Senha incorreta",
            });
            break;

          case "auth/invalid-email":
            setError("email", {
              type: "manual",
              message: "Email inválido",
            });
            break;

          default:
            setError("email", {
              type: "manual",
              message: "Email ou senha inválidos",
            });
        }
      }
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
        <Title variant="h4">Login</Title>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            size="small"
            label="Email"
            type="email"
            fullWidth
            {...register("email")}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            size="small"
            label="Password"
            type="password"
            fullWidth
            {...register("password")}
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <ButoonForm type="submit">Login</ButoonForm>
          <LinkForm to="/forgot-password">Esqueceu a senha?</LinkForm>
        </form>
        <ButtonLogin>
          <GoogleIcon /> Login com Google
        </ButtonLogin>
        <ButtonLogin>
          <FacebookIcon /> Login com Facebook
        </ButtonLogin>
        <TextRegister>
          Não tem uma conta? <LinkForm to="/register">Register</LinkForm>
        </TextRegister>
      </ContainerForm>
    </Container>
  );
}

export default Login;
