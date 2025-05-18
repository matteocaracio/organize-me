
export const getSavingTips = (category: string, description: string = ""): string => {
  // Normalize the expense description for better matching
  const normalizedDescription = description.toLowerCase().trim();
  
  // Check for specific keywords first
  if (normalizedDescription.includes("wifi") || 
      normalizedDescription.includes("internet") || 
      normalizedDescription.includes("banda larga")) {
    return "Para economizar em internet, compare diferentes provedores, contrate pacotes básicos suficientes para seu uso e considere dividir o serviço com vizinhos se possível.";
  }
  
  // Category based tips
  switch (category) {
    case "Alimentação":
      return "Planeje suas refeições com antecedência, compre alimentos da estação, aproveite promoções e evite desperdícios guardando sobras para outras refeições.";
      
    case "Entretenimento":
      return "Considere compartilhar assinaturas de streaming com familiares, aproveite conteúdos gratuitos e busque alternativas de lazer que não exigem gastos.";
      
    case "Moradia":
      return "Economize energia apagando luzes desnecessárias, utilize eletrodomésticos eficientes e faça pequenos reparos você mesmo quando possível.";
      
    case "Transporte":
      return "Considere caronas, transporte público ou bicicleta quando viável. Mantenha seu veículo em boas condições para economia de combustível.";
      
    case "Saúde":
      return "Invista em prevenção, pratique exercícios regularmente e verifique programas de desconto em farmácias ou genéricos.";
      
    case "Educação":
      return "Procure bolsas de estudo, materiais gratuitos online e cursos com desconto ou em plataformas educacionais acessíveis.";
      
    case "Roupas":
      return "Compre peças versáteis e de qualidade que durem mais tempo, aproveite liquidações e considere brechós para encontrar bons itens a preços menores.";
      
    case "Lazer":
      return "Busque atividades gratuitas ou de baixo custo em sua cidade, como parques, exposições e eventos culturais com entrada franca.";
      
    case "Restaurantes":
      return "Coma fora com menos frequência, aproveite promoções e cupons de desconto, ou escolha estabelecimentos com bom custo-benefício.";
      
    case "Assinaturas":
      return "Revise regularmente suas assinaturas para cancelar serviços pouco utilizados e considere planos familiares para economizar.";
      
    case "Utilidades":
      return "Compare preços entre fornecedores, monitore seu consumo e implemente práticas sustentáveis que reduzam gastos com água e energia.";
      
    case "Tecnologia":
      return "Pesquise bem antes de comprar, considere modelos anteriores mais baratos e proteja seus dispositivos para evitar reparos caros.";

    case "Internet":
      return "Compare planos de diferentes provedores, negocie descontos com sua operadora atual ou considere pacotes mais básicos se atenderem suas necessidades.";
      
    default:
      return "Para economizar, mantenha um orçamento detalhado, defina metas de economia e evite compras por impulso.";
  }
};
