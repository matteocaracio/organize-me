
import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";

interface NewNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newNote: {
    title: string;
    content: string;
    isProtected: boolean;
  };
  onNewNoteChange: (note: { title: string; content: string; isProtected: boolean }) => void;
  onSave: () => void;
  password?: string;
  onPasswordChange?: (password: string) => void;
}

const NewNoteDialog = ({ 
  open, 
  onOpenChange, 
  newNote, 
  onNewNoteChange, 
  onSave,
  password = "",
  onPasswordChange
}: NewNoteDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar nova nota</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input 
              id="title" 
              placeholder="Digite o título da nota" 
              value={newNote.title}
              onChange={(e) => onNewNoteChange({...newNote, title: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo</Label>
            <Textarea 
              id="content" 
              placeholder="Escreva sua nota aqui..."
              rows={6}
              value={newNote.content}
              onChange={(e) => onNewNoteChange({...newNote, content: e.target.value})}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch 
              id="protected" 
              checked={newNote.isProtected}
              onCheckedChange={(checked) => 
                onNewNoteChange({...newNote, isProtected: checked})
              }
            />
            <Label htmlFor="protected">Proteger com senha</Label>
          </div>
          
          {newNote.isProtected && !password && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-md text-amber-600 text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Senha global não configurada</p>
                <p>Configure uma senha global nas opções de notas antes de proteger uma nota.</p>
              </div>
            </div>
          )}
          
          {newNote.isProtected && password && onPasswordChange && (
            <div className="space-y-2">
              <Label htmlFor="password">Senha Global</Label>
              <Input 
                id="password" 
                type="password"
                placeholder="********" 
                value="********"
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Esta nota será protegida com sua senha global. Você pode alterar a senha global nas opções de notas.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button 
            onClick={onSave}
            disabled={newNote.isProtected && !password}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewNoteDialog;
