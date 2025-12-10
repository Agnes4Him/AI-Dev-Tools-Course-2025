import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface JoinSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (sessionId: string, participantName: string) => void;
  isLoading?: boolean;
  initialSessionId?: string;
}

export function JoinSessionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  initialSessionId = '',
}: JoinSessionDialogProps) {
  const [sessionId, setSessionId] = useState(initialSessionId);
  const [participantName, setParticipantName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionId.trim() && participantName.trim()) {
      onSubmit(sessionId.trim(), participantName.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md" data-testid="join-session-dialog">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Join Interview Session</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter the session ID and your name to join the interview.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="participantName">Your Name</Label>
              <Input
                id="participantName"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Enter your name"
                className="bg-secondary border-border"
                required
                data-testid="participant-name-input"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sessionId">Session ID</Label>
              <Input
                id="sessionId"
                value={sessionId}
                onChange={(e) => setSessionId(e.target.value)}
                placeholder="Enter session ID"
                className="bg-secondary border-border font-mono"
                required
                data-testid="session-id-input"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !sessionId.trim() || !participantName.trim()}>
              {isLoading ? 'Joining...' : 'Join Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
