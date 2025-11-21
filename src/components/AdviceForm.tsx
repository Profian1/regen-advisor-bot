import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Sprout } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adviceFormSchema, type AdviceFormData } from "@/lib/validations";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface AdviceFormProps {
  onSubmit: (data: AdviceFormData) => Promise<void>;
  isLoading: boolean;
}

export type { AdviceFormData as FormData };

export const AdviceForm = ({ onSubmit, isLoading }: AdviceFormProps) => {
  const form = useForm<AdviceFormData>({
    resolver: zodResolver(adviceFormSchema),
    defaultValues: {
      cropType: "",
      soilCondition: "",
      rainfall: "",
      specificProblem: "",
    },
  });

  const handleSubmit = async (data: AdviceFormData) => {
    await onSubmit(data);
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="cropType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Crop Type</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Maize, Wheat, Tomatoes, Mixed vegetables"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="soilCondition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Soil Condition</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Compacted, Sandy, Clay-heavy, Low organic matter"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rainfall"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">Rainfall Level</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., High, Moderate, Low, Irregular"
                    className="h-12"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specificProblem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base font-medium">
                  Specific Problem or Goal
                </FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe any challenges you're facing or goals you want to achieve (e.g., 'My soil is compacted and water runs off quickly' or 'I want to improve soil fertility naturally')"
                    className="min-h-32 resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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
      </Form>
    </Card>
  );
};
