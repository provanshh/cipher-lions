
import { Check } from "lucide-react";
import { Button } from "./Button";

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText?: string;
}

export const PricingCard = ({
  title,
  price,
  description,
  features,
  isPopular = false,
  ctaText = "Get Started"
}: PricingCardProps) => {
  return (
    <div className={isPopular ? "pricing-card-highlight relative" : "pricing-card"}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-cipher-purple text-white text-xs font-bold py-1 px-3 rounded-full">
          MOST POPULAR
        </div>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <div className="mb-4">
        <span className="text-3xl font-bold">{price}</span>
        {price !== "Free" && <span className="text-cipher-gray ml-1">/month</span>}
      </div>
      <p className="text-cipher-gray mb-6">{description}</p>
      <div className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start">
            <Check className="h-5 w-5 text-cipher-purple mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>
      <Button 
        variant={isPopular ? "primary" : "outline"} 
        className="w-full"
      >
        {ctaText}
      </Button>
    </div>
  );
};
