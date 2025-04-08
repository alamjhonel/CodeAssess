
import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordStrengthProps {
  passwordStrength: {
    hasLowercase: boolean;
    hasUppercase: boolean;
    hasNumber: boolean;
    hasSpecial: boolean;
    hasLength: boolean;
  };
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthProps> = ({ passwordStrength }) => {
  return (
    <div className="grid grid-cols-2 gap-2 mt-2">
      <div className="flex items-center gap-2 text-xs">
        {passwordStrength.hasLowercase ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <XCircle className="h-3 w-3 text-muted-foreground" />
        )}
        <span className={passwordStrength.hasLowercase ? "text-foreground" : "text-muted-foreground"}>
          Lowercase letter
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        {passwordStrength.hasUppercase ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <XCircle className="h-3 w-3 text-muted-foreground" />
        )}
        <span className={passwordStrength.hasUppercase ? "text-foreground" : "text-muted-foreground"}>
          Uppercase letter
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        {passwordStrength.hasNumber ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <XCircle className="h-3 w-3 text-muted-foreground" />
        )}
        <span className={passwordStrength.hasNumber ? "text-foreground" : "text-muted-foreground"}>
          Number
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        {passwordStrength.hasSpecial ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <XCircle className="h-3 w-3 text-muted-foreground" />
        )}
        <span className={passwordStrength.hasSpecial ? "text-foreground" : "text-muted-foreground"}>
          Special character
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs col-span-2">
        {passwordStrength.hasLength ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <XCircle className="h-3 w-3 text-muted-foreground" />
        )}
        <span className={passwordStrength.hasLength ? "text-foreground" : "text-muted-foreground"}>
          8+ characters
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
