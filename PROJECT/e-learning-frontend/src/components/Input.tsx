import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: 12 }}>
      {label && (
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>
          {label}
        </label>
      )}
      <input
        {...props}
        style={{
          padding: '8px 12px',
          border: '1px solid #ccc',
          borderRadius: 4,
          width: '100%',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}
