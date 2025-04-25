
import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface GlobalPasswordUpdateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidateAndUpdate: () => Promise<boolean>;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  onCurrentPasswordChange: (password: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  passwordMismatch: boolean;
}

const GlobalPasswordUpdateDialog = ({
  open,
  onOpenChange,
  onValidateAndUpdate,
  currentPassword,
  newPassword,
  confirmPassword,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  passwordMismatch,
}: GlobalPasswordUpdateDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) {
          onCurrentPasswordChange("");
          onNewPasswordChange("");
          onConfirmPasswordChange("");
        }
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Alterar Senha Global</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Digite sua senha atual e depois a nova senha para atualizar.
          </p>
          <Input
            type="password"
            placeholder="Senha atual"
            value={currentPassword}
            onChange={(e) => onCurrentPasswordChange(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Nova senha"
            value={newPassword}
            onChange={(e) => onNewPasswordChange(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirmar nova senha"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
          />
          {passwordMismatch && (
            <p className="text-destructive text-sm">As senhas não conferem.</p>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
          }}>
            Cancelar
          </Button>
          <Button 
            onClick={onValidateAndUpdate}
            disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
          >
            Atualizar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalPasswordUpdateDialog;
