import { Person } from "@mui/icons-material";
import { HeaderContainer, UserMenu } from "./styles.ts";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MenuItem, Menu } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase.ts";
import { ModalLogout } from "../ModalLogout/index.tsx";

export function Header() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <HeaderContainer>
      <img
        src="/logo.png"
        alt="Logo Tech Fix"
        width={110}
        style={{ marginBottom: 16 }}
      />
      <UserMenu onClick={handleClick}>
        <Person />
      </UserMenu>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            navigate("/profile");
            handleClose();
          }}
        >
          Minha conta
        </MenuItem>
        <MenuItem onClick={() => setShowLogoutModal(true)}>Logout</MenuItem>
      </Menu>

      <ModalLogout showModal={showLogoutModal} setShowModal={setShowLogoutModal} handleLogout={handleLogout} />
    </HeaderContainer>
  );
}
