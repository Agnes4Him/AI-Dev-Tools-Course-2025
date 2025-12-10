import { useState, useEffect, useCallback, useRef } from 'react';
import { api } from '@/services/api';
import type { InterviewSession, SupportedLanguage, CodeChange } from '@/types/interview';

interface UseInterviewOptions {
  sessionId?: string;
  participantId?: string;
}

export function useInterview({ sessionId, participantId }: UseInterviewOptions = {}) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!sessionId) return;

    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const fetchedSession = await api.getSession(sessionId);
        if (fetchedSession) {
          setSession(fetchedSession);
        } else {
          setError('Session not found');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch session');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Subscribe to updates
    unsubscribeRef.current = api.subscribe(sessionId, (updatedSession) => {
      setSession(updatedSession);
    });

    return () => {
      unsubscribeRef.current?.();
    };
  }, [sessionId]);

  // Create new session
  const createSession = useCallback(async (title: string, language: SupportedLanguage, hostName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newSession = await api.createSession(title, language, hostName);
      setSession(newSession);
      return newSession;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Join session
  const joinSession = useCallback(async (id: string, participantName: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await api.joinSession(id, participantName);
      setSession(result.session);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update code
  const updateCode = useCallback(async (code: string) => {
    if (!sessionId || !participantId) return;
    
    const change: CodeChange = {
      sessionId,
      participantId,
      code,
      timestamp: new Date(),
    };
    
    try {
      await api.updateCode(change);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update code');
    }
  }, [sessionId, participantId]);

  // Change language
  const changeLanguage = useCallback(async (language: SupportedLanguage) => {
    if (!sessionId) return;
    
    try {
      await api.changeLanguage(sessionId, language);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to change language');
    }
  }, [sessionId]);

  // Execute code
  const executeCode = useCallback(async () => {
    if (!sessionId) return;
    
    setIsExecuting(true);
    try {
      const result = await api.executeCode(sessionId);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute code');
    } finally {
      setIsExecuting(false);
    }
  }, [sessionId]);

  // Leave session
  const leaveSession = useCallback(async () => {
    if (!sessionId || !participantId) return;
    
    try {
      await api.leaveSession(sessionId, participantId);
    } catch (err) {
      console.error('Failed to leave session:', err);
    }
  }, [sessionId, participantId]);

  return {
    session,
    isLoading,
    error,
    isExecuting,
    createSession,
    joinSession,
    updateCode,
    changeLanguage,
    executeCode,
    leaveSession,
  };
}
