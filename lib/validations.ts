export const validateProfileField = (field: string, value: string): string | null => {
  const val = value ? value.trim() : "";
  switch (field) {
    case "firstName":
      if (!val) return "First Name is required";
      if (!/^[a-zA-Z\s]+$/.test(val)) return "First Name can only contain letters";
      break;
    case "lastName":
      if (!val) return "Last Name is required";
      if (!/^[a-zA-Z\s]+$/.test(val)) return "Last Name can only contain letters";
      break;
    case "dateOfBirth":
      if (!val) return "Date of Birth is required";
      const date = new Date(val);
      if (isNaN(date.getTime())) return "Invalid date";
      const now = new Date();
      if (date > now) return "Date cannot be in the future";
      const minDate = new Date();
      minDate.setFullYear(now.getFullYear() - 120);
      if (date < minDate) return "Invalid date of birth";
      break;
    case "gender":
      if (!val) return "Gender is required";
      break;
    case "city":
      if (!val) return "City is required";
      if (!/^[a-zA-Z\s.,'-]+$/.test(val)) return "City contains invalid characters";
      break;
  }
  return null;
};

export const validateProfileForm = (data: any) => {
  const errors: Record<string, string> = {};
  
  const fieldsToValidate = ["firstName", "lastName", "dateOfBirth", "gender", "city"];
  for (const field of fieldsToValidate) {
    const error = validateProfileField(field, data[field] || "");
    if (error) {
      errors[field] = error;
    }
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};