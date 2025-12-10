import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageSelector } from '@/components/LanguageSelector';

describe('LanguageSelector Component', () => {
  it('should render with selected language', () => {
    render(
      <LanguageSelector
        value="javascript"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByRole('combobox')).toHaveTextContent('JavaScript');
  });

  it('should call onChange when language is selected', async () => {
    const onChange = vi.fn();
    render(
      <LanguageSelector
        value="javascript"
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('combobox'));
    
    const pythonOption = await screen.findByText('Python');
    fireEvent.click(pythonOption);

    expect(onChange).toHaveBeenCalledWith('python');
  });

  it('should be disabled when disabled prop is true', () => {
    render(
      <LanguageSelector
        value="javascript"
        onChange={vi.fn()}
        disabled
      />
    );

    expect(screen.getByRole('combobox')).toBeDisabled();
  });
});
