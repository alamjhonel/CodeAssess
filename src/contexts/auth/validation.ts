
// Function to validate TUP ID format: TUPM-YY-XXXX
export const validateTupId = (id: string): boolean => {
  // If the input is an email, don't validate as TUP ID
  if (id.includes('@')) return true;
  
  const pattern = /^TUPM-\d{2}-\d{4}$/;
  return pattern.test(id);
};

// Function to validate TUP email format: email must end with @tup.edu.ph
export const validateTupEmail = (email: string): boolean => {
  // If it's not an email format, don't validate as TUP email
  if (!email.includes('@')) return false;
  
  // Check if the email ends with @tup.edu.ph
  return email.endsWith('@tup.edu.ph');
};

// Function to check if a string is an email
export const isEmail = (value: string): boolean => {
  return value.includes('@');
};
