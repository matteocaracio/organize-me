
import { useNoteOperations } from "@/hooks/notes/useNoteOperations";
import { useNotePassword } from "@/hooks/useNotePassword";
import type { Note } from "@/components/notes/types";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

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
    validatePassword,
  } = useNotePassword();

  const { toast } = useToast();
  // Adicionar flag para controlar exibição de toasts de erro
  const [isProcessingNote, setIsProcessingNote] = useState(false);

  const handleViewNote = async (id: string) => {
    // Evitar múltiplas chamadas simultâneas
    if (isProcessingNote) return;
    
    console.log("Tentando visualizar nota com ID:", id);
    setIsProcessingNote(true);
    
    try {
      const noteToView = notes.find(note => note.id === id);
      if (noteToView) {
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
        // Usando um único toast para evitar duplicação
        toast({
          variant: "destructive",
          title: "Erro",
          description: "Nota não encontrada."
        });
      }
    } catch (error) {
      console.error("Erro ao tentar visualizar nota:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao tentar visualizar a nota."
      });
    } finally {
      setIsProcessingNote(false);
    }
  };

  const handleEditNote = async (id: string) => {
    // Evitar múltiplas chamadas simultâneas
    if (isProcessingNote) return;
    
    setIsProcessingNote(true);
    try {
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
    } catch (error) {
      console.error("Erro ao editar nota:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Ocorreu um erro ao tentar editar a nota."
      });
    } finally {
      setIsProcessingNote(false);
    }
  };

  const handleSaveNote = async () => {
    console.time("handleSaveNote");
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
    
    try {
      // Use atualização otimista de UI - feche o diálogo imediatamente
      setNewNoteDialog(false);
      
      const savedNote = await addOrUpdateNote(newNote, selectedNote);
      if (savedNote) {
        setNewNote({ title: "", content: "", isProtected: false, password: "" });
        setSelectedNote(null);
        
        toast({
          title: "Sucesso",
          description: selectedNote ? "Nota atualizada com sucesso!" : "Nota adicionada com sucesso!"
        });
      }
      console.timeEnd("handleSaveNote");
    } catch (error) {
      console.error("Erro ao salvar nota:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar a nota. Tente novamente."
      });
      // Reabrir o diálogo em caso de erro
      setNewNoteDialog(true);
    }
  };

  const handlePasswordValidation = async () => {
    console.time("handlePasswordValidation");
    
    if (!password.trim()) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Digite uma senha para continuar."
      });
      return;
    }
    
    // Garantir que não haja chamadas duplicadas
    if (isProcessingNote) return;
    setIsProcessingNote(true);
    
    // Mostrar feedback de carregamento
    toast({
      title: "Verificando senha...",
      description: "Aguarde um momento."
    });
    
    try {
      console.log("Validando senha para nota:", selectedNote?.id);
      const isValid = await validatePassword();
      console.log("Resultado da validação:", isValid);
      
      if (isValid) {
        setPasswordDialog(false);
        // Use setTimeout com tempo reduzido
        setTimeout(() => {
          if (selectedNote) {
            setViewDialog(true);
          }
        }, 100);
        toast({
          title: "Sucesso",
          description: "Senha validada com sucesso!"
        });
      }
    } catch (error) {
      console.error("Erro durante validação de senha:", error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao validar senha. Tente novamente."
      });
    } finally {
      setIsProcessingNote(false);
      console.timeEnd("handlePasswordValidation");
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
