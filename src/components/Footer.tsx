import { ChefHat } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="glass-card mt-auto border-t">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <ChefHat className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">SavorAI: The Smart Kitchen Studio</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SavorAI: The Smart Kitchen Studio. Powered by AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
