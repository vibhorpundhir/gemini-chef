import { useState } from "react";
import { MealTypeNav } from "@/components/MealTypeNav";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeCard } from "@/components/RecipeCard";
import { ChefHat } from "lucide-react";

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks" | "dessert" | "healthy";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  servings: string;
  nutritionalInfo?: {
    calories?: string;
    protein?: string;
    carbs?: string;
    fat?: string;
  };
  mealType: MealType;
}

const Dashboard = () => {
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [currentRecipe, setCurrentRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRecipeGenerated = (recipe: Recipe) => {
    setCurrentRecipe(recipe);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3">
              <ChefHat className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Smart Recipe Studio</h1>
              <p className="text-sm text-muted-foreground">Discover Recipes, Powered by AI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Sidebar Navigation */}
          <aside>
            <MealTypeNav
              selectedMealType={selectedMealType}
              onSelectMealType={setSelectedMealType}
            />
          </aside>

          {/* Main Content Area */}
          <main className="space-y-8">
            {/* Recipe Form */}
            <RecipeForm
              selectedMealType={selectedMealType}
              onRecipeGenerated={handleRecipeGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />

            {/* Recipe Display */}
            {currentRecipe && !isLoading && (
              <RecipeCard recipe={currentRecipe} />
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center rounded-lg border border-border bg-card p-12">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  <p className="text-sm text-muted-foreground">Crafting your perfect recipe...</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
