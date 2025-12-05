import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'danger' | 'success' | 'warning';
}

export const Button = ({ children, variant = 'primary', className, ...props }: ButtonProps) => {
    return (
        <button className={`btn btn-${variant} ${className}`} {...props}>
            {children}
        </button>
    );
};