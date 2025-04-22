
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

interface GlobalPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  password: string;
  onPasswordChange: (password: string) => void;
  isUpdate: boolean;
}

const GlobalPasswordDialog = ({
  open,
  onOpenChange,
  onSave,
  password,
  onPasswordChange,
  isUpdate,
}: GlobalPasswordDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onOpenChange={(open) => {
        onOpenChange(open);
        if (!open) onPasswordChange("");
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isUpdate ? "Alterar Senha Global" : "Configurar Senha Global"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            {isUpdate 
              ? "Esta senha será usada para proteger todas as suas notas."
              : "Configure uma senha global para proteger suas notas. Você precisará dessa senha para acessar notas protegidas."}
          </p>
          <Input
            type="password"
            placeholder="Digite a senha global"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => {
            onOpenChange(false);
            onPasswordChange("");
          }}>
            Cancelar
          </Button>
          <Button onClick={onSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalPasswordDialog;
