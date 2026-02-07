import { Box, Typography } from "@mui/material";
import styled from "styled-components";

export const Container = styled(Box)`
    background-color: gray;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
`;

export const ContainerForm = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 2rem;
    border-radius: 1rem;
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
    background-color: #fff;
    width: 100%;
    height: 100%;
    max-width: 400px;
    margin: 0 auto;
`;

export const TextCompany = styled(Typography)`
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
    font-weight: bold;
    color: #000;
`;

export const Title = styled(Typography)`
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1rem;
`;