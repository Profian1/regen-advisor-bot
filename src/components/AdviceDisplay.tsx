import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Clock, 
  Package, 
  DollarSign, 
  AlertCircle,
  Target,
  TrendingUp,
  FileText,
  Calendar,
  Download
} from "lucide-react";

interface AdviceDisplayProps {
  advice: string;
  onFollowUpClick?: (followUpQuestion: string) => void;
}

export const AdviceDisplay = ({ advice, onFollowUpClick }: AdviceDisplayProps) => {
  const sections = advice.split("###").filter(Boolean);
  
  const assessSection = sections.find(s => s.includes("ASSESS"));
  const planSection = sections.find(s => s.includes("PLAN"));
  const operateSection = sections.find(s => s.includes("OPERATE"));
  const confidenceSection = sections.find(s => s.includes("CONFIDENCE"));
  const followUpSection = sections.find(s => s.includes("FOLLOW-UP"));

  const parseAssess = (text: string) => {
    return text
      .split("\n")
      .filter(line => line.trim().startsWith("-") || line.trim().startsWith("•"))
      .map(line => line.replace(/^[-•]\s*/, "").trim())
      .filter(Boolean);
  };

  const parsePlanSteps = (text: string) => {
    const steps: any[] = [];
    const lines = text.split("\n").filter(line => line.trim());
    
    let currentStep: any = null;
    
    for (const line of lines) {
      const trimmed = line.trim();
      
      if (/^\d+\./.test(trimmed)) {
        if (currentStep) steps.push(currentStep);
        const action = trimmed.replace(/^\d+\.\s*\*?\*?/, "").replace(/\*?\*?$/, "").trim();
        currentStep = { action, time: "", materials: "", cost: "" };
      } else if (currentStep) {
        if (trimmed.toLowerCase().includes("time:")) {
          currentStep.time = trimmed.split(":")[1]?.trim() || "";
        } else if (trimmed.toLowerCase().includes("materials:")) {
          currentStep.materials = trimmed.split(":")[1]?.trim() || "";
        } else if (trimmed.toLowerCase().includes("cost:")) {
          currentStep.cost = trimmed.split(":")[1]?.trim() || "";
        }
      }
    }
    
    if (currentStep) steps.push(currentStep);
    return steps;
  };

  const parseConfidence = (text: string) => {
    const match = text.match(/Confidence:\s*(Low|Medium|High)/i);
    const level = match ? match[1] : "Medium";
    const basis = text.split("–")[1]?.trim() || text.split("-")[1]?.trim() || "";
    return { level, basis };
  };

  const parseFollowUps = (text: string) => {
    return text
      .split("\n")
      .filter(line => line.trim().startsWith("-") || line.trim().startsWith("•"))
      .map(line => line.replace(/^[-•]\s*[""]?/, "").replace(/[""]$/, "").trim())
      .filter(Boolean);
  };

  const assessItems = assessSection ? parseAssess(assessSection) : [];
  const planSteps = planSection ? parsePlanSteps(planSection) : [];
  const operateText = operateSection?.split("\n").filter(l => l.trim() && !l.includes("###")).join(" ").trim() || "";
  const confidence = confidenceSection ? parseConfidence(confidenceSection) : { level: "Medium", basis: "" };
  const followUps = followUpSection ? parseFollowUps(followUpSection) : [];

  const getConfidenceColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "high": return "bg-primary/10 text-primary border-primary/20";
      case "medium": return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "low": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
      {/* Header with Confidence */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          Your Regenerative Action Plan
        </h2>
        <Badge className={`${getConfidenceColor(confidence.level)} border px-3 py-1`}>
          Confidence: {confidence.level}
        </Badge>
      </div>

      {confidence.basis && (
        <Card className="p-4 bg-muted/50 border-muted">
          <p className="text-sm text-muted-foreground">
            <strong>Basis:</strong> {confidence.basis}
          </p>
        </Card>
      )}

      {/* Assess Section */}
      {assessItems.length > 0 && (
        <Card className="p-6 border-border/50 shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <AlertCircle className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-foreground">🔍 Assessment</h3>
          </div>
          
          <ul className="space-y-2">
            {assessItems.map((item, index) => (
              <li key={index} className="flex gap-3 text-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Plan Section - Step Cards */}
      {planSteps.length > 0 && (
        <Card className="p-6 border-primary/20 shadow-[var(--shadow-medium)] bg-gradient-to-br from-card to-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary">
              <FileText className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-foreground">📋 Step-by-Step Plan</h3>
              <p className="text-sm text-muted-foreground">{planSteps.length} actionable steps</p>
            </div>
          </div>

          <ol className="space-y-4">
            {planSteps.map((step, index) => (
              <li key={index} className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                <div className="p-4 rounded-xl bg-background border border-border/50 hover:border-primary/30 transition-colors">
                  <h4 className="font-semibold text-foreground mb-3">{step.action}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    {step.time && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{step.time}</span>
                      </div>
                    )}
                    
                    {step.materials && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="w-4 h-4 text-primary" />
                        <span className="line-clamp-1">{step.materials}</span>
                      </div>
                    )}
                    
                    {step.cost && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span>{step.cost}</span>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-border/50">
            <Button variant="default" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Plan (PDF)
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
          </div>
        </Card>
      )}

      {/* Operate & Monitor */}
      {operateText && (
        <Card className="p-6 border-secondary/20 bg-gradient-to-br from-card to-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-secondary">
              <TrendingUp className="w-5 h-5 text-secondary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground">🚀 Operate & Monitor</h3>
          </div>
          
          <p className="text-foreground leading-relaxed">{operateText}</p>
        </Card>
      )}

      {/* Follow-up Actions */}
      {followUps.length > 0 && (
        <Card className="p-6 border-accent/20 bg-accent/5">
          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-accent" />
            Next Steps & Resources
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {followUps.map((item, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className="justify-start h-auto py-3 px-4 text-left hover:bg-accent hover:text-accent-foreground transition-colors"
                onClick={() => onFollowUpClick?.(item)}
              >
                {item}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Footer Quote */}
      <div className="text-center p-6 rounded-xl bg-muted/30 border border-border/50">
        <p className="text-lg font-medium text-foreground italic">
          "Small changes lead to thriving lands." 🌱
        </p>
      </div>
    </div>
  );
};
