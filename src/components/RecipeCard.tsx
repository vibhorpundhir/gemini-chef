import { Recipe } from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { Download, BookmarkPlus, Clock, Users, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface RecipeCardProps {
  recipe: Recipe;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

export const RecipeCard = ({ recipe, onDelete, showDeleteButton }: RecipeCardProps) => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Title
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(recipe.title, margin, yPosition);
    yPosition += 15;

    // Description
    if (recipe.description) {
      doc.setFontSize(12);
      doc.setFont("helvetica", "normal");
      const splitDescription = doc.splitTextToSize(recipe.description, pageWidth - 2 * margin);
      doc.text(splitDescription, margin, yPosition);
      yPosition += splitDescription.length * 7 + 10;
    }

    // Details
    doc.setFontSize(11);
    doc.text(`Cooking Time: ${recipe.cookingTime}`, margin, yPosition);
    yPosition += 7;
    doc.text(`Servings: ${recipe.servings}`, margin, yPosition);
    yPosition += 15;

    // Ingredients
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Ingredients:", margin, yPosition);
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    recipe.ingredients.forEach((ingredient) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(`• ${ingredient}`, margin + 5, yPosition);
      yPosition += 7;
    });
    yPosition += 10;

    // Instructions
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Instructions:", margin, yPosition);
    yPosition += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    recipe.instructions.forEach((instruction, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
      const splitText = doc.splitTextToSize(`${index + 1}. ${instruction}`, pageWidth - 2 * margin - 5);
      doc.text(splitText, margin + 5, yPosition);
      yPosition += splitText.length * 7 + 5;
    });

    // Nutritional Info
    if (recipe.nutritionalInfo) {
      yPosition += 10;
      if (yPosition > 250) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Nutritional Information:", margin, yPosition);
      yPosition += 10;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      Object.entries(recipe.nutritionalInfo).forEach(([key, value]) => {
        if (value) {
          doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, margin + 5, yPosition);
          yPosition += 7;
        }
      });
    }

    doc.save(`${recipe.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
    toast.success("Recipe downloaded as PDF!");
  };

  const handleSaveToCookbook = () => {
    const savedRecipes = localStorage.getItem("savedRecipes");
    const recipes: Recipe[] = savedRecipes ? JSON.parse(savedRecipes) : [];
    
    // Check if recipe already exists
    if (recipes.some((r) => r.id === recipe.id)) {
      toast.info("Recipe already in your cookbook!");
      return;
    }

    recipes.push(recipe);
    localStorage.setItem("savedRecipes", JSON.stringify(recipes));
    toast.success("Recipe saved to cookbook!");
  };

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-md transition-shadow hover:shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-accent p-6 text-primary-foreground">
        <h3 className="mb-2 text-2xl font-bold">{recipe.title}</h3>
        {recipe.description && (
          <p className="text-sm opacity-90">{recipe.description}</p>
        )}
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{recipe.servings}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Ingredients */}
        <div className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-foreground">Ingredients</h4>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary"></span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <h4 className="mb-3 text-lg font-semibold text-foreground">Instructions</h4>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-sm text-muted-foreground">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                  {index + 1}
                </span>
                <span className="pt-0.5">{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Nutritional Info */}
        {recipe.nutritionalInfo && Object.keys(recipe.nutritionalInfo).length > 0 && (
          <div className="mb-6 rounded-lg bg-muted p-4">
            <h4 className="mb-3 text-sm font-semibold text-foreground">Nutritional Information</h4>
            <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              {Object.entries(recipe.nutritionalInfo).map(([key, value]) => {
                if (!value) return null;
                return (
                  <div key={key}>
                    <div className="font-medium text-foreground">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                    <div className="text-muted-foreground">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleDownloadPDF} variant="default" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {!showDeleteButton && (
            <Button onClick={handleSaveToCookbook} variant="secondary" className="flex-1">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save to Cookbook
            </Button>
          )}
          {showDeleteButton && onDelete && (
            <Button onClick={onDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
