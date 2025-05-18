
export const getSavingTips = (category: string, description: string): string => {
  // First check if there are specific tips for common expense descriptions
  const descriptionLower = description.toLowerCase();
  
  if (descriptionLower.includes("wifi") || descriptionLower.includes("internet")) {
    return "Compare planos de diferentes provedores, negocie o valor da mensalidade, ou compartilhe a conexão com vizinhos para dividir custos.";
  }
  
  if (descriptionLower.includes("celular") || descriptionLower.includes("telefone")) {
    return "Avalie se seu plano atual atende suas necessidades ou se há opções mais econômicas. Considere planos familiares se possível.";
  }
  
  if (descriptionLower.includes("streaming") || descriptionLower.includes("netflix") || descriptionLower.includes("spotify")) {
    return "Considere planos compartilhados com família ou amigos, ou alterne entre serviços diferentes a cada mês em vez de assinar vários simultaneamente.";
  }
  
  // If no specific description matches, fall back to category-based tips
  const tips = {
    "Alimentação": "Compare preços em diferentes supermercados, compre itens da estação e planeje as refeições com antecedência.",
    "Entretenimento": "Busque alternativas gratuitas como eventos comunitários ou utilize plataformas de streaming compartilhadas.",
    "Moradia": "Verifique vazamentos, use lâmpadas LED e mantenha os aparelhos desligados quando não estiver usando.",
    "Transporte": "Utilize transporte público, compartilhe caronas ou considere andar a pé/bicicleta para trajetos curtos.",
    "Saúde": "Prefira medicamentos genéricos e faça check-ups regulares para prevenir problemas maiores.",
    "Educação": "Procure por bolsas de estudo, cursos gratuitos online ou desconto para pagamento antecipado.",
    "Roupas": "Espere por promoções sazonais e compre peças versáteis e de qualidade que durem mais.",
    "Lazer": "Procure atividades gratuitas ou com desconto nos dias de semana.",
    "Restaurantes": "Limitar refeições fora de casa a ocasiões especiais e preparar marmitas para o trabalho/escola.",
    "Assinaturas": "Avalie todas as assinaturas mensais e cancele as que você não usa com frequência.",
    "Utilidades": "Compare provedores de serviços, negocie tarifas, e considere alternativas mais econômicas ou planos que melhor se adequam ao seu consumo.",
    "Tecnologia": "Pesquise preços antes de comprar, considere equipamentos recondicionados e avalie se a atualização é realmente necessária."
  };
  
  return tips[category as keyof typeof tips] || "Analise se este gasto é realmente necessário e procure alternativas mais econômicas.";
};
