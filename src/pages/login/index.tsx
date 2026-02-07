import { Button, TextField, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../firebase.ts";
import { Container, ContainerForm, TextCompany, Title } from "./styles.ts";

function Login() {
    const { register, handleSubmit } = useForm<{ email: string; password: string }>();
    const navigate = useNavigate();

    const onSubmit = async (data: any) => {
        console.log(data);
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            navigate("/")
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Container>
            <ContainerForm>
                <TextCompany>Tech Fix</TextCompany>
                <Title variant="h4">Login</Title>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField size="small" label="Email" type="email" fullWidth {...register("email")} />
                    <TextField size="small" label="Password" type="password" fullWidth {...register("password")} />
                    <Button size="small" variant="contained" color="primary" fullWidth type="submit">Login</Button>
                    <Link to="/forgot-password">Forgot password?</Link>
                </form>
                <Typography variant="body2">Don't have an account? <Link to="/register">Register</Link></Typography>
            </ContainerForm>
        </Container>
    );
}

export default Login;