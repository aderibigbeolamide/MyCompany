import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ErrorMessageProps {
  title: string;
  description?: string;
  className?: string;
}

export default function ErrorMessage({ title, description, className }: ErrorMessageProps) {
  return (
    <div className={cn("bg-red-50 border border-red-200 rounded-lg p-4", className)}>
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
        <div>
          <h3 className="text-red-800 font-medium">{title}</h3>
          {description && (
            <p className="text-red-700 text-sm mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}