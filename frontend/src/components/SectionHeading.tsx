
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  glowColor?: "purple" | "blue";
}

export const SectionHeading = ({
  title,
  subtitle,
  centered = false,
  className,
  glowColor = "purple"
}: SectionHeadingProps) => {
  const glowClass = glowColor === "purple" ? "neon-text" : "neon-blue-text";
  
  return (
    <div className={cn(
      "mb-12",
      centered ? "text-center" : "text-left",
      className
    )}>
      <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${glowClass}`}>{title}</h2>
      {subtitle && <p className="text-lg text-gray-300 font-medium">{subtitle}</p>}
    </div>
  );
};
