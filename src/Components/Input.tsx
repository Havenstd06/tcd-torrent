import React from 'react';

interface Props {
  name?: string;
  type?: string;
  value?: string;
  onChange?: Function;
  className?: string;
  placeholder?: string;
}

export default function Input({
  name,
  type = 'text',
  value,
  className = '',
  placeholder = '',
  onChange,
}: Props) {
  return (
    <input
      name={name}
      type={type}
      className={
        `block w-full border-0 border-b border-transparent focus:ring-0 focus:border-b focus:border-emerald focus:ring-emerald focus:outline-none bg-primary text-gray-200 sm:text-sm ` +
        className
      }
      value={value}
      onChange={(e) => (onChange ? onChange(e.target.value) : null)}
      placeholder={placeholder}
    />
  );
}
