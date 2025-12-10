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
import { LanguageSelector } from './LanguageSelector';
import type { SupportedLanguage } from '@/types/interview';

interface CreateSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (title: string, language: SupportedLanguage, hostName: string) => void;
  isLoading?: boolean;
}

export function CreateSessionDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateSessionDialogProps) {
  const [title, setTitle] = useState('Coding Interview');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [hostName, setHostName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim() && hostName.trim()) {
      onSubmit(title.trim(), language, hostName.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-md" data-testid="create-session-dialog">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-xl">Create Interview Session</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Set up a new coding interview room. Share the link with candidates.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-6">
            <div className="grid gap-2">
              <Label htmlFor="hostName">Your Name</Label>
              <Input
                id="hostName"
                value={hostName}
                onChange={(e) => setHostName(e.target.value)}
                placeholder="Enter your name"
                className="bg-secondary border-border"
                required
                data-testid="host-name-input"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="title">Session Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Backend Developer Interview"
                className="bg-secondary border-border"
                required
                data-testid="session-title-input"
              />
            </div>

            <div className="grid gap-2">
              <Label>Programming Language</Label>
              <LanguageSelector value={language} onChange={setLanguage} />
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
            <Button type="submit" disabled={isLoading || !title.trim() || !hostName.trim()}>
              {isLoading ? 'Creating...' : 'Create Session'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
