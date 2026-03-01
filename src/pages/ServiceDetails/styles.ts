import styled from "@emotion/styled";
import { Box, Button, TableCell, TableRow, Typography } from "@mui/material";

export const BoxButtons = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

export const BoxActions = styled(Box)`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

export const ButtonEdit = styled(Button)`
  background-color: #0d47a1;
  color: #fff;
  text-transform: none;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 20px;
  box-shadow: 0 2px 8px rgba(13, 71, 161, 0.25);

  &:hover {
    background-color: #1565c0;
    box-shadow: 0 4px 12px rgba(13, 71, 161, 0.35);
  }
`;

export const ButtonDelete = styled(Button)`
  background-color: #d32f2f;
  color: #fff;
  text-transform: none;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 20px;

  &:hover {
    background-color: #b71c1c;
    box-shadow: 0 2px 8px rgba(211, 47, 47, 0.25);
  }
`;

export const BoxInfo = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0;
  background-color: #fff;
  border-radius: 16px;
  padding-bottom: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  overflow: hidden;
`;

export const BoxMaintenances = styled(Box)`
  margin-top: 24px;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
`;

export const MaintenancesTitle = styled(Typography)`
  font-size: 15px;
  margin-bottom: 20px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const EmptyMaintenances = styled(Box)`
  text-align: center;
  padding: 48px 24px;
  background-color: #fafafa;
  border-radius: 12px;
  border: 1px dashed #e0e0e0;
`;

export const InfoItem = styled(TableRow)`
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

export const InfoLabelCell = styled(TableCell)`
  padding: 14px 16px;
  font-weight: 600;
  color: #616161;
  font-size: 14px;
  background-color: #fafafa;
  width: 200px;
`;

export const TableValue = styled(TableCell)`
  border-left: 1px solid #f0f0f0;
  padding: 14px 16px;
  color: #424242;
  font-size: 14px;
`;

export const ButtonAddNotification = styled(Button)`
  background-color: #0d47a1;
  color: #fff;
  text-transform: none;
  font-weight: 600;
  border-radius: 4px;
  padding: 6px 16px;
  box-shadow: 0 2px 8px rgba(13, 71, 161, 0.25);

  &:hover {
    background-color: #1565c0;
    box-shadow: 0 4px 12px rgba(13, 71, 161, 0.35);
  }
`;

export const ButtonAddModification = styled(Button)`
  background-color: #2e7d32;
  color: #fff;
  text-transform: none;
  font-weight: 600;
  border-radius: 4px;
  padding: 8px 20px;
  box-shadow: 0 2px 8px rgba(46, 125, 50, 0.25);

  &:hover {
    background-color: #388e3c;
    box-shadow: 0 4px 12px rgba(46, 125, 50, 0.35);
  }
`;

export const BoxTypeService = styled(Box)`
  display: inline-block;
  width: 120px;
  padding: 2px 0;
  text-align: center;
  border-radius: 24px;
  margin-bottom: 12px;

  p {
    font-size: 12px;
    font-weight: 700;
    margin: 0;
  }
`;

export const TextClient = styled(Typography)`
  font-size: 15px;
  margin-bottom: 12px;
  font-weight: 700;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

export const CardServiceContent = styled(Box)`
  padding: 0;
  border-radius: 16px;
  background-color: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  overflow: hidden;
  display: flex;
  align-items: stretch;
  border: 1px solid #eee;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  }
`;

export const CardDateBox = styled(Box)`
  min-width: 96px;
  background: linear-gradient(180deg, #e3f2fd 0%, #bbdefb 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px;
`;

export const CardDateDay = styled(Typography)`
  font-size: 28px;
  font-weight: 800;
`;

export const CardDateSeparator = styled(Typography)`
  font-size: 14px;
  font-weight: 700;
  color: #718096;
`;

export const CardDateMonth = styled(Typography)`
  font-size: 20px;
  font-weight: 700;
`;

export const CardDateYear = styled(Typography)`
  font-size: 12px;
  font-weight: 600;
  color: #4a4a4a;
`;

export const CardRightContent = styled(Box)`
  flex: 1;
  padding: 20px;
`;

export const CardTitleRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardTitle = styled(Typography)`
  font-weight: 700;
  font-size: 18px;
  color: #1a1a1a;
`;

export const CardValue = styled(Typography)`
  font-weight: 700;
  color: #2e7d32;
  font-size: 16px;
`;

export const CardDescription = styled(Typography)`
  margin-top: 8px;
  color: #616161;
  font-size: 14px;
  line-height: 1.5;
`;

export const CardFooter = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

export const CardParts = styled(Typography)`
  font-size: 13px;
  color: #616161;

  strong {
    font-weight: 700;
    color: #424242;
  }
`;
