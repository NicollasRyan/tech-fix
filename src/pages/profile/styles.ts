import styled from "@emotion/styled";
import { Box, Button, Card, Typography, Container } from "@mui/material";

export const ContainerProfile = styled(Container)`
  margin-bottom: 40px;
  padding-top: 24px;
`;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
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

export const UserInfoCard = styled(Card)`
  padding: 28px;
  margin-bottom: 28px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
`;

export const InfoRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const InfoLabel = styled(Typography)`
  font-weight: 600;
  color: #616161;
  font-size: 14px;
`;

export const InfoValue = styled(Typography)`
  color: #1a1a1a;
  font-size: 15px;
  font-weight: 500;
`;

export const StatsContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
`;

export const StatCard = styled(Card)`
  padding: 24px 20px;
  text-align: center;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #eee;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
  }
`;

export const StatValue = styled(Typography)`
  font-size: 28px;
  font-weight: 700;
  color: #0d47a1;
  margin-bottom: 8px;
  letter-spacing: -0.02em;
`;

export const StatLabel = styled(Typography)`
  font-size: 13px;
  color: #616161;
  font-weight: 500;
`;

export const ButtonLogout = styled(Button)`
  background-color: #f5f5f5;
  color: #424242;
  text-transform: none;
  padding: 10px 24px;
  border-radius: 10px;
  font-weight: 600;

  &:hover {
    background-color: #ffebee;
    color: #c62828;
  }
`;

export const ButtonEdit = styled(Button)`
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
`;

export const ActionButtons = styled(Box)`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;
