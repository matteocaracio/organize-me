
import React, { useEffect, useRef, useState } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Handle Enter key press to submit the form
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && password.trim() && !isSubmitting) {
      e.preventDefault();
      handleValidate();
    }
  };
  
  // Melhorar o foco e limpeza do diálogo
  useEffect(() => {
    if (!open) {
      onPasswordChange("");
      setIsSubmitting(false);
    } else {
      // Focus on input when dialog opens
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
    }
  }, [open, onPasswordChange]);

  const handleValidate = () => {
    if (password.trim() && !isSubmitting) {
      setIsSubmitting(true);
      onValidate();
      // Reset submission state after a reasonable timeout if needed
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1500);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
        }
      }}
    >
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
            ref={inputRef}
            type="password"
            placeholder="Digite a senha"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            className="mt-2"
            disabled={isSubmitting}
          />
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              if (!isSubmitting) {
                onOpenChange(false);
              }
            }}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleValidate}
            disabled={!password.trim() || isSubmitting}
          >
            {isSubmitting ? "Verificando..." : "Continuar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PasswordDialog;
