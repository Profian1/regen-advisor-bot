import { z } from "zod";

// Sanitization helper
export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

// Onboarding validation schema
export const onboardingSchema = z.object({
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(150, "Location must be less than 150 characters")
    .transform(sanitizeString),
  farmSize: z
    .string()
    .trim()
    .min(1, "Please select a farm size")
    .refine((val) => 
      ["<1ha", "1-5ha", "5-20ha", "20-50ha", ">50ha"].includes(val),
      "Invalid farm size selected"
    ),
  mainGoal: z
    .string()
    .trim()
    .min(1, "Please select a main goal")
    .refine((val) => 
      ["soil_health", "carbon_sequestration", "crop_quality", "water_management", "biodiversity"].includes(val),
      "Invalid goal selected"
    ),
});

// Advice form validation schema
export const adviceFormSchema = z.object({
  cropType: z
    .string()
    .trim()
    .min(2, "Crop type must be at least 2 characters")
    .max(200, "Crop type must be less than 200 characters")
    .transform(sanitizeString),
  soilCondition: z
    .string()
    .trim()
    .min(2, "Soil condition must be at least 2 characters")
    .max(200, "Soil condition must be less than 200 characters")
    .transform(sanitizeString),
  rainfall: z
    .string()
    .trim()
    .min(2, "Rainfall level must be at least 2 characters")
    .max(200, "Rainfall level must be less than 200 characters")
    .transform(sanitizeString),
  specificProblem: z
    .string()
    .trim()
    .min(10, "Please provide at least 10 characters describing your situation")
    .max(2000, "Description must be less than 2000 characters")
    .transform(sanitizeString),
});

export type OnboardingData = z.infer<typeof onboardingSchema>;
export type AdviceFormData = z.infer<typeof adviceFormSchema>;
