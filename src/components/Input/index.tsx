import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    isTextarea?: boolean;
}

export const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
    ({ label, error, isTextarea, className, ...props }, ref) => {
        return (
            <div className="mb-3">
                <label className="form-label">{label}</label>
                {isTextarea ? (
                    <textarea
                        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
                        ref={ref as any}
                        {...props}
                    />
                ) : (
                    <input
                        className={`form-control ${error ? 'is-invalid' : ''} ${className}`}
                        ref={ref as any}
                        {...props}
                    />
                )}
                {error && <div className="invalid-feedback">{error}</div>}
            </div>
        );
    }
);