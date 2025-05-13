
import { Settings, User, Mail, Key, LogOut, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/auth";
import { useState } from "react";
import GlobalPasswordUpdateDialog from "../notes/GlobalPasswordUpdateDialog";
import { toast } from "sonner";
import { useNotePassword } from "@/hooks/useNotePassword";

const SettingsButton = () => {
  const navigate = useNavigate();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  
  const {
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordMismatch,
    validateAndUpdateGlobalPassword
  } = useNotePassword();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const handleSettings = (setting: string) => {
    if (setting === "password") {
      setIsPasswordDialogOpen(true);
    } else {
      navigate(`/settings/${setting}`);
    }
  };

  const handleValidateAndUpdatePassword = async () => {
    const success = await validateAndUpdateGlobalPassword();
    if (success) {
      setIsPasswordDialogOpen(false);
    }
    return success;
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Configurações</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => handleSettings("profile")}>
            <User className="mr-2 h-4 w-4" />
            Alterar Nome
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSettings("email")}>
            <Mail className="mr-2 h-4 w-4" />
            Alterar Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSettings("password")}>
            <Key className="mr-2 h-4 w-4" />
            Alterar Senha
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSettings("notifications")}>
            <Bell className="mr-2 h-4 w-4" />
            Notificações
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
            <LogOut className="mr-2 h-4 w-4" />
            Deslogar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <GlobalPasswordUpdateDialog
        open={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
        onValidateAndUpdate={handleValidateAndUpdatePassword}
        currentPassword={currentPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        onCurrentPasswordChange={setCurrentPassword}
        onNewPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        passwordMismatch={passwordMismatch}
      />
    </>
  );
};

export default SettingsButton;
