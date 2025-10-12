import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Sprout } from "lucide-react";

interface AdviceFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export interface FormData {
  cropType: string;
  soilCondition: string;
  rainfall: string;
  specificProblem: string;
}

export const AdviceForm = ({ onSubmit, isLoading }: AdviceFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    cropType: "",
    soilCondition: "",
    rainfall: "",
    specificProblem: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="p-8 shadow-medium border-border/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-xl bg-primary/10">
          <Sprout className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Get Your Personalized Advice</h2>
          <p className="text-muted-foreground">Share your farming conditions for tailored recommendations</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="cropType" className="text-base font-medium">
            Crop Type
          </Label>
          <Input
            id="cropType"
            placeholder="e.g., Maize, Wheat, Tomatoes, Mixed vegetables"
            value={formData.cropType}
            onChange={(e) => handleChange("cropType", e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="soilCondition" className="text-base font-medium">
            Soil Condition
          </Label>
          <Input
            id="soilCondition"
            placeholder="e.g., Compacted, Sandy, Clay-heavy, Low organic matter"
            value={formData.soilCondition}
            onChange={(e) => handleChange("soilCondition", e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rainfall" className="text-base font-medium">
            Rainfall Level
          </Label>
          <Input
            id="rainfall"
            placeholder="e.g., High, Moderate, Low, Irregular"
            value={formData.rainfall}
            onChange={(e) => handleChange("rainfall", e.target.value)}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="specificProblem" className="text-base font-medium">
            Specific Problem or Goal
          </Label>
          <Textarea
            id="specificProblem"
            placeholder="Describe any challenges you're facing or goals you want to achieve (e.g., 'My soil is compacted and water runs off quickly' or 'I want to improve soil fertility naturally')"
            value={formData.specificProblem}
            onChange={(e) => handleChange("specificProblem", e.target.value)}
            required
            className="min-h-32 resize-none"
          />
        </div>

        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing Your Conditions...
            </>
          ) : (
            "Get Sustainable Farming Advice"
          )}
        </Button>
      </form>
    </Card>
  );
};
