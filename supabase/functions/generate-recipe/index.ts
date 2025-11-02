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
    const { mealType, ingredient, dietary, surpriseMe } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build the prompt based on user input
    let prompt = "";
    
    if (surpriseMe) {
      prompt = `Generate a creative and delicious ${mealType} recipe. Surprise me with something unique and interesting!`;
    } else {
      prompt = `Generate a ${mealType} recipe`;
      if (ingredient) {
        prompt += ` featuring ${ingredient}`;
      }
      if (dietary) {
        prompt += ` that is ${dietary}`;
      }
      prompt += ".";
    }

    prompt += `\n\nPlease provide:
1. A creative recipe title
2. A brief description (1-2 sentences)
3. A complete list of ingredients with measurements
4. Step-by-step cooking instructions
5. Estimated cooking time
6. Number of servings
7. Basic nutritional information (calories, protein, carbs, fat per serving)

Format the response as a JSON object with this structure:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "ingredients": ["ingredient 1", "ingredient 2"],
  "instructions": ["step 1", "step 2"],
  "cookingTime": "X minutes",
  "servings": "X servings",
  "nutritionalInfo": {
    "calories": "X kcal",
    "protein": "X g",
    "carbs": "X g",
    "fat": "X g"
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "You are an expert chef and nutritionist. Generate detailed, accurate, and delicious recipes. Always respond with valid JSON only, no additional text."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please contact support." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from AI");
    }

    // Parse the JSON response from the AI
    let recipeData;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?|\n?```/g, "").trim();
      recipeData = JSON.parse(cleanContent);
    } catch (e) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse recipe data");
    }

    // Use reliable static meal type images
    const mealTypeImages: Record<string, string> = {
      breakfast: "/images/meal-breakfast.jpg",
      lunch: "/images/meal-lunch.jpg",
      dinner: "/images/meal-dinner.jpg",
      snacks: "/images/meal-snacks.jpg",
      dessert: "/images/meal-dessert.jpg",
      healthy: "/images/meal-healthy.jpg",
    };

    const recipe = {
      id: crypto.randomUUID(),
      ...recipeData,
      mealType,
      imageUrl: mealTypeImages[mealType] || "/images/hero-bg.jpg",
    };

    return new Response(
      JSON.stringify({ recipe }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Error in generate-recipe function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to generate recipe" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
