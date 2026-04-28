import { useState } from "react";
import { validateProfileField } from "@/lib/validations";

export function useProfileValidation<T extends Record<string, any>>(
  initialData: T,
  clearGlobalError?: () => void
) {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const updateFormData = (field: keyof T, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const fieldKey = field as string;
    
    if (errors[fieldKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldKey];
        if (Object.keys(newErrors).length === 0) {
          clearGlobalError?.();
        }
        return newErrors;
      });
    }
  };

  const handleBlur = (field: keyof T) => {
    const fieldKey = field as string;
    const error = validateProfileField(fieldKey, formData[field] as string);
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (error) {
        newErrors[fieldKey] = error;
      } else {
        delete newErrors[fieldKey];
      }
      return newErrors;
    });
  };

  return { formData, setFormData, errors, setErrors, updateFormData, handleBlur };
}
