import { nanoid } from 'nanoid';
import type { 
  InterviewSession, 
  Participant, 
  SupportedLanguage, 
  ExecutionResult,
  CodeChange,
  LANGUAGE_CONFIG
} from '@/types/interview';
import { LANGUAGE_CONFIG as langConfig } from '@/types/interview';

// In-memory store for mock data
const sessions = new Map<string, InterviewSession>();
const subscribers = new Map<string, Set<(session: InterviewSession) => void>>();

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Mock API Service
 * All backend calls are centralized here for easy replacement with real API
 */
export const api = {
  /**
   * Create a new interview session
   */
  async createSession(title: string, language: SupportedLanguage, hostName: string): Promise<InterviewSession> {
    await delay(300);
    
    const sessionId = nanoid(10);
    const hostId = nanoid(8);
    
    const session: InterviewSession = {
      id: sessionId,
      title,
      createdAt: new Date(),
      language,
      code: langConfig[language].defaultCode,
      participants: [
        {
          id: hostId,
          name: hostName,
          isOnline: true,
          isHost: true,
          joinedAt: new Date(),
        },
      ],
      output: null,
    };
    
    sessions.set(sessionId, session);
    return session;
  },

  /**
   * Join an existing session
   */
  async joinSession(sessionId: string, participantName: string): Promise<{ session: InterviewSession; participantId: string }> {
    await delay(200);
    
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    const participantId = nanoid(8);
    const participant: Participant = {
      id: participantId,
      name: participantName,
      isOnline: true,
      isHost: false,
      joinedAt: new Date(),
    };
    
    session.participants.push(participant);
    sessions.set(sessionId, session);
    
    // Notify subscribers
    notifySubscribers(sessionId, session);
    
    return { session, participantId };
  },

  /**
   * Get session by ID
   */
  async getSession(sessionId: string): Promise<InterviewSession | null> {
    await delay(100);
    return sessions.get(sessionId) || null;
  },

  /**
   * Update code in session
   */
  async updateCode(change: CodeChange): Promise<InterviewSession> {
    await delay(50);
    
    const session = sessions.get(change.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.code = change.code;
    sessions.set(change.sessionId, session);
    
    // Notify subscribers
    notifySubscribers(change.sessionId, session);
    
    return session;
  },

  /**
   * Change programming language
   */
  async changeLanguage(sessionId: string, language: SupportedLanguage): Promise<InterviewSession> {
    await delay(100);
    
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.language = language;
    session.code = langConfig[language].defaultCode;
    sessions.set(sessionId, session);
    
    notifySubscribers(sessionId, session);
    
    return session;
  },

  /**
   * Execute code (mock - only JavaScript actually runs)
   */
  async executeCode(sessionId: string): Promise<ExecutionResult> {
    await delay(500);
    
    const session = sessions.get(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    const startTime = performance.now();
    let result: ExecutionResult;
    
    if (session.language === 'javascript') {
      try {
        // Create a sandboxed execution environment
        const logs: string[] = [];
        const mockConsole = {
          log: (...args: unknown[]) => logs.push(args.map(String).join(' ')),
          error: (...args: unknown[]) => logs.push(`Error: ${args.map(String).join(' ')}`),
          warn: (...args: unknown[]) => logs.push(`Warning: ${args.map(String).join(' ')}`),
        };
        
        // Execute in sandboxed function
        const sandboxedCode = `
          (function(console) {
            ${session.code}
          })
        `;
        
        const fn = eval(sandboxedCode);
        fn(mockConsole);
        
        result = {
          success: true,
          output: logs.join('\n') || 'No output',
          executionTime: performance.now() - startTime,
        };
      } catch (error) {
        result = {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Unknown error',
          executionTime: performance.now() - startTime,
        };
      }
    } else {
      // Mock execution for other languages
      result = {
        success: true,
        output: `[Mock execution for ${langConfig[session.language].label}]\nHello, World!`,
        executionTime: performance.now() - startTime,
      };
    }
    
    session.output = result;
    sessions.set(sessionId, session);
    notifySubscribers(sessionId, session);
    
    return result;
  },

  /**
   * Leave session
   */
  async leaveSession(sessionId: string, participantId: string): Promise<void> {
    await delay(100);
    
    const session = sessions.get(sessionId);
    if (!session) return;
    
    const participant = session.participants.find(p => p.id === participantId);
    if (participant) {
      participant.isOnline = false;
    }
    
    sessions.set(sessionId, session);
    notifySubscribers(sessionId, session);
  },

  /**
   * Subscribe to session updates (real-time simulation)
   */
  subscribe(sessionId: string, callback: (session: InterviewSession) => void): () => void {
    if (!subscribers.has(sessionId)) {
      subscribers.set(sessionId, new Set());
    }
    
    subscribers.get(sessionId)!.add(callback);
    
    // Return unsubscribe function
    return () => {
      subscribers.get(sessionId)?.delete(callback);
    };
  },
};

// Helper to notify all subscribers
function notifySubscribers(sessionId: string, session: InterviewSession) {
  const subs = subscribers.get(sessionId);
  if (subs) {
    subs.forEach(callback => callback({ ...session }));
  }
}

export default api;
