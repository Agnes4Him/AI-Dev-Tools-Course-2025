import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateSessionDialog } from '@/components/CreateSessionDialog';

describe('CreateSessionDialog Component', () => {
  it('should render dialog when open', () => {
    render(
      <CreateSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Create Interview Session')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(
      <CreateSessionDialog
        open={false}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.queryByText('Create Interview Session')).not.toBeInTheDocument();
  });

  it('should call onSubmit with form values', async () => {
    const onSubmit = vi.fn();
    render(
      <CreateSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('Your Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Session Title'), {
      target: { value: 'Frontend Interview' },
    });
    
    fireEvent.click(screen.getByText('Create Session'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('Frontend Interview', 'javascript', 'John Doe');
    });
  });

  it('should disable submit when fields are empty', () => {
    render(
      <CreateSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.change(screen.getByLabelText('Your Name'), {
      target: { value: '' },
    });

    expect(screen.getByText('Create Session')).toBeDisabled();
  });

  it('should show loading state', () => {
    render(
      <CreateSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        isLoading={true}
      />
    );

    expect(screen.getByText('Creating...')).toBeInTheDocument();
  });
});
