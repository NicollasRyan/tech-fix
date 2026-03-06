import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";

export const Container = styled(Box)`
  position: relative;
  width: 100%;
  max-width: 420px;

  margin: 40px auto;

  border-radius: 16px;
  background-color: #fff;
  padding: 28px 24px;

  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.14), 
    0 8px 16px rgba(0, 0, 0, 0.08);

  @media (max-width: 600px) {
    width: 94%;
    padding: 20px 16px;
    margin: 24px auto;
    border-radius: 14px;
  }
`;

export const Label = styled(Typography)`
  font-size: 14px;
  font-weight: 600;
  margin: 8px 0;
  color: #424242;
`;

export const TextModal = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
`;

export const BoxButtons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: 20px;
`;

export const ButtonSubmit = styled(Button)`
  background-color: #0d47a1;
  color: #fff;
  border-radius: 10px;
  text-transform: none;
  font-weight: 600;
  padding: 10px 20px;
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
  padding: 10px 20px;

  &:hover {
    background-color: #eeeeee;
    color: #1a1a1a;
  }
`;
