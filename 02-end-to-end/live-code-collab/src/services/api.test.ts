import { describe, it, expect, beforeEach, vi } from 'vitest';
import { api } from '@/services/api';
import type { SupportedLanguage } from '@/types/interview';

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a new session with correct properties', async () => {
      const title = 'Test Interview';
      const language: SupportedLanguage = 'javascript';
      const hostName = 'John Doe';

      const session = await api.createSession(title, language, hostName);

      expect(session).toHaveProperty('id');
      expect(session.title).toBe(title);
      expect(session.language).toBe(language);
      expect(session.participants).toHaveLength(1);
      expect(session.participants[0].name).toBe(hostName);
      expect(session.participants[0].isHost).toBe(true);
      expect(session.participants[0].isOnline).toBe(true);
      expect(session.code).toBeDefined();
      expect(session.output).toBeNull();
    });

    it('should generate unique session IDs', async () => {
      const session1 = await api.createSession('Test 1', 'javascript', 'Host 1');
      const session2 = await api.createSession('Test 2', 'javascript', 'Host 2');

      expect(session1.id).not.toBe(session2.id);
    });

    it('should use default code for selected language', async () => {
      const session = await api.createSession('Test', 'python', 'Host');

      expect(session.code).toContain('def solution');
      expect(session.code).toContain('print');
    });
  });

  describe('joinSession', () => {
    it('should add participant to existing session', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      const result = await api.joinSession(session.id, 'Candidate');

      expect(result.session.participants).toHaveLength(2);
      expect(result.participantId).toBeDefined();
      expect(result.session.participants[1].name).toBe('Candidate');
      expect(result.session.participants[1].isHost).toBe(false);
    });

    it('should throw error for non-existent session', async () => {
      await expect(api.joinSession('invalid-id', 'Candidate')).rejects.toThrow('Session not found');
    });
  });

  describe('getSession', () => {
    it('should return existing session', async () => {
      const created = await api.createSession('Test', 'javascript', 'Host');
      const fetched = await api.getSession(created.id);

      expect(fetched).not.toBeNull();
      expect(fetched?.id).toBe(created.id);
    });

    it('should return null for non-existent session', async () => {
      const result = await api.getSession('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('updateCode', () => {
    it('should update session code', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      const newCode = 'console.log("updated");';
      
      const updated = await api.updateCode({
        sessionId: session.id,
        participantId: session.participants[0].id,
        code: newCode,
        timestamp: new Date(),
      });

      expect(updated.code).toBe(newCode);
    });

    it('should throw error for non-existent session', async () => {
      await expect(api.updateCode({
        sessionId: 'invalid',
        participantId: 'test',
        code: 'test',
        timestamp: new Date(),
      })).rejects.toThrow('Session not found');
    });
  });

  describe('changeLanguage', () => {
    it('should change language and reset code', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      const updated = await api.changeLanguage(session.id, 'python');

      expect(updated.language).toBe('python');
      expect(updated.code).toContain('def solution');
    });
  });

  describe('executeCode', () => {
    it('should execute JavaScript code successfully', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      await api.updateCode({
        sessionId: session.id,
        participantId: session.participants[0].id,
        code: 'console.log("Hello, World!");',
        timestamp: new Date(),
      });

      const result = await api.executeCode(session.id);

      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello, World!');
      expect(result.executionTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle code errors gracefully', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      await api.updateCode({
        sessionId: session.id,
        participantId: session.participants[0].id,
        code: 'throw new Error("Test error");',
        timestamp: new Date(),
      });

      const result = await api.executeCode(session.id);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Test error');
    });

    it('should mock execution for non-JavaScript languages', async () => {
      const session = await api.createSession('Test', 'python', 'Host');
      const result = await api.executeCode(session.id);

      expect(result.success).toBe(true);
      expect(result.output).toContain('Mock execution');
    });
  });

  describe('leaveSession', () => {
    it('should mark participant as offline', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      const { participantId } = await api.joinSession(session.id, 'Candidate');

      await api.leaveSession(session.id, participantId);
      const updated = await api.getSession(session.id);

      const participant = updated?.participants.find(p => p.id === participantId);
      expect(participant?.isOnline).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('should notify subscribers on code update', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      const callback = vi.fn();

      api.subscribe(session.id, callback);
      await api.updateCode({
        sessionId: session.id,
        participantId: session.participants[0].id,
        code: 'new code',
        timestamp: new Date(),
      });

      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][0].code).toBe('new code');
    });

    it('should return unsubscribe function', async () => {
      const session = await api.createSession('Test', 'javascript', 'Host');
      const callback = vi.fn();

      const unsubscribe = api.subscribe(session.id, callback);
      unsubscribe();
      
      await api.updateCode({
        sessionId: session.id,
        participantId: session.participants[0].id,
        code: 'new code',
        timestamp: new Date(),
      });

      expect(callback).not.toHaveBeenCalled();
    });
  });
});
