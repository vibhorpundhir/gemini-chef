import { useState } from "react";
import { MealTypeCarousel } from "@/components/MealTypeCarousel";
import { RecipeForm } from "@/components/RecipeForm";
import { RecipeCard } from "@/components/RecipeCard";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { ChefHat, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export type MealType = "breakfast" | "lunch" | "dinner" | "snacks" | "dessert" | "healthy";

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  servings: string;
  imageUrl?: string;
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
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
          filter: "brightness(0.95)",
        }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-background/80 via-background/70 to-background/80" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="glass-card border-b sticky top-0 z-20">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3 shadow-lg">
                  <ChefHat className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">SavorAI: The Smart Kitchen Studio</h1>
                  <p className="text-sm text-muted-foreground">Discover Recipes, Powered by AI</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link to="/cookbook">
                  <Button variant="outline" className="glass-card">
                    <BookOpen className="mr-2 h-4 w-4" />
                    My Cookbook
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8 space-y-8">
          {/* Meal Type Carousel */}
          <div className="animate-fade-in">
            <h2 className="text-xl font-semibold text-foreground mb-4">Choose Your Meal Type</h2>
            <MealTypeCarousel
              selectedMealType={selectedMealType}
              onSelectMealType={setSelectedMealType}
            />
          </div>

          {/* Recipe Form */}
          <div className="animate-fade-in">
            <RecipeForm
              selectedMealType={selectedMealType}
              onRecipeGenerated={handleRecipeGenerated}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>

          {/* Recipe Display */}
          {currentRecipe && !isLoading && (
            <div className="animate-fade-in">
              <RecipeCard recipe={currentRecipe} />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="glass-card rounded-lg p-12 animate-fade-in">
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-6">
                  <div className="h-16 w-16 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                  <ChefHat className="h-8 w-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-lg font-medium text-foreground">Crafting your perfect recipe...</p>
                <p className="text-sm text-muted-foreground mt-2">Our AI chef is working its magic!</p>
              </div>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
