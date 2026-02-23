import styled from "@emotion/styled";
import { Box, Button, Card, Typography, Container } from "@mui/material";

export const ContainerProfile = styled(Container)`
  margin-bottom: 32px;
  `;

export const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const Title = styled(Typography)`
  font-size: 32px;
  font-weight: bold;
  color: #000;
`;

export const UserInfoCard = styled(Card)`
  padding: 24px;
  margin-bottom: 24px;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

export const InfoRow = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #ddd;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
  }
`;

export const InfoLabel = styled(Typography)`
  font-weight: 600;
  color: #444141;
  font-size: 14px;
`;

export const InfoValue = styled(Typography)`
  color: #000;
  font-size: 16px;
`;

export const StatsContainer = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

export const StatCard = styled(Card)`
  padding: 16px;
  text-align: center;
  background-color: #f5f5f5;
  border-radius: 8px;
`;

export const StatValue = styled(Typography)`
  font-size: 32px;
  font-weight: bold;
  color: #000;
  margin-bottom: 8px;
`;

export const StatLabel = styled(Typography)`
  font-size: 14px;
  color: #666;
`;

export const ButtonLogout = styled(Button)`
  background-color: #e0e0e0;
  color: #000;
  text-transform: capitalize;
  padding: 8px 24px;
  
  &:hover {
    background-color: #d5d5d5;
  }
`;

export const ButtonEdit = styled(Button)`
  background-color: #000;
  color: #fff;
  text-transform: capitalize;
  padding: 8px 24px;

  &:hover {
    background-color: #333;
  }
`;

export const ActionButtons = styled(Box)`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;
