import React, { useState, useCallback } from "react";
import { UtensilsCrossed, Minus, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";

const ManualFeedPage: React.FC = () => {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState<number>(30);
  const minQuantity = 10;
  const maxQuantity = 150;
  const step = 5;

  // --- Handlers (keep from previous version) ---
  const handleManualDispense = useCallback(() => {
    /* ... */ if (quantity < minQuantity || quantity > maxQuantity) {
      toast({
        title: "Invalid Quantity",
        description: `Choose ${minQuantity}g - ${maxQuantity}g.`,
        variant: "destructive",
      });
      return;
    }
    console.log(`Dispensing ${quantity}g...`);
    toast({
      title: "Dispensing Food",
      description: `${quantity}g dispensed successfully.`,
    });
  }, [quantity, toast]);
  const handleSliderChange = (value: number[]) => setQuantity(value[0]);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    /* ... */ const v = parseInt(e.target.value, 10);
    if (!isNaN(v)) setQuantity(Math.max(minQuantity, Math.min(maxQuantity, v)));
    else if (e.target.value === "") setQuantity(minQuantity);
  };
  const adjustQuantity = (amount: number) =>
    setQuantity((prev) =>
      Math.max(minQuantity, Math.min(maxQuantity, prev + amount))
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Manual Feed
      </h1>

      <Card className="max-w-md mx-auto">
        <CardHeader className="items-center text-center">
          <UtensilsCrossed className="h-12 w-12 text-primary mb-2" />
          <CardTitle>Dispense Food Now</CardTitle>
          <CardDescription>
            Select an amount and dispense immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6 pt-4">
          {/* Quantity Input/Adjust */}
          <div className="text-center w-full max-w-xs">
            {" "}
            {/* Constrain width */}
            <Label
              htmlFor="quantity-input"
              className="text-sm text-muted-foreground mb-1 block"
            >
              Amount (grams)
            </Label>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => adjustQuantity(-step)}
                disabled={quantity <= minQuantity}
              >
                <Minus className="h-4 w-4" />
                <span className="sr-only">Decrease quantity</span>
              </Button>
              <Input
                id="quantity-input"
                type="number"
                value={quantity}
                onChange={handleInputChange}
                min={minQuantity}
                max={maxQuantity}
                step={step}
                className="w-24 text-center text-xl font-semibold h-10 px-1" // Adjusted width/padding
              />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9"
                onClick={() => adjustQuantity(step)}
                disabled={quantity >= maxQuantity}
              >
                <Plus className="h-4 w-4" />
                <span className="sr-only">Increase quantity</span>
              </Button>
            </div>
          </div>

          {/* Slider */}
          <div className="w-full max-w-xs px-2">
            {" "}
            {/* Constrain width and add padding */}
            <Slider
              value={[quantity]}
              onValueChange={handleSliderChange}
              min={minQuantity}
              max={maxQuantity}
              step={step}
              className="w-full"
              aria-label="Food quantity slider"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>{minQuantity}g</span>
              <span>{maxQuantity}g</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <Button
            onClick={handleManualDispense}
            size="lg"
            className="w-full sm:w-auto"
            disabled={quantity < minQuantity || quantity > maxQuantity}
          >
            Dispense {quantity}g Now
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ManualFeedPage;
