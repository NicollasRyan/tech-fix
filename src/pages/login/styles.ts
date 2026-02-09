import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export const Container = styled(Box)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ContainerForm = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 32px;
  border: 1px solid #c2c9d666;
  align-self: center;
  border-radius: 16px;
  box-shadow:
    0 0 10px 0 #090b110d,
    0 15px 35px -5px #1317200d;
  background-color: #fff;
  width: 100%;
  height: 100%;
  max-width: 400px;
  margin: 0 auto;

  form {
    display: flex;
    flex-direction: column;
    gap: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #e0e0e0;
    margin-bottom: 16px;
  }
`;

export const Title = styled(Typography)`
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
`;

export const TextRegister = styled(Typography)`
    text-align: center;
`;

export const LinkForm = styled(Link)`
  color: #000;
  text-align: center;
  font-size: 14px;
  font-family: "Inter", sans-serif;
`;

export const ButoonForm = styled(Button)`
  background-color: #000;
  color: #fff;
  border-radius: 8px;
  text-transform: capitalize;
`;

export const ButtonLogin = styled(Button)`
  background-color: #fff;
  color: #000;
  padding: 8px;
  border: 1px solid #c2c9d666;
  border-radius: 8px;
  text-transform: capitalize;

  svg {
    margin-right: 8px;
    width: 20px;
  }

  &:hover {
    background-color: #efefef;
  }
`;
