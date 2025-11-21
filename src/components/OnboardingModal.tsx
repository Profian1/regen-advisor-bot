import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout } from "lucide-react";

interface OnboardingData {
  location: string;
  farmSize: string;
  mainGoal: string;
}

interface OnboardingModalProps {
  open: boolean;
  onComplete: (data: OnboardingData) => void;
}

export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const [formData, setFormData] = useState<OnboardingData>({
    location: "",
    farmSize: "",
    mainGoal: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sprout className="w-5 h-5 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Welcome to AgroSense</DialogTitle>
          </div>
          <p className="text-muted-foreground">
            Let's personalize your regenerative agriculture experience
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location or Climate Zone</Label>
            <Input
              id="location"
              placeholder="e.g., Midwest USA, Tropical, Mediterranean"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="farmSize">Farm Size/Type</Label>
            <Select
              value={formData.farmSize}
              onValueChange={(value) => setFormData({ ...formData, farmSize: value })}
              required
            >
              <SelectTrigger id="farmSize">
                <SelectValue placeholder="Select your farm type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="smallholder">Smallholder (&lt; 5 acres)</SelectItem>
                <SelectItem value="medium">Medium Farm (5-50 acres)</SelectItem>
                <SelectItem value="large">Large Farm (&gt; 50 acres)</SelectItem>
                <SelectItem value="pasture">Pasture/Livestock</SelectItem>
                <SelectItem value="orchard">Orchard/Vineyard</SelectItem>
                <SelectItem value="mixed">Mixed/Diversified</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainGoal">Main Goal</Label>
            <Select
              value={formData.mainGoal}
              onValueChange={(value) => setFormData({ ...formData, mainGoal: value })}
              required
            >
              <SelectTrigger id="mainGoal">
                <SelectValue placeholder="What's your primary focus?" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="soil-health">Improve Soil Health</SelectItem>
                <SelectItem value="carbon">Carbon Sequestration</SelectItem>
                <SelectItem value="crop-quality">Enhance Crop Quality</SelectItem>
                <SelectItem value="water">Water Conservation</SelectItem>
                <SelectItem value="biodiversity">Increase Biodiversity</SelectItem>
                <SelectItem value="resilience">Climate Resilience</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full">
            Get Started
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
