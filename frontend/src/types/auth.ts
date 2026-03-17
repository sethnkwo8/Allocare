// Interface for register page form
export interface RegisterForm {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

// Interface for login page form
export interface LoginForm {
    email: string;
    password: string;
}