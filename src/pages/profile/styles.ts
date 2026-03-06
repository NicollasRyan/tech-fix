import styled from "@emotion/styled";
import { Box, Button, Card, Typography, Container, IconButton } from "@mui/material";

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
  font-size: 26px;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.02em;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

export const LogoutIconButton = styled(IconButton)`
  background-color: rgba(211, 47, 47, 0.06);
  color: #d32f2f;
  border-radius: 12px;
  padding: 8px;
  transition: all 0.2s ease;
  border: 1px solid rgba(211, 47, 47, 0.25);

  &:hover {
    background-color: rgba(211, 47, 47, 0.12);
    border-color: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(211, 47, 47, 0.2);
  }

  &:active {
    transform: translateY(0);
    box-shadow: none;
  }

  svg {
    font-size: 20px;
  }
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
  background-color: rgba(211, 47, 47, 0.08);
  color: #d32f2f;
  text-transform: none;
  padding: 10px 22px;
  border-radius: 12px;
  font-weight: 600;
  transition: all 0.2s ease;

  &:hover {
    background-color: rgba(211, 47, 47, 0.18);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 8px 16px;
  }
`;

export const ButtonEdit = styled(Button)`
  background: linear-gradient(135deg, #1565c0, #0d47a1);
  color: #fff;
  text-transform: none;
  padding: 10px 24px;
  border-radius: 12px;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(13, 71, 161, 0.25);
  transition: all 0.2s ease;

  &:hover {
    box-shadow: 0 6px 18px rgba(13, 71, 161, 0.35);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 600px) {
    font-size: 12px;
    padding: 8px 18px;
  }
`;

export const ActionButtons = styled(Box)`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;
