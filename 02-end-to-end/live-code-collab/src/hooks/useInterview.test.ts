import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useInterview } from '@/hooks/useInterview';
import { api } from '@/services/api';

// Mock the api module
vi.mock('@/services/api', () => ({
  api: {
    createSession: vi.fn(),
    joinSession: vi.fn(),
    getSession: vi.fn(),
    updateCode: vi.fn(),
    changeLanguage: vi.fn(),
    executeCode: vi.fn(),
    leaveSession: vi.fn(),
    subscribe: vi.fn(() => vi.fn()),
  },
}));

const mockApi = vi.mocked(api);

describe('useInterview Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a session and update state', async () => {
      const mockSession = {
        id: 'test-session',
        title: 'Test Interview',
        language: 'javascript' as const,
        code: 'console.log("test")',
        participants: [{ id: 'host-1', name: 'Host', isHost: true, isOnline: true, joinedAt: new Date() }],
        output: null,
        createdAt: new Date(),
      };
      mockApi.createSession.mockResolvedValue(mockSession);

      const { result } = renderHook(() => useInterview());

      await act(async () => {
        const session = await result.current.createSession('Test Interview', 'javascript', 'Host');
        expect(session).toEqual(mockSession);
      });

      expect(result.current.session).toEqual(mockSession);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle errors when creating session fails', async () => {
      mockApi.createSession.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() => useInterview());

      await act(async () => {
        await expect(result.current.createSession('Test', 'javascript', 'Host')).rejects.toThrow('Network error');
      });

      expect(result.current.error).toBe('Network error');
    });
  });

  describe('joinSession', () => {
    it('should join a session and update state', async () => {
      const mockSession = {
        id: 'test-session',
        title: 'Test',
        language: 'javascript' as const,
        code: '',
        participants: [],
        output: null,
        createdAt: new Date(),
      };
      mockApi.joinSession.mockResolvedValue({ session: mockSession, participantId: 'participant-1' });

      const { result } = renderHook(() => useInterview());

      await act(async () => {
        const res = await result.current.joinSession('test-session', 'Candidate');
        expect(res.participantId).toBe('participant-1');
      });

      expect(result.current.session).toEqual(mockSession);
    });
  });

  describe('updateCode', () => {
    it('should update code when session and participant exist', async () => {
      mockApi.updateCode.mockResolvedValue({} as any);

      const { result } = renderHook(() => useInterview({ 
        sessionId: 'test-session', 
        participantId: 'participant-1' 
      }));

      await act(async () => {
        await result.current.updateCode('new code');
      });

      expect(mockApi.updateCode).toHaveBeenCalledWith({
        sessionId: 'test-session',
        participantId: 'participant-1',
        code: 'new code',
        timestamp: expect.any(Date),
      });
    });

    it('should not update code without sessionId', async () => {
      const { result } = renderHook(() => useInterview());

      await act(async () => {
        await result.current.updateCode('new code');
      });

      expect(mockApi.updateCode).not.toHaveBeenCalled();
    });
  });

  describe('changeLanguage', () => {
    it('should change language when session exists', async () => {
      mockApi.changeLanguage.mockResolvedValue({} as any);

      const { result } = renderHook(() => useInterview({ sessionId: 'test-session' }));

      await act(async () => {
        await result.current.changeLanguage('python');
      });

      expect(mockApi.changeLanguage).toHaveBeenCalledWith('test-session', 'python');
    });
  });

  describe('executeCode', () => {
    it('should execute code and return result', async () => {
      const mockResult = { success: true, output: 'Hello', executionTime: 10 };
      mockApi.executeCode.mockResolvedValue(mockResult);

      const { result } = renderHook(() => useInterview({ sessionId: 'test-session' }));

      let execResult;
      await act(async () => {
        execResult = await result.current.executeCode();
      });

      expect(execResult).toEqual(mockResult);
      expect(result.current.isExecuting).toBe(false);
    });
  });

  describe('leaveSession', () => {
    it('should leave session', async () => {
      mockApi.leaveSession.mockResolvedValue(undefined);

      const { result } = renderHook(() => useInterview({ 
        sessionId: 'test-session', 
        participantId: 'participant-1' 
      }));

      await act(async () => {
        await result.current.leaveSession();
      });

      expect(mockApi.leaveSession).toHaveBeenCalledWith('test-session', 'participant-1');
    });
  });
});
