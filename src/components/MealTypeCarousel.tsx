import { MealType } from "@/pages/Dashboard";
import { Card } from "@/components/ui/card";

interface MealTypeCarouselProps {
  selectedMealType: MealType;
  onSelectMealType: (type: MealType) => void;
}

const mealTypes = [
  { id: "breakfast" as MealType, label: "Breakfast", image: "/images/meal-breakfast.jpg" },
  { id: "lunch" as MealType, label: "Lunch", image: "/images/meal-lunch.jpg" },
  { id: "dinner" as MealType, label: "Dinner", image: "/images/meal-dinner.jpg" },
  { id: "snacks" as MealType, label: "Snacks", image: "/images/meal-snacks.jpg" },
  { id: "dessert" as MealType, label: "Dessert", image: "/images/meal-dessert.jpg" },
  { id: "healthy" as MealType, label: "Healthy/Vegan", image: "/images/meal-healthy.jpg" },
];

export const MealTypeCarousel = ({ selectedMealType, onSelectMealType }: MealTypeCarouselProps) => {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max px-4">
        {mealTypes.map((type) => {
          const isSelected = selectedMealType === type.id;
          
          return (
            <Card
              key={type.id}
              onClick={() => onSelectMealType(type.id)}
              className={`relative cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 ${
                isSelected 
                  ? "ring-4 ring-primary shadow-lg scale-105" 
                  : "hover:shadow-xl"
              }`}
              style={{ width: "200px", height: "140px" }}
            >
              <img
                src={type.image}
                alt={type.label}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                isSelected 
                  ? "bg-gradient-to-t from-primary/90 to-primary/70" 
                  : "bg-gradient-to-t from-black/70 to-black/30 hover:from-black/80 hover:to-black/40"
              }`}>
                <span className="text-white font-bold text-lg text-center px-2">
                  {type.label}
                </span>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
