import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sprout } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema, type OnboardingData } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface OnboardingModalProps {
  open: boolean;
  onComplete: (data: OnboardingData) => void;
}

export type { OnboardingData };

export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
  const form = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      location: "",
      farmSize: "",
      mainGoal: "",
    },
  });

  const handleSubmit = (data: OnboardingData) => {
    onComplete(data);
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5 mt-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location or Climate Zone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Midwest USA, Tropical, Mediterranean"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="farmSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Farm Size/Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your farm type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="<1ha">Less than 1 hectare</SelectItem>
                      <SelectItem value="1-5ha">1-5 hectares</SelectItem>
                      <SelectItem value="5-20ha">5-20 hectares</SelectItem>
                      <SelectItem value="20-50ha">20-50 hectares</SelectItem>
                      <SelectItem value=">50ha">More than 50 hectares</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainGoal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Main Goal</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="What's your primary focus?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="soil_health">Improve Soil Health</SelectItem>
                      <SelectItem value="carbon_sequestration">Carbon Sequestration</SelectItem>
                      <SelectItem value="crop_quality">Enhance Crop Quality</SelectItem>
                      <SelectItem value="water_management">Water Conservation</SelectItem>
                      <SelectItem value="biodiversity">Increase Biodiversity</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Get Started
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
