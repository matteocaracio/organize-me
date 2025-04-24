
import React from "react";
import { Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface NotesHeaderProps {
  hasGlobalPassword: boolean | null;
  onNewNote: () => void;
  onChangePassword: () => void;
  onConfigurePassword: () => void;
}

const NotesHeader = ({
  hasGlobalPassword,
  onNewNote,
  onChangePassword,
  onConfigurePassword,
}: NotesHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold tracking-tight">Notas</h1>
      <div className="flex gap-2">
        {!hasGlobalPassword && (
          <Alert className="max-w-lg">
            <AlertDescription>
              Configure uma senha global para proteger suas notas.{' '}
              <Button 
                variant="link" 
                className="p-0 h-auto" 
                onClick={onConfigurePassword}
              >
                Configurar agora
              </Button>
            </AlertDescription>
          </Alert>
        )}
        {hasGlobalPassword && (
          <Button variant="outline" onClick={onChangePassword}>
            <Settings className="h-4 w-4 mr-2" /> Alterar Senha
          </Button>
        )}
        <Button onClick={onNewNote}>
          <Plus className="h-4 w-4 mr-2" /> Nova Nota
        </Button>
      </div>
    </div>
  );
};

export default NotesHeader;
