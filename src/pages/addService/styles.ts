import styled from "@emotion/styled";
import { Box, Button, Paper, Typography } from "@mui/material";

export const FormCard = styled(Paper)`
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
`;

export const Title = styled(Typography)`
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

export const Text = styled(Typography)`
  font-size: 16px;
  font-weight: 600;
  color: #0d47a1;
  letter-spacing: 0.02em;
`;

export const BoxLine = styled(Box)`
  display: flex;
  border-top: 1px solid #e8e8e8;
  padding: 20px 0;
  margin-top: 8px;
`;

export const BoxHeader = styled(Box)`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

export const BoxButtons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px 0 8px;
  margin-top: 8px;
  border-top: 1px solid #e8e8e8;
`;

export const ButtonSubmit = styled(Button)`
  background-color: #0d47a1;
  color: #fff;
  border-radius: 10px;
  text-transform: none;
  font-weight: 600;
  padding: 10px 24px;
  box-shadow: 0 2px 8px rgba(13, 71, 161, 0.25);

  &:hover {
    background-color: #1565c0;
    box-shadow: 0 4px 12px rgba(13, 71, 161, 0.35);
  }
`;

export const ButtonCancel = styled(Button)`
  background-color: #f5f5f5;
  color: #424242;
  border-radius: 10px;
  text-transform: none;
  font-weight: 600;
  padding: 10px 24px;

  &:hover {
    background-color: #eeeeee;
    color: #1a1a1a;
  }
`;

export const Label = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #424242;
`;

export const BoxDate = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;

  p {
    margin: 0;
  }
`;
