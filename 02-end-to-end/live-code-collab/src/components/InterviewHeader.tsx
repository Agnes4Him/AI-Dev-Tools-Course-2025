import { Button } from '@/components/ui/button';
import { LanguageSelector } from './LanguageSelector';
import { ParticipantList } from './ParticipantList';
import type { InterviewSession, SupportedLanguage } from '@/types/interview';
import { Play, Copy, Check, LogOut } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface InterviewHeaderProps {
  session: InterviewSession;
  currentParticipantId: string;
  isExecuting: boolean;
  onLanguageChange: (language: SupportedLanguage) => void;
  onRunCode: () => void;
  onLeave: () => void;
}

export function InterviewHeader({
  session,
  currentParticipantId,
  isExecuting,
  onLanguageChange,
  onRunCode,
  onLeave,
}: InterviewHeaderProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl = `${window.location.origin}/interview/${session.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  return (
    <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3" data-testid="interview-header">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold">{session.title}</h1>
        <LanguageSelector
          value={session.language}
          onChange={onLanguageChange}
        />
      </div>

      <div className="flex items-center gap-4">
        <ParticipantList
          participants={session.participants}
          currentParticipantId={currentParticipantId}
        />

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyLink}
          className="gap-2"
          data-testid="copy-link-button"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Share Link'}
        </Button>

        <Button
          size="sm"
          onClick={onRunCode}
          disabled={isExecuting}
          className="gap-2 glow-primary"
          data-testid="run-code-button"
        >
          <Play className="h-4 w-4" />
          {isExecuting ? 'Running...' : 'Run Code'}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onLeave}
          className="text-muted-foreground hover:text-destructive"
          data-testid="leave-button"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
