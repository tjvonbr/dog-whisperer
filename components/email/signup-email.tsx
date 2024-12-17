import * as React from 'react';

interface SignUpEmailProps {
  firstName: string;
}

export function SignUpEmailTemplate({ firstName }: SignUpEmailProps) {
  return (
    <div>
      <h1>Welcome, {firstName}!</h1>
    </div>
  )
}