import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface ProfileInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "label"> {
  label: ReactNode;
  error?: string;
  requiredField?: boolean;
  icon?: ReactNode;
  containerClassName?: string;
}

export function ProfileInput({
  label,
  error,
  requiredField,
  icon,
  containerClassName,
  id,
  className,
  ...props
}: ProfileInputProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id}>
        {label} {requiredField && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        <Input
          id={id}
          aria-invalid={!!error}
          className={cn(
            icon && "pl-10",
            error && "border-destructive focus-visible:ring-destructive",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export interface ProfileSelectProps {
  label: ReactNode;
  value: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[] | string[];
  error?: string;
  requiredField?: boolean;
  placeholder?: string;
  containerClassName?: string;
  id?: string;
}

export function ProfileSelect({
  label,
  value,
  onValueChange,
  options,
  error,
  requiredField,
  placeholder,
  containerClassName,
  id,
}: ProfileSelectProps) {
  return (
    <div className={cn("space-y-2", containerClassName)}>
      <Label htmlFor={id}>
        {label} {requiredField && <span className="text-destructive">*</span>}
      </Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger
          id={id}
          className={cn(error && "border-destructive focus:ring-destructive")}
          aria-invalid={!!error}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => {
            const val = typeof opt === "string" ? opt : opt.value;
            const display = typeof opt === "string" ? opt : opt.label;
            return (
              <SelectItem key={val} value={val}>
                {display}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
