import { Box, Button, TextField, Typography } from "@mui/material";
import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase.ts";

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
        <Box>
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField label="Email" type="email" fullWidth {...register("email")} />
                <TextField label="Password" type="password" fullWidth {...register("password")} />
                <Button variant="contained" color="primary" fullWidth type="submit">Login</Button>
            </form>
        </Box>
    );
}

export default Login;