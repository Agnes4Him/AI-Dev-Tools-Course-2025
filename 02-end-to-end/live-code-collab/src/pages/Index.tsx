import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CreateSessionDialog } from '@/components/CreateSessionDialog';
import { JoinSessionDialog } from '@/components/JoinSessionDialog';
import { useInterview } from '@/hooks/useInterview';
import { Code2, Users, Zap, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import type { SupportedLanguage } from '@/types/interview';

const Index = () => {
  const navigate = useNavigate();
  const { createSession, joinSession, isLoading } = useInterview();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);

  const handleCreateSession = async (title: string, language: SupportedLanguage, hostName: string) => {
    try {
      const session = await createSession(title, language, hostName);
      const participantId = session.participants[0].id;
      toast.success('Session created successfully!');
      navigate(`/interview/${session.id}?pid=${participantId}`);
    } catch {
      toast.error('Failed to create session');
    }
  };

  const handleJoinSession = async (sessionId: string, participantName: string) => {
    try {
      const result = await joinSession(sessionId, participantName);
      toast.success('Joined session successfully!');
      navigate(`/interview/${result.session.id}?pid=${result.participantId}`);
    } catch {
      toast.error('Failed to join session. Check the session ID.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="container relative mx-auto px-4 py-24">
          <div className="mx-auto max-w-3xl text-center animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm backdrop-blur-sm">
              <Terminal className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Real-time collaborative coding</span>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-6xl">
              <span className="text-gradient">CodeInterview</span>
              <br />
              <span className="text-foreground">Made Simple</span>
            </h1>
            
            <p className="mb-10 text-lg text-muted-foreground md:text-xl">
              Conduct technical interviews with real-time code collaboration.
              Create a session, share the link, and start coding together.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => setShowCreate(true)}
                className="w-full gap-2 sm:w-auto animate-pulse-glow"
                data-testid="create-session-button"
              >
                <Code2 className="h-5 w-5" />
                Create Interview
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowJoin(true)}
                className="w-full gap-2 sm:w-auto"
                data-testid="join-session-button"
              >
                <Users className="h-5 w-5" />
                Join Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="border-t border-border bg-card/30">
        <div className="container mx-auto px-4 py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Code2 className="h-6 w-6" />}
              title="Syntax Highlighting"
              description="Support for JavaScript, TypeScript, Python, Java, and C++ with full syntax highlighting."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Real-time Collaboration"
              description="See code changes instantly. All participants stay in sync with live updates."
            />
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title="Code Execution"
              description="Run code directly in the browser. Test solutions with instant feedback."
            />
          </div>
        </div>
      </div>

      <CreateSessionDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onSubmit={handleCreateSession}
        isLoading={isLoading}
      />

      <JoinSessionDialog
        open={showJoin}
        onOpenChange={setShowJoin}
        onSubmit={handleJoinSession}
        isLoading={isLoading}
      />
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="gradient-border rounded-xl p-6 transition-transform hover:scale-[1.02]">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export default Index;
