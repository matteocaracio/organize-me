
import { useState } from "react";
import { 
  Plus, Search, MoreVertical, Lock, Eye, 
  Bookmark, AlertCircle, PinIcon, FileEdit, Share2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Tipo para as notas
interface Note {
  id: string;
  title: string;
  content: string;
  date: Date;
  isPinned: boolean;
  isProtected: boolean;
}

const Notes = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Ideias para o projeto final",
      content: "1. Implementar autenticação\n2. Criar dashboard interativo\n3. Adicionar notificações\n4. Melhorar a interface mobile",
      date: new Date(2025, 3, 15),
      isPinned: true,
      isProtected: false
    },
    {
      id: "2",
      title: "Informações pessoais",
      content: "Dados importantes, senhas e contatos",
      date: new Date(2025, 3, 10),
      isPinned: false,
      isProtected: true
    },
    {
      id: "3",
      title: "Lista de livros para ler",
      content: "- Clean Code\n- Design Patterns\n- Refactoring\n- Domain-Driven Design",
      date: new Date(2025, 3, 5),
      isPinned: false,
      isProtected: false
    }
  ]);
  
  // Estado para nova nota
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    isProtected: false
  });

  // Função para adicionar uma nova nota
  const addNote = () => {
    if (newNote.title.trim() === "") return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      date: new Date(),
      isPinned: false,
      isProtected: newNote.isProtected
    };
    
    setNotes([note, ...notes]);
    setNewNote({
      title: "",
      content: "",
      isProtected: false
    });
    setOpen(false);
  };

  // Filtra notas pela busca
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Organiza notas com fixadas primeiro
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.date.getTime() - a.date.getTime();
  });

  // Função para alternar fixação da nota
  const togglePin = (id: string) => {
    setNotes(
      notes.map((note) =>
        note.id === id ? { ...note, isPinned: !note.isPinned } : note
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight">Notas</h1>
        <div className="w-full sm:w-auto flex gap-2 items-center">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar notas..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Nova Nota
              </Button>
            </DialogTrigger>
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
                    onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea 
                    id="content" 
                    placeholder="Escreva sua nota aqui..."
                    rows={6}
                    value={newNote.content}
                    onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="protected" 
                    checked={newNote.isProtected}
                    onCheckedChange={(checked) => 
                      setNewNote({...newNote, isProtected: checked})
                    }
                  />
                  <Label htmlFor="protected">Proteger com senha</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={addNote}>Salvar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sortedNotes.length === 0 ? (
          <div className="text-center p-6 text-muted-foreground col-span-full">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma nota encontrada. Crie uma nota!</p>
          </div>
        ) : (
          sortedNotes.map((note) => (
            <Card key={note.id} className="card-hover">
              <CardContent className="p-4 pt-6 relative">
                {note.isPinned && (
                  <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3">
                    <PinIcon className="h-5 w-5 text-primary" />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg truncate">{note.title}</h3>
                  <div className="flex items-center">
                    {note.isProtected && <Lock className="h-4 w-4 mr-1 text-muted-foreground" />}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" /> Modo leitura
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileEdit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => togglePin(note.id)}>
                          <PinIcon className="h-4 w-4 mr-2" /> 
                          {note.isPinned ? "Desafixar" : "Fixar"}
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" /> Compartilhar
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <AlertCircle className="h-4 w-4 mr-2" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div className="h-24 overflow-hidden">
                  <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-4">
                    {note.content}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="px-4 py-2 text-xs text-muted-foreground border-t">
                Atualizado em {note.date.toLocaleDateString('pt-BR')}
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
