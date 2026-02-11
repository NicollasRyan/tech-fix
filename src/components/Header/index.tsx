import { Person } from "@mui/icons-material";
import { HeaderContainer, UserMenu } from "./styles.ts";

export function Header() {
  return (
    <HeaderContainer>
      <img
        src="/logo.png"
        alt="Logo Tech Fix"
        width={110}
        style={{ marginBottom: 16 }}
      />
      <UserMenu>
        <Person />
      </UserMenu>
    </HeaderContainer>
  );
}
