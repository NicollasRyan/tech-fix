import styled from "@emotion/styled";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";

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

export const ActionIconButton = styled(IconButton)<{ variantcolor: string }>`
  border-radius: 14px;
  padding: 10px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);

  p {
    font-size: 14px;
  }

  ${({ variantcolor }) =>
    variantcolor === "success" &&
    `
      background-color: rgba(46, 125, 50, 0.08);
      color: #2e7d32;

      &:hover {
        background-color: rgba(46, 125, 50, 0.18);
        transform: translateY(-2px);
      }
    `}

  ${({ variantcolor }) =>
    variantcolor === "primary" &&
    `
      background-color: rgba(25, 118, 210, 0.08);
      color: #1976d2;

      &:hover {
        background-color: rgba(25, 118, 210, 0.18);
        transform: translateY(-2px);
      }
    `}

  ${({ variantcolor }) =>
    variantcolor === "error" &&
    `
      background-color: rgba(211, 47, 47, 0.08);
      color: #d32f2f;

      &:hover {
        background-color: rgba(211, 47, 47, 0.18);
        transform: translateY(-2px);
      }
    `}
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
  background: #ffffff;
  border-radius: 18px;
  padding: 24px;
  margin-bottom: 18px;
  border: 1px solid #eaeaea;
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
  gap: 18px;

  &:hover {
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
    transform: translateY(-3px);
  }

  @media (max-width: 600px) {
    padding: 18px;
  }
`;

export const CardHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

export const CardTitle = styled(Typography)`
  font-size: 19px;
  font-weight: 700;
  color: #1c1c1c;

  @media (max-width: 600px) {
    font-size: 16px;
  }
`;

export const CardDateBadge = styled(Box)`
  background: #f1f5f9;
  color: #000;
  font-family: 'Courier New', Courier, monospace;
  font-size: 13px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CardValue = styled(Typography)`
  font-size: 22px;
  font-weight: 800;
  color: #2e7d32;
  margin-top: -6px;

  @media (max-width: 600px) {
    font-size: 18px;
  }
`;

export const DividerLine = styled(Box)`
  height: 1px;
  width: 100%;
  background: #f0f0f0;
`;

export const CardDescription = styled(Typography)`
  font-size: 14px;
  color: #555;
  line-height: 1.6;
`;

export const CardPartsSection = styled(Box)`
  font-size: 13px;
  color: #616161;

  strong {
    font-weight: 600;
    color: #333;
  }
`;

export const PartsWrapper = styled(Box)`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

export const StyledChip = styled(Chip)`
  font-size: 12px;
  background: #f5f5f5;
`;

export const CardFooter = styled(Box)`
  display: flex;
  justify-content: flex-end;
`;

export const ActionButtonGroup = styled(Stack)`
  flex-direction: row;
  gap: 8px;
`;

export const EditIconButton = styled(IconButton)`
  background-color: #f5f5f5;
  transition: all 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
    transform: scale(1.05);
  }
`;

export const DeleteIconButton = styled(IconButton)`
  background-color: #fdecea;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f8d7da;
    transform: scale(1.05);
  }
`;
