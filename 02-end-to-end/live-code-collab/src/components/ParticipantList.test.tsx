import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ParticipantList } from '@/components/ParticipantList';
import type { Participant } from '@/types/interview';

const mockParticipants: Participant[] = [
  { id: '1', name: 'Alice', isHost: true, isOnline: true, joinedAt: new Date() },
  { id: '2', name: 'Bob', isHost: false, isOnline: true, joinedAt: new Date() },
  { id: '3', name: 'Charlie', isHost: false, isOnline: false, joinedAt: new Date() },
];

describe('ParticipantList Component', () => {
  it('should render online participant count', () => {
    render(<ParticipantList participants={mockParticipants} />);
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('should display participant initials', () => {
    render(<ParticipantList participants={mockParticipants} />);
    
    expect(screen.getByTitle('Alice (Host)')).toBeInTheDocument();
    expect(screen.getByTitle('Bob')).toBeInTheDocument();
  });

  it('should highlight current participant', () => {
    render(
      <ParticipantList 
        participants={mockParticipants} 
        currentParticipantId="2" 
      />
    );
    
    const bobAvatar = screen.getByTitle('Bob');
    expect(bobAvatar).toHaveClass('bg-primary');
  });

  it('should not show offline participants', () => {
    render(<ParticipantList participants={mockParticipants} />);
    
    expect(screen.queryByTitle('Charlie')).not.toBeInTheDocument();
  });

  it('should show +N for more than 5 participants', () => {
    const manyParticipants: Participant[] = Array.from({ length: 8 }, (_, i) => ({
      id: String(i),
      name: `User${i}`,
      isHost: i === 0,
      isOnline: true,
      joinedAt: new Date(),
    }));

    render(<ParticipantList participants={manyParticipants} />);
    
    expect(screen.getByText('+3')).toBeInTheDocument();
  });
});
