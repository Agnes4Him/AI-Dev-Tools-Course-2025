import { useEffect, useCallback, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CodeEditor } from '@/components/CodeEditor';
import { OutputPanel } from '@/components/OutputPanel';
import { InterviewHeader } from '@/components/InterviewHeader';
import { JoinSessionDialog } from '@/components/JoinSessionDialog';
import { useInterview } from '@/hooks/useInterview';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

export default function InterviewRoom() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const participantId = searchParams.get('pid');
  
  const [showJoinDialog, setShowJoinDialog] = useState(!participantId);
  const [localCode, setLocalCode] = useState('');
  
  const {
    session,
    isLoading,
    error,
    isExecuting,
    joinSession,
    updateCode,
    changeLanguage,
    executeCode,
    leaveSession,
  } = useInterview({ sessionId, participantId: participantId || undefined });

  const debouncedCode = useDebounce(localCode, 300);

  // Sync local code with session code
  useEffect(() => {
    if (session?.code && localCode !== session.code) {
      setLocalCode(session.code);
    }
  }, [session?.code]);

  // Update remote code when local code changes (debounced)
  useEffect(() => {
    if (debouncedCode && debouncedCode !== session?.code && participantId) {
      updateCode(debouncedCode);
    }
  }, [debouncedCode, session?.code, participantId, updateCode]);

  const handleCodeChange = useCallback((value: string) => {
    setLocalCode(value);
  }, []);

  const handleJoinSession = async (_: string, participantName: string) => {
    if (!sessionId) return;
    try {
      const result = await joinSession(sessionId, participantName);
      navigate(`/interview/${sessionId}?pid=${result.participantId}`, { replace: true });
      setShowJoinDialog(false);
      toast.success('Joined session successfully!');
    } catch {
      toast.error('Failed to join session');
    }
  };

  const handleLeave = async () => {
    await leaveSession();
    navigate('/');
  };

  const handleRunCode = async () => {
    const result = await executeCode();
    if (result?.success) {
      toast.success('Code executed successfully');
    } else if (result?.error) {
      toast.error('Code execution failed');
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !showJoinDialog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <h1 className="mb-2 text-2xl font-bold text-destructive">Session Not Found</h1>
        <p className="mb-4 text-muted-foreground">{error}</p>
        <button
          onClick={() => navigate('/')}
          className="text-primary hover:underline"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background" data-testid="interview-room">
      {session && participantId && (
        <>
          <InterviewHeader
            session={session}
            currentParticipantId={participantId}
            isExecuting={isExecuting}
            onLanguageChange={changeLanguage}
            onRunCode={handleRunCode}
            onLeave={handleLeave}
          />

          <div className="flex flex-1 overflow-hidden">
            {/* Code Editor Panel */}
            <div className="flex-1 border-r border-border p-4">
              <CodeEditor
                value={localCode}
                language={session.language}
                onChange={handleCodeChange}
              />
            </div>

            {/* Output Panel */}
            <div className="w-96 p-4">
              <OutputPanel
                result={session.output}
                isExecuting={isExecuting}
              />
            </div>
          </div>
        </>
      )}

      <JoinSessionDialog
        open={showJoinDialog}
        onOpenChange={(open) => {
          if (!open && !participantId) {
            navigate('/');
          }
          setShowJoinDialog(open);
        }}
        onSubmit={handleJoinSession}
        isLoading={isLoading}
        initialSessionId={sessionId}
      />
    </div>
  );
}
