
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
  
  // Clear password when dialog closes and focus input when opens
  useEffect(() => {
    if (!open) {
      onPasswordChange("");
      setIsSubmitting(false);
    } else {
      // Focus on input when dialog opens with a small delay to ensure DOM is ready
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [open, onPasswordChange]);

  const handleValidate = () => {
    if (password.trim() && !isSubmitting) {
      setIsSubmitting(true);
      console.log("Validando senha no clique do botão:", password.length, "caracteres");
      onValidate();
      // Resetamos o estado de submitting após um tempo para permitir nova tentativa se necessário
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isSubmitting) {
          onOpenChange(isOpen);
          if (!isOpen) onPasswordChange("");
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
