import styled from "@emotion/styled";
import { Box, Button, Typography } from "@mui/material";

export const Container = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  max-width: 420px;
  border-radius: 16px;
  background-color: #fff;
  padding: 28px 24px;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.14), 0 8px 16px rgba(0, 0, 0, 0.08);
  outline: none;
`;

export const TextModal = styled(Typography)`
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5;
  color: #1a1a1a;
  margin-bottom: 24px;
  padding: 0;
`;

export const BoxButtons = styled(Box)`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  margin-top: 4px;
`;

export const ButtonSubmit = styled(Button)`
  background-color: #d32f2f;
  color: #fff;
  border-radius: 10px;
  text-transform: none;
  font-weight: 600;
  padding: 10px 20px;
  box-shadow: 0 2px 8px rgba(211, 47, 47, 0.25);

  &:hover {
    background-color: #b71c1c;
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.35);
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
