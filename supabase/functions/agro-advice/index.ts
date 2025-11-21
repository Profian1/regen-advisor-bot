import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Server-side validation and sanitization
const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, ' ');
};

const validateInput = (data: any) => {
  const errors: string[] = [];

  // Validate cropType
  if (!data.cropType || typeof data.cropType !== 'string') {
    errors.push('cropType is required');
  } else if (data.cropType.trim().length < 2 || data.cropType.trim().length > 200) {
    errors.push('cropType must be between 2 and 200 characters');
  }

  // Validate soilCondition
  if (!data.soilCondition || typeof data.soilCondition !== 'string') {
    errors.push('soilCondition is required');
  } else if (data.soilCondition.trim().length < 2 || data.soilCondition.trim().length > 200) {
    errors.push('soilCondition must be between 2 and 200 characters');
  }

  // Validate rainfall
  if (!data.rainfall || typeof data.rainfall !== 'string') {
    errors.push('rainfall is required');
  } else if (data.rainfall.trim().length < 2 || data.rainfall.trim().length > 200) {
    errors.push('rainfall must be between 2 and 200 characters');
  }

  // Validate specificProblem
  if (!data.specificProblem || typeof data.specificProblem !== 'string') {
    errors.push('specificProblem is required');
  } else if (data.specificProblem.trim().length < 10 || data.specificProblem.trim().length > 2000) {
    errors.push('specificProblem must be between 10 and 2000 characters');
  }

  // Validate optional fields
  if (data.location && (typeof data.location !== 'string' || data.location.trim().length > 150)) {
    errors.push('location must be less than 150 characters');
  }

  if (data.farmSize && !['<1ha', '1-5ha', '5-20ha', '20-50ha', '>50ha'].includes(data.farmSize)) {
    errors.push('Invalid farmSize value');
  }

  if (data.mainGoal && !['soil_health', 'carbon_sequestration', 'crop_quality', 'water_management', 'biodiversity'].includes(data.mainGoal)) {
    errors.push('Invalid mainGoal value');
  }

  return errors;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rawData = await req.json();
    
    // Validate input
    const validationErrors = validateInput(rawData);
    if (validationErrors.length > 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid input', details: validationErrors }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Sanitize inputs
    const { 
      cropType, 
      soilCondition, 
      rainfall, 
      specificProblem,
      location,
      farmSize,
      mainGoal
    } = {
      cropType: sanitizeString(rawData.cropType),
      soilCondition: sanitizeString(rawData.soilCondition),
      rainfall: sanitizeString(rawData.rainfall),
      specificProblem: sanitizeString(rawData.specificProblem),
      location: rawData.location ? sanitizeString(rawData.location) : undefined,
      farmSize: rawData.farmSize,
      mainGoal: rawData.mainGoal,
    };
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are AgroSense, an AI-powered regenerative agriculture advisor. Provide structured, step-by-step agricultural advice using short, clear sentences.

ALWAYS follow this 3-phase format:

### 🔍 ASSESS
Provide 2-3 brief diagnostic questions or observations based on the user's inputs. Examples:
- "Have you tested soil pH in the last year?"
- "Is water pooling in any areas after rain?"

### 📋 PLAN (Step-by-Step)
Provide 3-6 numbered actionable steps. Each step MUST include:
- **Action**: Clear, specific instruction
- **Time**: Estimated time to complete (e.g., "1-2 weeks", "3 months")
- **Materials**: Required tools/resources
- **Cost**: Optional cost range (e.g., "$50-200" or "Low cost")

Example format:
1. **Test soil samples**
   - Time: 1-2 days
   - Materials: Soil test kit or lab service
   - Cost: $20-50

### 🚀 OPERATE & MONITOR
Explain:
- How to implement (2-3 sentences)
- What to measure/track
- When to re-evaluate (e.g., "Check progress after 3 months")

### 💡 CONFIDENCE & BASIS
State: "Confidence: [Low/Medium/High] – Based on [brief reasoning]"

### 🔄 FOLLOW-UP OPTIONS
Suggest 3-4 follow-up actions as buttons:
- "Show week-by-week schedule"
- "Give detailed material list"
- "Provide cost breakdown"
- "Show tracking/measurement guide"

RULES:
- Focus on regenerative techniques (cover cropping, composting, no-till, agroforestry)
- Never recommend synthetic fertilizers or deep tilling
- Use short, clear sentences
- Be specific and data-driven`;

    const userPrompt = `Provide structured regenerative agriculture advice for:

FARM CONTEXT:
- Location: ${location || 'Not specified'}
- Farm Size/Type: ${farmSize || 'Not specified'}
- Main Goal: ${mainGoal || 'General improvement'}

CURRENT CONDITIONS:
- Crop Type: ${cropType}
- Soil Condition: ${soilCondition}
- Rainfall Level: ${rainfall}
- Specific Problem/Goal: ${specificProblem}

Follow the 3-phase format (ASSESS, PLAN, OPERATE & MONITOR) with confidence level and follow-up options.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limits exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your Lovable AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("Failed to get advice from AI");
    }

    const data = await response.json();
    const advice = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ advice }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in agro-advice function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
