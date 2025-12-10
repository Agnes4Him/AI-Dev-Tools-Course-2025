import type { ExecutionResult } from '@/types/interview';
import { CheckCircle, XCircle, Clock, Terminal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OutputPanelProps {
  result: ExecutionResult | null;
  isExecuting: boolean;
}

export function OutputPanel({ result, isExecuting }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col bg-card rounded-lg border border-border overflow-hidden" data-testid="output-panel">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Terminal className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Output</span>
        {result && (
          <div className={cn(
            "ml-auto flex items-center gap-1.5 text-xs",
            result.success ? "text-success" : "text-destructive"
          )}>
            {result.success ? (
              <CheckCircle className="h-3.5 w-3.5" />
            ) : (
              <XCircle className="h-3.5 w-3.5" />
            )}
            <Clock className="h-3 w-3" />
            <span>{result.executionTime.toFixed(0)}ms</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-auto p-4 font-mono text-sm">
        {isExecuting ? (
          <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
            <div className="h-2 w-2 rounded-full bg-primary animate-bounce" />
            <span>Running code...</span>
          </div>
        ) : result ? (
          <div className="space-y-2">
            {result.error ? (
              <pre className="text-destructive whitespace-pre-wrap">{result.error}</pre>
            ) : (
              <pre className="text-foreground whitespace-pre-wrap">{result.output}</pre>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground">
            Click "Run Code" to execute your solution
          </div>
        )}
      </div>
    </div>
  );
}
