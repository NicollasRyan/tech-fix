import { Box, Button, Select, Typography } from "@mui/material";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

export const BoxNav = styled(Box)`
  display: flex;
  justify-content: space-between;
  margin-bottom: 64px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 16px;
  }
`;

export const BoxSelect = styled(Box)`
  display: flex;
  flex-direction: column;
`;

export const Label = styled(Typography)`
  font-size: 14px;
  color: #444141;
  margin-right: 8px;
`;

export const SelectTypeService = styled(Select)`
  border-radius: 18px;
  padding: 2px 14px;
  background-color: #fff;
  color: #444141;
  border: 1px solid #444141;

  min-width: 200px;
  height: 40px;
`;

export const ButtonAddService = styled(Button)`
  background-color: #000;
  color: #fff;
  border-radius: 8px;
  font-weight: 600;
  padding: 0;
  width: 160px;
  text-transform: capitalize;

  &:hover {
    background-color: #333;
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    width: 100%;
    font-size: 14px;
    height: 40px;
    border-radius: 8px;
    font-weight: 600;
    text-transform: capitalize;
    background-color: #000;
    color: #fff;
  }
`;

export const LinkToService = styled(Link)`
  text-decoration: none;
`;

export const BoxServices = styled(Box)`
  margin-bottom: 32px;
`;
