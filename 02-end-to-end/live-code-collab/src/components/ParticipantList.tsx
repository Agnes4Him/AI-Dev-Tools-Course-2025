import type { Participant } from '@/types/interview';
import { Users, Crown } from 'lucide-react';

interface ParticipantListProps {
  participants: Participant[];
  currentParticipantId?: string;
}

export function ParticipantList({ participants, currentParticipantId }: ParticipantListProps) {
  const onlineCount = participants.filter(p => p.isOnline).length;

  return (
    <div className="flex items-center gap-3" data-testid="participant-list">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        <Users className="h-4 w-4" />
        <span className="text-sm font-medium">{onlineCount}</span>
      </div>
      
      <div className="flex -space-x-2">
        {participants.filter(p => p.isOnline).slice(0, 5).map((participant) => (
          <div
            key={participant.id}
            className={`relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-background text-xs font-semibold transition-transform hover:scale-110 hover:z-10 ${
              participant.id === currentParticipantId
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-foreground'
            }`}
            title={`${participant.name}${participant.isHost ? ' (Host)' : ''}`}
          >
            {participant.name.charAt(0).toUpperCase()}
            {participant.isHost && (
              <Crown className="absolute -top-1 -right-1 h-3 w-3 text-warning" />
            )}
            <span className="status-indicator status-online absolute -bottom-0.5 -right-0.5" />
          </div>
        ))}
        
        {participants.filter(p => p.isOnline).length > 5 && (
          <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-semibold text-muted-foreground">
            +{participants.filter(p => p.isOnline).length - 5}
          </div>
        )}
      </div>
    </div>
  );
}
