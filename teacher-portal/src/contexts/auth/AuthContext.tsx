
import { createContext } from "react";
import { AuthContextType } from "./types";

// Create the context with undefined as the initial value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);
