import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { JoinSessionDialog } from '@/components/JoinSessionDialog';

describe('JoinSessionDialog Component', () => {
  it('should render dialog when open', () => {
    render(
      <JoinSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Join Interview Session')).toBeInTheDocument();
  });

  it('should pre-fill session ID when provided', () => {
    render(
      <JoinSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={vi.fn()}
        initialSessionId="abc123"
      />
    );

    expect(screen.getByLabelText('Session ID')).toHaveValue('abc123');
  });

  it('should call onSubmit with form values', async () => {
    const onSubmit = vi.fn();
    render(
      <JoinSessionDialog
        open={true}
        onOpenChange={vi.fn()}
        onSubmit={onSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('Your Name'), {
      target: { value: 'Jane Candidate' },
    });
    fireEvent.change(screen.getByLabelText('Session ID'), {
      target: { value: 'session123' },
    });
    
    fireEvent.click(screen.getByText('Join Session'));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('session123', 'Jane Candidate');
    });
  });

  it('should call onOpenChange when cancel is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <JoinSessionDialog
        open={true}
        onOpenChange={onOpenChange}
        onSubmit={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Cancel'));

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
