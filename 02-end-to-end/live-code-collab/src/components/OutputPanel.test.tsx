import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { OutputPanel } from '@/components/OutputPanel';
import type { ExecutionResult } from '@/types/interview';

describe('OutputPanel Component', () => {
  it('should show placeholder when no result', () => {
    render(<OutputPanel result={null} isExecuting={false} />);
    
    expect(screen.getByText(/Click "Run Code"/)).toBeInTheDocument();
  });

  it('should show loading state when executing', () => {
    render(<OutputPanel result={null} isExecuting={true} />);
    
    expect(screen.getByText(/Running code/)).toBeInTheDocument();
  });

  it('should display successful output', () => {
    const result: ExecutionResult = {
      success: true,
      output: 'Hello, World!',
      executionTime: 50,
    };

    render(<OutputPanel result={result} isExecuting={false} />);
    
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('50ms')).toBeInTheDocument();
  });

  it('should display error message', () => {
    const result: ExecutionResult = {
      success: false,
      output: '',
      error: 'SyntaxError: Unexpected token',
      executionTime: 10,
    };

    render(<OutputPanel result={result} isExecuting={false} />);
    
    expect(screen.getByText(/SyntaxError/)).toBeInTheDocument();
  });
});
