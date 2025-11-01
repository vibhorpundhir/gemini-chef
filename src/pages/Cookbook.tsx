import { useState, useEffect } from "react";
import { Recipe } from "./Dashboard";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Footer } from "@/components/Footer";
import { toast } from "sonner";

const Cookbook = () => {
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadSavedRecipes();
  }, []);

  const loadSavedRecipes = () => {
    const recipes = localStorage.getItem("cookbook");
    if (recipes) {
      setSavedRecipes(JSON.parse(recipes));
    }
  };

  const handleDelete = (recipeId: string) => {
    const updatedRecipes = savedRecipes.filter((r) => r.id !== recipeId);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem("cookbook", JSON.stringify(updatedRecipes));
    toast.success("Recipe removed from cookbook");
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
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
                  <BookOpen className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">My Cookbook</h1>
                  <p className="text-sm text-muted-foreground">Your saved recipes collection</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Link to="/">
                  <Button variant="outline" className="glass-card">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Studio
                  </Button>
                </Link>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container mx-auto px-4 py-8">
          {savedRecipes.length === 0 ? (
            <div className="glass-card rounded-lg p-12 text-center">
              <ChefHat className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-2xl font-semibold mb-2 text-foreground">No Saved Recipes Yet</h2>
              <p className="text-muted-foreground mb-6">
                Start generating recipes and save your favorites here!
              </p>
              <Link to="/">
                <Button variant="warm">
                  <ChefHat className="mr-2 h-4 w-4" />
                  Generate Recipes
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {savedRecipes.map((recipe) => (
                <div key={recipe.id} className="animate-fade-in">
                  <RecipeCard
                    recipe={recipe}
                    showDelete
                    onDelete={() => handleDelete(recipe.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Cookbook;
