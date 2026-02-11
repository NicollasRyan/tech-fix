import styled from "@emotion/styled";
import { Box, Card, Typography } from "@mui/material";

export const CardBox = styled(Card)`
  border-radius: 16px;
  min-width: 320px;
  max-width: 360px;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: box-shadow 0.3s ease, transform 0.3s ease;

  &:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
    transform: translateY(-4px);
  }

  img {
    border-radius: 0;
    object-fit: cover;
    width: 100%;
    height: 200px;
    display: block;
  }
`;

export const BoxTypeService = styled(Box)<{
  bg: string;
  border: string;
  color: string;
}>`
  display: inline-block;
  width: 120px;
  padding: 2px 0;
  background: ${({ bg }) => bg};
  border: 1px solid ${({ border }) => border};
  color: ${({ color }) => color};
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
    font-size: 16px;
    color: #1a1a1a;
    font-weight: 600;
    text-transform: capitalize;
    margin-bottom: 8px;
`;
