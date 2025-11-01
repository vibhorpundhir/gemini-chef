import { Coffee, Soup, UtensilsCrossed, Cookie, Cake, Leaf, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MealType } from "@/pages/Dashboard";
import { Link } from "react-router-dom";

interface MealTypeNavProps {
  selectedMealType: MealType;
  onSelectMealType: (type: MealType) => void;
}

const mealTypes = [
  { id: "breakfast" as MealType, label: "Breakfast", icon: Coffee },
  { id: "lunch" as MealType, label: "Lunch", icon: Soup },
  { id: "dinner" as MealType, label: "Dinner", icon: UtensilsCrossed },
  { id: "snacks" as MealType, label: "Snacks", icon: Cookie },
  { id: "dessert" as MealType, label: "Dessert", icon: Cake },
  { id: "healthy" as MealType, label: "Healthy/Vegan", icon: Leaf },
];

export const MealTypeNav = ({ selectedMealType, onSelectMealType }: MealTypeNavProps) => {
  return (
    <nav className="sticky top-4 space-y-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Meal Types
      </h2>
      <div className="space-y-2">
        {mealTypes.map((type) => {
          const Icon = type.icon;
          const isSelected = selectedMealType === type.id;
          
          return (
            <button
              key={type.id}
              onClick={() => onSelectMealType(type.id)}
              className={`flex w-full items-center gap-3 rounded-md px-4 py-3 text-left transition-all duration-300 ${
                isSelected
                  ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md"
                  : "hover:bg-muted"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{type.label}</span>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border pt-4">
        <Link to="/cookbook">
          <Button variant="outline" className="w-full">
            <BookOpen className="mr-2 h-4 w-4" />
            My Cookbook
          </Button>
        </Link>
      </div>
    </nav>
  );
};
