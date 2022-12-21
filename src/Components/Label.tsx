import React from "react";

interface Props {
    htmlFor: string;
    children: React.ReactNode;
    value?: string;
    className?: string;
}

export default function Label({ htmlFor, value, className, children }: Props) {
    return (
        <label
            htmlFor={htmlFor}
            className={
                `block text-sm font-medium text-gray-200` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
