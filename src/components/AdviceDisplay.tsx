import { Card } from "@/components/ui/card";
import { CheckCircle2, Lightbulb, Leaf } from "lucide-react";

interface AdviceDisplayProps {
  advice: string;
}

export const AdviceDisplay = ({ advice }: AdviceDisplayProps) => {
  // Parse the advice to extract recommendations and justification
  const sections = advice.split("###").filter(Boolean);
  
  const recommendationsSection = sections.find(s => s.includes("Sustainable Farming Advice"));
  const justificationSection = sections.find(s => s.includes("Justification"));
  
  const recommendations = recommendationsSection
    ?.split("\n")
    .filter(line => line.trim().startsWith("-") || line.trim().match(/^\d+\./))
    .map(line => line.replace(/^[-\d+.]\s*/, "").trim())
    .filter(Boolean) || [];
  
  const justification = justificationSection
    ?.split("\n")
    .filter(line => line.trim() && !line.includes("###") && !line.includes("Justification"))
    .join(" ")
    .trim() || "";

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      <Card className="p-8 border-primary/20 bg-gradient-to-br from-card to-primary/5">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-primary">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">🌾 Sustainable Farming Advice</h3>
        </div>
        
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index} 
              className="flex gap-4 p-4 rounded-lg bg-background/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex-shrink-0 mt-1">
                <CheckCircle2 className="w-5 h-5 text-primary" />
              </div>
              <p className="text-foreground leading-relaxed">{rec}</p>
            </div>
          ))}
        </div>
      </Card>

      {justification && (
        <Card className="p-8 border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-secondary">
              <Lightbulb className="w-6 h-6 text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-foreground">🌍 Justification</h3>
          </div>
          
          <p className="text-foreground/90 leading-relaxed text-lg">
            {justification}
          </p>
        </Card>
      )}

      <div className="text-center p-6 rounded-xl bg-accent/10 border border-accent/20">
        <p className="text-lg font-medium text-foreground italic">
          "Small changes lead to thriving lands." 🌱
        </p>
      </div>
    </div>
  );
};
