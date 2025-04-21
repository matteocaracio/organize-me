
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  CheckSquare, 
  FileText, 
  Layers, 
  Timer 
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard
  },
  {
    name: "Tarefas",
    href: "/tasks",
    icon: CheckSquare
  },
  {
    name: "Notas",
    href: "/notes",
    icon: FileText
  },
  {
    name: "Flashcards",
    href: "/flashcards",
    icon: Layers
  },
  {
    name: "Timer",
    href: "/timer",
    icon: Timer
  }
];

const MobileNav = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="grid h-full grid-cols-5">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-medium transition-colors",
              activeTab === item.href
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
            onClick={() => setActiveTab(item.href)}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
