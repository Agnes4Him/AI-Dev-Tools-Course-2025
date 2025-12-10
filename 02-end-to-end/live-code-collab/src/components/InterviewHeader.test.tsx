import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InterviewHeader } from '@/components/InterviewHeader';
import type { InterviewSession } from '@/types/interview';

const mockSession: InterviewSession = {
  id: 'test-session',
  title: 'Frontend Interview',
  createdAt: new Date(),
  language: 'javascript',
  code: 'console.log("test")',
  participants: [
    { id: '1', name: 'Alice', isHost: true, isOnline: true, joinedAt: new Date() },
    { id: '2', name: 'Bob', isHost: false, isOnline: true, joinedAt: new Date() },
  ],
  output: null,
};

const renderWithRouter = (component: React.ReactNode) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('InterviewHeader Component', () => {
  it('should display session title', () => {
    renderWithRouter(
      <InterviewHeader
        session={mockSession}
        currentParticipantId="1"
        isExecuting={false}
        onLanguageChange={vi.fn()}
        onRunCode={vi.fn()}
        onLeave={vi.fn()}
      />
    );

    expect(screen.getByText('Frontend Interview')).toBeInTheDocument();
  });

  it('should call onRunCode when run button is clicked', () => {
    const onRunCode = vi.fn();
    renderWithRouter(
      <InterviewHeader
        session={mockSession}
        currentParticipantId="1"
        isExecuting={false}
        onLanguageChange={vi.fn()}
        onRunCode={onRunCode}
        onLeave={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Run Code'));

    expect(onRunCode).toHaveBeenCalled();
  });

  it('should show running state when executing', () => {
    renderWithRouter(
      <InterviewHeader
        session={mockSession}
        currentParticipantId="1"
        isExecuting={true}
        onLanguageChange={vi.fn()}
        onRunCode={vi.fn()}
        onLeave={vi.fn()}
      />
    );

    expect(screen.getByText('Running...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Running/i })).toBeDisabled();
  });

  it('should copy link to clipboard when share button is clicked', async () => {
    renderWithRouter(
      <InterviewHeader
        session={mockSession}
        currentParticipantId="1"
        isExecuting={false}
        onLanguageChange={vi.fn()}
        onRunCode={vi.fn()}
        onLeave={vi.fn()}
      />
    );

    fireEvent.click(screen.getByText('Share Link'));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('/interview/test-session')
      );
    });
  });

  it('should call onLeave when leave button is clicked', () => {
    const onLeave = vi.fn();
    renderWithRouter(
      <InterviewHeader
        session={mockSession}
        currentParticipantId="1"
        isExecuting={false}
        onLanguageChange={vi.fn()}
        onRunCode={vi.fn()}
        onLeave={onLeave}
      />
    );

    fireEvent.click(screen.getByTestId('leave-button'));

    expect(onLeave).toHaveBeenCalled();
  });
});
