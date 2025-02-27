export const useValidation = () => {
    const validateRequiredFields = (fields: { [key: string]: any }): boolean => {
      return Object.values(fields).every((field) => !!field);
    };
  
    const validateEmail = (email: string): boolean => {
      return /\S+@\S+\.\S+/.test(email);
    };
  
    return { validateRequiredFields, validateEmail };
  };