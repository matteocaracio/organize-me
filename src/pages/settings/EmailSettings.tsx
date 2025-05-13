
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const EmailSettings = () => {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserEmail();
  }, []);

  const fetchUserEmail = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        setEmail(user.email);
      }
    } catch (error) {
      console.error("Error fetching email:", error);
      toast.error("Erro ao carregar email");
    } finally {
      setLoading(false);
    }
  };

  const updateEmail = async () => {
    setLoading(true);
    try {
      if (!newEmail) {
        toast.error("Por favor, insira um novo email");
        return;
      }
      
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      
      if (error) throw error;
      
      toast.success("Solicitação para alteração de email enviada. Verifique sua caixa de entrada para confirmar.");
      setNewEmail("");
    } catch (error) {
      console.error("Error updating email:", error);
      toast.error("Erro ao atualizar email");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Alterar Email</h3>
        <p className="text-sm text-muted-foreground">
          Atualize seu endereço de email. Uma verificação será enviada para o novo email.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currentEmail">Email Atual</Label>
          <Input
            id="currentEmail"
            value={email}
            disabled
            readOnly
            className="bg-muted"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="newEmail">Novo Email</Label>
          <Input
            id="newEmail"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Insira seu novo email"
          />
        </div>
      </div>
      <Button 
        onClick={updateEmail} 
        disabled={loading || !newEmail}
      >
        {loading ? "Enviando..." : "Atualizar Email"}
      </Button>
    </div>
  );
};

export default EmailSettings;
