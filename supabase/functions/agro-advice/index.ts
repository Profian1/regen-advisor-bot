import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { cropType, soilCondition, rainfall, specificProblem, location, farmSize, mainGoal } = await req.json();
    
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
