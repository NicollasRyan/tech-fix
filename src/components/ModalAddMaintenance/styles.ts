import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";

export const Container = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  background-color: #fff;
  padding: 16px;
  width: 400px;

  input {
    height: 150px;
  }
`;

export const TextModal = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 16px;
  padding-bottom: 8px;
`;

export const BoxButtons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
`;

export const ButtonSubmit = styled(Button)`
  background-color: #000;
  color: #fff;
  border-radius: 8px;
  text-transform: capitalize;

  &:hover {
    background-color: #333;
  }
`;

export const ButtonCancel = styled(Button)`
  background-color: #e0e0e0;
  color: #000;
  text-transform: capitalize;
  &:hover {
    background-color: #d5d5d5;
  }
`;
