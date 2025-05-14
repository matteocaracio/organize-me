
import React, { useEffect } from "react";
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

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onValidate: () => void;
  password: string;
  onPasswordChange: (password: string) => void;
}

const PasswordDialog = ({
  open,
  onOpenChange,
  onValidate,
  password,
  onPasswordChange,
}: PasswordDialogProps) => {
  
  // Handle Enter key press to submit the form
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onValidate();
    }
  };
  
  // Clear password when dialog closes
  useEffect(() => {
    if (!open) {
      onPasswordChange("");
    }
  }, [open, onPasswordChange]);
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nota Protegida</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-12 w-12 text-muted-foreground" />
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Esta nota está protegida por senha. Digite a senha para continuar.
          </p>
          <Input
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              onPasswordChange("");
            }}
          >
            Cancelar
          </Button>
          <Button onClick={onValidate}>Continuar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
