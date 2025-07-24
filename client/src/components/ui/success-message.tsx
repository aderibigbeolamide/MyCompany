import { CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessMessageProps {
  title: string;
  description?: string;
  className?: string;
}

export default function SuccessMessage({ title, description, className }: SuccessMessageProps) {
  return (
    <div className={cn("bg-green-50 border border-green-200 rounded-lg p-4", className)}>
      <div className="flex items-start">
        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-green-800 font-medium">{title}</h3>
          {description && (
            <p className="text-green-700 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}