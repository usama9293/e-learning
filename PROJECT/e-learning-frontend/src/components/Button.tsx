import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

export function Button({ variant = 'primary', children, ...props }: ButtonProps) {
  const styles = {
    primary: {
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: 4,
      cursor: 'pointer',
    },
    secondary: {
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      padding: '10px 16px',
      borderRadius: 4,
      cursor: 'pointer',
    },
  };

  return (
    <button style={styles[variant]} {...props}>
      {children}
    </button>
  );
}
