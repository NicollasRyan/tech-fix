import styled from "@emotion/styled";
import { Box, IconButton, } from "@mui/material";

export const HeaderContainer = styled(Box)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    border-bottom: 1px solid #efefef;
    margin-bottom: 32px;
    background: #fff;
`; 

export const UserMenu = styled(IconButton)`
    border: 1px solid #ccc;
`;