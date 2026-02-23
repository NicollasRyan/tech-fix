import styled from "@emotion/styled";
import { Box, Button, Card, TextField, Typography, Container } from "@mui/material";

export const ContainerEdit = styled(Container)`
  padding: 32px 16px;
  max-width: 600px;
  margin: 0 auto;
`;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
`;

export const Title = styled(Typography)`
  font-size: 32px;
  font-weight: bold;
  color: #000;
`;

export const FormCard = styled(Card)`
  padding: 32px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

export const FormGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormLabel = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  color: #444141;
  margin-bottom: 8px;
`;

export const StyledTextField = styled(TextField)`
  width: 100%;

  & .MuiOutlinedInput-root {
    background-color: #fff;
  }
`;

export const FormActions = styled(Box)`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #ddd;
`;

export const ButtonCancel = styled(Button)`
  background-color: #e0e0e0;
  color: #000;
  text-transform: capitalize;
  padding: 10px 24px;

  &:hover {
    background-color: #d5d5d5;
  }
`;

export const ButtonSave = styled(Button)`
  background-color: #000;
  color: #fff;
  text-transform: capitalize;
  padding: 10px 24px;

  &:hover {
    background-color: #333;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled(Typography)`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
`;

export const SuccessMessage = styled(Box)`
  background-color: #c8e6c9;
  color: #2e7d32;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 24px;
  font-size: 14px;
`;
