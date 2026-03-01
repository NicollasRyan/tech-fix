import styled from "@emotion/styled";
import { Box, Button, Card, TextField, Typography, Container } from "@mui/material";

export const ContainerEdit = styled(Container)`
  padding: 32px 16px;
  max-width: 600px;
  margin: 0 auto;
  padding-top: 24px;
`;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
`;

export const Title = styled(Typography)`
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;
`;

export const FormCard = styled(Card)`
  padding: 32px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
`;

export const FormGroup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 24px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

export const FormLabel = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  color: #424242;
  margin-bottom: 4px;
`;

export const StyledTextField = styled(TextField)`
  width: 100%;

  & .MuiOutlinedInput-root {
    background-color: #fafafa;
    border-radius: 10px;

    &:hover {
      background-color: #fff;
    }

    &.Mui-focused {
      background-color: #fff;
    }
  }
`;

export const FormActions = styled(Box)`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #eee;
`;

export const ButtonCancel = styled(Button)`
  background-color: #f5f5f5;
  color: #424242;
  text-transform: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;

  &:hover {
    background-color: #eeeeee;
    color: #1a1a1a;
  }
`;

export const ButtonSave = styled(Button)`
  background-color: #0d47a1;
  color: #fff;
  text-transform: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(13, 71, 161, 0.25);

  &:hover {
    background-color: #1565c0;
    box-shadow: 0 4px 12px rgba(13, 71, 161, 0.35);
  }

  &:disabled {
    background-color: #90a4ae;
    color: #fff;
    cursor: not-allowed;
  }
`;

export const ErrorMessage = styled(Typography)`
  color: #d32f2f;
  font-size: 12px;
  margin-top: 4px;
  font-weight: 500;
`;

export const SuccessMessage = styled(Box)`
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  color: #2e7d32;
  padding: 16px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  font-size: 14px;
  font-weight: 600;
  border: 1px solid rgba(46, 125, 50, 0.2);
`;
