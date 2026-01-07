import React from 'react';
import { twMerge } from 'tailwind-merge';

const Input = React.forwardRef(({
    className,
    type = 'text',
    label,
    error,
    icon: Icon,
    ...props
}, ref) => {
    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    ref={ref}
                    className={twMerge(
                        'w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 transition-all outline-none',
                        'focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10',
                        Icon && 'pl-10',
                        error && 'border-red-500 focus:border-red-500 focus:ring-red-500/10',
                        className
                    )}
                    {...props}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1 animate-fade-in">
                    {error}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
