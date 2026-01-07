import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={twMerge(
                'bg-white rounded-2xl border border-gray-100 shadow-sm hover-lift',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
