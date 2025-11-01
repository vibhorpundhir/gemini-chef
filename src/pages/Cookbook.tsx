import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Recipe } from "./Dashboard";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

const Cookbook = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = () => {
    const recipes = localStorage.getItem("savedRecipes");
    if (recipes) {
      setSavedRecipes(JSON.parse(recipes));
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    const updatedRecipes = savedRecipes.filter((r) => r.id !== recipeId);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem("savedRecipes", JSON.stringify(updatedRecipes));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-primary to-accent p-3">
                <BookOpen className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Cookbook</h1>
                <p className="text-sm text-muted-foreground">Your saved recipes</p>
              </div>
            </div>
            <Link to="/">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {savedRecipes.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-border bg-card p-12">
            <div className="text-center">
              <BookOpen className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold text-foreground">No saved recipes yet</h2>
              <p className="mb-4 text-muted-foreground">
                Start generating and saving recipes to build your cookbook
              </p>
              <Link to="/">
                <Button variant="warm">Generate Your First Recipe</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {savedRecipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDelete={() => handleDeleteRecipe(recipe.id)}
                showDeleteButton
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cookbook;
