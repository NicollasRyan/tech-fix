import styled from "@emotion/styled";
import { Box, Button, TableCell, TableRow, Typography } from "@mui/material";

export const BoxButtons = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

export const BoxActions = styled(Box)`
  display: flex;
  gap: 8px;
`;

export const ButtonEdit = styled(Button)`
  background-color: #000;
  color: #fff;
  text-transform: capitalize;

  &:hover {
    background-color: #333;
  }
`;

export const ButtonDelete = styled(Button)`
  background-color: #e0e0e0;
  color: #000;
  text-transform: capitalize;
  &:hover {
    background-color: #d5d5d5;
  }
`;

export const BoxInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 8px;
  background-color: #f5f5f5;
  border-radius: 8px;
  /* border: 1px solid #ddd; */
  padding-bottom: 32px;
`;

export const InfoItem = styled(TableRow)`
  border: 1px solid #ddd;
`;

export const TableValue = styled(TableCell)`
  border-left: 1px solid #ddd;
`;

export const ButtonAddNotification = styled(Button)`
  background-color: #1976d2;
  color: #fff;
  text-transform: capitalize;
  &:hover {
    background-color: #1565c0;
  }
`;

export const ButtonAddModification = styled(Button)`
  background-color: #4caf50;
  color: #fff;
  text-transform: capitalize;
  &:hover {
    background-color: #388e3c;
  }
`;
