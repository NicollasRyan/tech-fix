import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";

export const Title = styled(Typography)`
  font-size: 24px;
  font-weight: 700;
`;

export const Text = styled(Typography)`
  font-size: 18px;
  font-weight: 600;
`;

export const BoxLine = styled(Box)`
  display: flex;
  border-top: 1px solid #c6c6c6;
  padding: 16px 0;
`;

export const BoxHeader = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const BoxButtons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #c6c6c6;
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

export const Label = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
  display: block;
`;
