
import { ReactNode } from "react";
import MobileNav from "./MobileNav";
import ThemeToggle from "./ThemeToggle";
import { BrandIcon } from "@/components/ui/icons";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-16">
      <header className="border-b p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <BrandIcon className="text-primary" />
          <h1 className="text-xl font-bold text-primary">Organize.me</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="container mx-auto p-4">{children}</main>
      <MobileNav />
    </div>
  );
};

export default Layout;
