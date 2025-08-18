import "./RetroTextBox.css"
import React, { FC, useEffect, useRef, ChangeEvent, useState } from "react";

interface TextBoxProps {
    labelText: string;
    type?: 'text' | 'email' | 'password' | 'tel' | 'number' | 'url';
    placeholder?: string;
    value?: string;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    id?: string;
    name?: string;
    autoComplete?: string;
    maxLength?: number;
    minLength?: number;
    pattern?: string;
    showPasswordToggle?: boolean;
}

const RetroTextBox: FC<TextBoxProps> = ({
                                            labelText,
                                            type = 'text',
                                            placeholder = '',
                                            value = '',
                                            onChange,
                                            onFocus,
                                            onBlur,
                                            disabled = false,
                                            required = false,
                                            className = '',
                                            id,
                                            name,
                                            autoComplete,
                                            maxLength,
                                            minLength,
                                            pattern,
                                            showPasswordToggle = true
                                        }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === 'password' && showPassword ? 'text' : type;

    useEffect(() => {
        if (!canvasRef.current) {
            const canvas = document.createElement('canvas');
            canvas.style.display = 'none';
            document.body.appendChild(canvas);
            canvasRef.current = canvas;
        }

        const input = inputRef.current;
        const canvas = canvasRef.current;

        if (!input || !canvas) return;

        function measureTextWidth(text: string, inputElement: HTMLInputElement): number {
            const ctx = canvas.getContext('2d');
            if (!ctx) return 0;

            const computedStyle = window.getComputedStyle(inputElement);
            const fontSize = computedStyle.fontSize;
            const fontFamily = computedStyle.fontFamily;
            const fontWeight = computedStyle.fontWeight;

            ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;

            // More precise measurement
            const metrics = ctx.measureText(text);
            return Math.floor(metrics.width); // Use floor instead of round for tighter fit
        }

        function updateCursorPosition(inputElement: HTMLInputElement) {
            const formGroup = inputElement.closest('.form-group') as HTMLElement;
            if (formGroup && formGroup.classList.contains('focused')) {
                inputElement.focus();

                setTimeout(() => {
                    const cursorPos = inputElement.selectionStart || 0;

                    let textBeforeCursor = inputElement.value.substring(0, cursorPos);
                    if (type === 'password' && !showPassword) {
                        textBeforeCursor = '•'.repeat(textBeforeCursor.length);
                    }

                    const textWidth = measureTextWidth(textBeforeCursor, inputElement);

                    const computedStyle = window.getComputedStyle(inputElement);

                    // Reduced padding calculation
                    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 8; // Reduced from 10
                    const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;

                    // Fine-tune the cursor position with less extra space
                    let cursorPosition = Math.round(paddingLeft + borderLeft + textWidth - 1); // Subtract 1px for tighter fit

                    const inputRect = inputElement.getBoundingClientRect();
                    const paddingRight = parseFloat(computedStyle.paddingRight) || 8;

                    const maxCursorPosition = inputRect.width - paddingRight - borderLeft - 8; // Reduced margin

                    if (cursorPosition > maxCursorPosition) {
                        cursorPosition = Math.max(maxCursorPosition, paddingLeft + borderLeft);
                    }

                    const minCursorPosition = paddingLeft + borderLeft;
                    if (cursorPosition < minCursorPosition) {
                        cursorPosition = minCursorPosition;
                    }

                    formGroup.style.setProperty('--cursor-left', `${cursorPosition}px`);
                }, 1);
            }
        }

        const handleFocus = (event: FocusEvent) => {
            const formGroup = input.closest('.form-group') as HTMLElement;
            if (formGroup) {
                formGroup.classList.add('focused');
                setTimeout(() => updateCursorPosition(input), 10);
            }
            if (onFocus) {
                onFocus(event as unknown as React.FocusEvent<HTMLInputElement>);
            }
        };

        const handleBlur = (event: FocusEvent) => {
            const formGroup = input.closest('.form-group') as HTMLElement;
            if (formGroup) {
                formGroup.classList.remove('focused');
            }
            if (onBlur) {
                onBlur(event as unknown as React.FocusEvent<HTMLInputElement>);
            }
        };

        const handleInput = () => {
            setTimeout(() => updateCursorPosition(input), 5);
        };

        const handleKeyUp = (event: KeyboardEvent) => {
            setTimeout(() => updateCursorPosition(input), 5);
        };

        const handleClick = () => {
            setTimeout(() => updateCursorPosition(input), 5);
        };

        const handleKeyDown = (event: KeyboardEvent) => {
            const navigationKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
            if (navigationKeys.includes(event.key)) {
                setTimeout(() => updateCursorPosition(input), 5);
            }
        };

        input.addEventListener('focus', handleFocus);
        input.addEventListener('blur', handleBlur);
        input.addEventListener('input', handleInput);
        input.addEventListener('keyup', handleKeyUp);
        input.addEventListener('click', handleClick);
        input.addEventListener('keydown', handleKeyDown);

        return () => {
            input.removeEventListener('focus', handleFocus);
            input.removeEventListener('blur', handleBlur);
            input.removeEventListener('input', handleInput);
            input.removeEventListener('keyup', handleKeyUp);
            input.removeEventListener('click', handleClick);
            input.removeEventListener('keydown', handleKeyDown);
        };
    }, [onFocus, onBlur, showPassword, type]);

    useEffect(() => {
        return () => {
            if (canvasRef.current && document.body.contains(canvasRef.current)) {
                document.body.removeChild(canvasRef.current);
            }
        };
    }, []);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
            onChange(event);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const input = inputRef.current;
                setTimeout(() => {
                    const formGroup = input.closest('.form-group') as HTMLElement;
                    if (formGroup && formGroup.classList.contains('focused')) {
                        const cursorPos = input.selectionStart || 0;
                        const textBeforeCursor = input.value.substring(0, cursorPos);

                        const canvas = canvasRef.current;
                        if (canvas) {
                            const ctx = canvas.getContext('2d');
                            if (ctx) {
                                const computedStyle = window.getComputedStyle(input);
                                ctx.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;
                                const textWidth = ctx.measureText(textBeforeCursor).width;
                                const paddingLeft = parseFloat(computedStyle.paddingLeft) || 50;
                                const borderLeft = parseFloat(computedStyle.borderLeftWidth) || 0;
                                const cursorPosition = Math.round(paddingLeft + borderLeft + textWidth);
                                formGroup.style.setProperty('--cursor-left', `${cursorPosition}px`);
                            }
                        }
                    }
                }, 10);
            }
        }, 0);
    };

    const getPasswordToggleIcon = () => {
        if (showPassword) {
            return (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
            );
        } else {
            return (
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            );
        }
    };

    return (
        <div className={`form-group ${className}`}>
            <label htmlFor={id} >
                {labelText}
                {required && <span className="required">*</span>}
            </label>
            <div className="input-wrapper">
                <input
                    ref={inputRef}
                    type={inputType}
                    id={id}
                    name={name}
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    minLength={minLength}
                    pattern={pattern}
                />
                {type === 'password' && showPasswordToggle && (
                    <button
                        type="button"
                        className="password-toggle-btn"
                        onClick={togglePasswordVisibility}
                        disabled={disabled}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {getPasswordToggleIcon()}
                    </button>
                )}
            </div>
        </div>
    );
};

export default RetroTextBox;
