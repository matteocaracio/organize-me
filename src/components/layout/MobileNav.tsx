
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, ListTodo, Cards, Timer, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

const MobileNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-2 flex justify-around z-10">
      <Link
        to="/"
        className={cn(
          "flex flex-col items-center p-2 text-xs rounded-md transition-colors",
          isActive("/")
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Home className="h-5 w-5 mb-1" />
        <span>Início</span>
      </Link>
      <Link
        to="/tasks"
        className={cn(
          "flex flex-col items-center p-2 text-xs rounded-md transition-colors",
          isActive("/tasks")
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <ListTodo className="h-5 w-5 mb-1" />
        <span>Tarefas</span>
      </Link>
      <Link
        to="/notes"
        className={cn(
          "flex flex-col items-center p-2 text-xs rounded-md transition-colors",
          isActive("/notes")
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <FileText className="h-5 w-5 mb-1" />
        <span>Notas</span>
      </Link>
      <Link
        to="/flashcards"
        className={cn(
          "flex flex-col items-center p-2 text-xs rounded-md transition-colors",
          isActive("/flashcards")
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Cards className="h-5 w-5 mb-1" />
        <span>Flashcards</span>
      </Link>
      <Link
        to="/timer"
        className={cn(
          "flex flex-col items-center p-2 text-xs rounded-md transition-colors",
          isActive("/timer")
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Timer className="h-5 w-5 mb-1" />
        <span>Timer</span>
      </Link>
      <Link
        to="/finance"
        className={cn(
          "flex flex-col items-center p-2 text-xs rounded-md transition-colors",
          isActive("/finance")
            ? "text-primary font-medium"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <Wallet className="h-5 w-5 mb-1" />
        <span>Finanças</span>
      </Link>
    </div>
  );
};

export default MobileNav;
