
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "purple" | "blue" | "default";
}

export const FeatureCard = ({
  icon: Icon,
  title,
  description,
  color = "default"
}: FeatureCardProps) => {
  const iconColors = {
    purple: "text-cipher-purple bg-cipher-purple/10",
    blue: "text-cipher-blue bg-cipher-blue/10",
    default: "text-gray-400 bg-gray-800/20"
  };

  return (
    <div className="feature-card bg-[#171723] border border-[#2A2A3C] p-6 rounded-xl hover:shadow-[0_0_15px_rgba(139,92,246,0.2)] transition-shadow">
      <div className={`p-3 rounded-lg mb-4 w-fit ${iconColors[color]}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </div>
  );
};
