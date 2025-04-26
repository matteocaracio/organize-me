
import { Settings, User, Mail, Key, LogOut } from "lucide-react";
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

const SettingsButton = () => {
  const navigate = useNavigate();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMismatch, setPasswordMismatch] = useState(false);

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
    if (newPassword !== confirmPassword) {
      setPasswordMismatch(true);
      return false;
    }

    setPasswordMismatch(false);
    // Here you would typically validate the current password against the user's actual password
    // and then update it if valid. For this demo, we'll just simulate success.
    
    toast.success("Senha atualizada com sucesso!");
    setIsPasswordDialogOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    return true;
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
