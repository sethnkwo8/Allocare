// Interface for register page form
export interface RegisterFormType {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Interface for login page form
export interface LoginFormType {
    email: string;
    password: string;
}