
import React from "react";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";

interface NotesToolbarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  showDeleted: boolean;
  onToggleDeleted: () => void;
}

const NotesToolbar = ({
  searchTerm,
  setSearchTerm,
  showDeleted,
  onToggleDeleted,
}: NotesToolbarProps) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>
      <Button
        variant="outline"
        onClick={onToggleDeleted}
      >
        {showDeleted ? "Ver Notas Ativas" : "Ver Lixeira"}
      </Button>
    </div>
  );
};

export default NotesToolbar;
