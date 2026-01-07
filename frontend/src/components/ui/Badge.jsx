import React from 'react';
import { twMerge } from 'tailwind-merge';

const Badge = ({ children, variant = 'primary', className }) => {
    const variants = {
        primary: 'bg-blue-50 text-blue-600 border-blue-100',
        success: 'bg-green-50 text-green-600 border-green-100',
        warning: 'bg-amber-50 text-amber-600 border-amber-100',
        danger: 'bg-red-50 text-red-600 border-red-100',
        neutral: 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
        <span className={twMerge(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border',
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

export default Badge;
