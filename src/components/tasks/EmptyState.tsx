
import React from "react";
import { AlertCircle, Check } from "lucide-react";

interface EmptyStateProps {
  type: "pending" | "completed";
}

const EmptyState = ({ type }: EmptyStateProps) => {
  if (type === "pending") {
    return (
      <div className="text-center p-6 text-muted-foreground">
        <AlertCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p>Sem tarefas pendentes. Adicione uma nova tarefa!</p>
      </div>
    );
  }

  return (
    <div className="text-center p-6 text-muted-foreground">
      <Check className="h-12 w-12 mx-auto mb-2 opacity-50" />
      <p>Nenhuma tarefa concluída ainda.</p>
    </div>
  );
};

export default EmptyState;
