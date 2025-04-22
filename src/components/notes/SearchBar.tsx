
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNotes } from "./NotesContext";

const SearchBar = () => {
  const { searchTerm, setSearchTerm } = useNotes();

  return (
    <div className="relative">
      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Buscar notas..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;
