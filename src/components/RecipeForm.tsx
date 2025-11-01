import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MealType, Recipe } from "@/pages/Dashboard";
import { Sparkles, RotateCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RecipeFormProps {
  selectedMealType: MealType;
  onRecipeGenerated: (recipe: Recipe) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const RecipeForm = ({
  selectedMealType,
  onRecipeGenerated,
  isLoading,
  setIsLoading,
}: RecipeFormProps) => {
  const [ingredient, setIngredient] = useState("");
  const [dietary, setDietary] = useState("");

  const generateRecipe = async (surpriseMe: boolean = false) => {
    if (!surpriseMe && !ingredient.trim()) {
      toast.error("Please enter an ingredient or dietary preference");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("generate-recipe", {
        body: {
          mealType: selectedMealType,
          ingredient: surpriseMe ? "" : ingredient,
          dietary: dietary,
          surpriseMe,
        },
      });

      if (error) throw error;

      if (data?.recipe) {
        onRecipeGenerated(data.recipe);
        toast.success("Recipe generated successfully!");
      }
    } catch (error: any) {
      console.error("Error generating recipe:", error);
      toast.error(error.message || "Failed to generate recipe. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setIngredient("");
    setDietary("");
  };

  return (
    <div className="glass-card rounded-lg p-6 shadow-lg">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Generate Recipe</h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="ingredient" className="text-foreground">Main Ingredient</Label>
          <Input
            id="ingredient"
            placeholder="e.g., chicken, tofu, pasta"
            value={ingredient}
            onChange={(e) => setIngredient(e.target.value)}
            disabled={isLoading}
            className="glass-card border-border/50"
          />
        </div>

        <div>
          <Label htmlFor="dietary" className="text-foreground">Dietary Preference (Optional)</Label>
          <Input
            id="dietary"
            placeholder="e.g., vegan, low-carb, gluten-free"
            value={dietary}
            onChange={(e) => setDietary(e.target.value)}
            disabled={isLoading}
            className="glass-card border-border/50"
          />
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <Button
            variant="warm"
            onClick={() => generateRecipe(false)}
            disabled={isLoading}
            className="flex-1"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Recipe
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => generateRecipe(true)}
            disabled={isLoading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Surprise Me
          </Button>

          <Button
            variant="outline"
            onClick={handleClear}
            disabled={isLoading}
            className="glass-card"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};
