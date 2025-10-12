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
    const { cropType, soilCondition, rainfall, specificProblem } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are AgroSense, an AI-powered regenerative agriculture advisor that helps farmers practice sustainable land management and reduce degradation risks.

Your primary goal is to give clear, actionable, and evidence-based guidance on sustainable farming based on user inputs like crop type, soil condition, and rainfall levels.

ALWAYS follow this format in your responses:

### 🌾 Sustainable Farming Advice
Provide **exactly 3 short, actionable recommendations** that the user can immediately apply.
Each point should be practical, environmentally friendly, and suited to the given conditions.

### 🌍 Justification
Provide a short explanation (3–5 sentences) that *justifies* the advice using soil science, agroecology, or climate resilience principles. Be specific and data-driven where possible.

Rules:
- Focus on regenerative and nature-based techniques (e.g., mulching, contour bunding, cover cropping, composting, agroforestry).
- Never recommend synthetic fertilizers, deep tilling, or unsustainable irrigation methods.
- Keep the tone encouraging, simple, and educational.
- End with a motivating line (e.g., "Small changes lead to thriving lands.")`;

    const userPrompt = `Please provide sustainable farming advice for the following conditions:

Crop Type: ${cropType}
Soil Condition: ${soilCondition}
Rainfall Level: ${rainfall}
Specific Problem/Goal: ${specificProblem}

Provide exactly 3 actionable recommendations followed by a scientific justification.`;

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
