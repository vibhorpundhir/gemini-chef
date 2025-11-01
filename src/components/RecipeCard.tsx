import { Recipe } from "@/pages/Dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, BookmarkPlus, Clock, Users, Trash2 } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

interface RecipeCardProps {
  recipe: Recipe;
  showDelete?: boolean;
  onDelete?: () => void;
}

export const RecipeCard = ({ recipe, showDelete = false, onDelete }: RecipeCardProps) => {
  const downloadPDF = () => {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;

    doc.setFontSize(20);
    doc.text(recipe.title, margin, yPos);
    yPos += 10;

    doc.setFontSize(12);
    doc.text(recipe.description, margin, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.text("Ingredients:", margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    recipe.ingredients.forEach((ingredient) => {
      doc.text(`• ${ingredient}`, margin + 5, yPos);
      yPos += 6;
    });

    yPos += 5;
    doc.setFontSize(14);
    doc.text("Instructions:", margin, yPos);
    yPos += 8;

    doc.setFontSize(11);
    recipe.instructions.forEach((instruction, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${instruction}`, 170);
      lines.forEach((line: string) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = margin;
        }
        doc.text(line, margin + 5, yPos);
        yPos += 6;
      });
    });

    doc.save(`${recipe.title}.pdf`);
    toast.success("Recipe downloaded as PDF!");
  };

  const saveToCookbook = () => {
    const savedRecipes = JSON.parse(localStorage.getItem("cookbook") || "[]");
    const exists = savedRecipes.some((r: Recipe) => r.id === recipe.id);

    if (exists) {
      toast.info("Recipe already in your cookbook!");
      return;
    }

    savedRecipes.push(recipe);
    localStorage.setItem("cookbook", JSON.stringify(savedRecipes));
    toast.success("Recipe saved to your cookbook!");
  };

  return (
    <Card className="glass-card shadow-xl overflow-hidden">
      {recipe.imageUrl && (
        <div className="relative h-64 w-full overflow-hidden">
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h2 className="text-3xl font-bold text-white mb-2">{recipe.title}</h2>
            <div className="flex gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <CardHeader>
        {!recipe.imageUrl && (
          <>
            <CardTitle className="text-2xl">{recipe.title}</CardTitle>
            <CardDescription className="text-base">{recipe.description}</CardDescription>
            <div className="flex gap-4 text-sm text-muted-foreground pt-2">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cookingTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </>
        )}
        {recipe.imageUrl && (
          <CardDescription className="text-base">{recipe.description}</CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start gap-2 text-foreground/90">
                <span className="text-primary mt-1">•</span>
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 text-foreground">Instructions</h3>
          <ol className="space-y-3">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex gap-3 text-foreground/90">
                <span className="font-semibold text-primary min-w-[24px]">{index + 1}.</span>
                <span>{instruction}</span>
              </li>
            ))}
          </ol>
        </div>

        {recipe.nutritionalInfo && (
          <div className="glass-card rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3 text-foreground">Nutritional Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recipe.nutritionalInfo.calories && (
                <div>
                  <p className="text-sm text-muted-foreground">Calories</p>
                  <p className="font-semibold text-foreground">{recipe.nutritionalInfo.calories}</p>
                </div>
              )}
              {recipe.nutritionalInfo.protein && (
                <div>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="font-semibold text-foreground">{recipe.nutritionalInfo.protein}</p>
                </div>
              )}
              {recipe.nutritionalInfo.carbs && (
                <div>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="font-semibold text-foreground">{recipe.nutritionalInfo.carbs}</p>
                </div>
              )}
              {recipe.nutritionalInfo.fat && (
                <div>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="font-semibold text-foreground">{recipe.nutritionalInfo.fat}</p>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4">
          <Button onClick={downloadPDF} variant="default" className="flex-1">
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          {!showDelete && (
            <Button onClick={saveToCookbook} variant="secondary" className="flex-1">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save to Cookbook
            </Button>
          )}
          {showDelete && onDelete && (
            <Button onClick={onDelete} variant="destructive" className="flex-1">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
