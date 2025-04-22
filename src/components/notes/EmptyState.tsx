
import { FileText } from "lucide-react";

const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold">Nenhuma nota encontrada</h3>
      <p className="text-sm text-muted-foreground text-center mt-2">
        Crie uma nova nota ou ajuste seus filtros de busca.
      </p>
    </div>
  );
};

export default EmptyState;
