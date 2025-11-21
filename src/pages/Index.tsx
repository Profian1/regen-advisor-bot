import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { AdviceForm, FormData } from "@/components/AdviceForm";
import { AdviceDisplay } from "@/components/AdviceDisplay";
import { OnboardingModal } from "@/components/OnboardingModal";
import { toast } from "sonner";

interface OnboardingData {
  location: string;
  farmSize: string;
  mainGoal: string;
}

const Index = () => {
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    const hasOnboarded = localStorage.getItem("agrosense_onboarded");
    if (!hasOnboarded) {
      setShowOnboarding(true);
    } else {
      const saved = localStorage.getItem("agrosense_profile");
      if (saved) {
        setOnboardingData(JSON.parse(saved));
      }
    }
  }, []);

  const handleOnboardingComplete = (data: OnboardingData) => {
    setOnboardingData(data);
    localStorage.setItem("agrosense_onboarded", "true");
    localStorage.setItem("agrosense_profile", JSON.stringify(data));
    setShowOnboarding(false);
    toast.success("Profile saved! Let's get started.");
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setAdvice("");
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agro-advice`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            ...formData,
            ...onboardingData,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get advice");
      }

      const data = await response.json();
      setAdvice(data.advice);
      toast.success("Advice generated successfully!");
    } catch (error) {
      console.error("Error getting advice:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to get advice. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      
      <div className="min-h-screen bg-background">
      <Hero />
      
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        <AdviceForm onSubmit={handleSubmit} isLoading={isLoading} />
        
        {advice && (
          <div className="mt-12">
            <AdviceDisplay advice={advice} />
          </div>
        )}
      </main>

      <footer className="border-t border-border/50 mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="flex items-center justify-center gap-2 text-sm">
            <span>Built with 🌱 for regenerative agriculture</span>
          </p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Index;
