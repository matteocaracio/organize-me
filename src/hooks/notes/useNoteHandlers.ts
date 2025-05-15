
import { useNoteOperations } from "@/hooks/notes/useNoteOperations";
import { useNotePassword } from "@/hooks/useNotePassword";
import type { Note } from "@/components/notes/types";
import { toast } from "@/hooks/use-toast";

export const useNoteHandlers = (
  setNewNoteDialog: (value: boolean) => void,
  setPasswordDialog: (value: boolean) => void,
  setViewDialog: (value: boolean) => void,
  selectedNote: Note | null,
  setSelectedNote: (note: Note | null) => void,
  newNote: any,
  setNewNote: (note: any) => void
) => {
  const {
    notes,
    fetchNotes,
    addOrUpdateNote,
    deleteNote,
    togglePin,
    restoreNote,
    permanentlyDeleteNote,
    clearTrash,
  } = useNoteOperations();

  const {
    password,
    setPassword,
    validatePassword,
  } = useNotePassword();

  const handleViewNote = async (id: string) => {
    console.log("Tentando visualizar nota com ID:", id);
    console.log("Notas disponíveis:", notes.length);
    
    const noteToView = notes.find(note => note.id === id);
    if (noteToView) {
      console.log("Nota encontrada:", noteToView);
      setSelectedNote(noteToView);
      
      // Se a nota é protegida, mostra diálogo de senha
      if (noteToView.isProtected) {
        setPasswordDialog(true);
      } else {
        // Senão, mostra a nota diretamente
        setViewDialog(true);
      }
    } else {
      console.error("Nota não encontrada com ID:", id);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nota não encontrada."
      });
    }
  };

  const handleEditNote = async (id: string) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setSelectedNote(noteToEdit);
      setNewNote({
        title: noteToEdit.title,
        content: noteToEdit.content,
        isProtected: noteToEdit.isProtected,
        password: ""
      });
      setNewNoteDialog(true);
    } else {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Nota não encontrada para edição."
      });
    }
  };

  const handleSaveNote = async () => {
    if (!newNote.title.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "O título da nota não pode estar vazio."
      });
      return;
    }
    
    // Mostramos um toast inicial para feedback imediato
    toast({
      title: "Salvando...",
      description: "Sua nota está sendo salva."
    });
    
    const savedNote = await addOrUpdateNote(newNote, selectedNote);
    if (savedNote) {
      setNewNoteDialog(false);
      setNewNote({ title: "", content: "", isProtected: false, password: "" });
      setSelectedNote(null);
      
      toast({
        title: "Sucesso",
        description: selectedNote ? "Nota atualizada com sucesso!" : "Nota adicionada com sucesso!"
      });
    }
  };

  const handlePasswordValidation = async () => {
    console.log("Validando senha:", password ? "senha fornecida" : "sem senha");
    
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Digite uma senha para continuar."
      });
      return;
    }
    
    const isValid = await validatePassword();
    console.log("Senha validada:", isValid);
    
    if (isValid) {
      setPasswordDialog(false);
      setTimeout(() => {
        setViewDialog(true);
      }, 100);
    }
  };

  return {
    handleViewNote,
    handleEditNote,
    handleSaveNote,
    handlePasswordValidation,
    deleteNote,
    togglePin,
    restoreNote,
    permanentlyDeleteNote,
    clearTrash,
    fetchNotes
  };
};
