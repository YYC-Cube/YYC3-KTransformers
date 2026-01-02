"use client";

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { reportError } from '@/lib/global-error-handler';

// Types
interface AIMessage {
  id: string;
  sessionId: string;
  userMessage: string;
  aiResponse: string;
  aiRole: 'recorder' | 'guardian' | 'listener' | 'advisor' | 'cultural_mentor';
  aiRoleName: string;
  emotion: string;
  createdAt: string;
}

interface ChatSession {
  sessionId: string;
  lastMessageAt: string;
  messageCount: number;
  lastMessage: string;
}

interface AIRole {
  id: string;
  name: string;
  description: string;
  personality: string;
  capabilities: string[];
  isActive: boolean;
}

interface UseAIChatReturn {
  messages: AIMessage[];
  sessions: ChatSession[];
  aiRoles: AIRole[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string, aiRole: 'recorder' | 'guardian' | 'listener' | 'advisor' | 'cultural_mentor', childId: string, sessionId?: string) => Promise<boolean>;
  loadConversationHistory: (childId: string, sessionId?: string, page?: number) => Promise<void>;
  loadSessions: (childId: string) => Promise<void>;
  loadAIRoles: () => Promise<void>;
  clearError: () => void;
  createNewSession: () => string;
  currentSessionId: string | null;
  setCurrentSessionId: (sessionId: string | null) => void;
}

const AI_ROLES_CONFIG = {
  recorder: {
    name: '记录者',
    description: '专注记录孩子的成长瞬间，用温暖的方式保存美好回忆',
    color: 'blue',
    icon: '📝',
  },
  guardian: {
    name: '守护者',
    description: '保护孩子的安全，提供安全的成长环境',
    color: 'red',
    icon: '🛡️',
  },
  listener: {
    name: '聆听者',
    description: '倾听孩子的心声，理解情感需求',
    color: 'green',
    icon: '👂',
  },
  advisor: {
    name: '建议者',
    description: '提供专业的育儿建议和成长指导',
    color: 'purple',
    icon: '💡',
  },
  cultural_mentor: {
    name: '国粹导师',
    description: '传承中华优秀传统文化，培养文化自信',
    color: 'orange',
    icon: '🏛️',
  },
};

export function useAIChat(childId?: string): UseAIChatReturn {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [aiRoles, setAIRoles] = useState<AIRole[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Load AI roles on mount
  useEffect(() => {
    loadAIRoles();
  }, []);

  // Load sessions when childId changes
  useEffect(() => {
    if (childId) {
      loadSessions(childId);
    }
  }, [childId]);

  // Load AI roles
  const loadAIRoles = useCallback(async () => {
    try {
      const result = await apiClient.getAIRoles();
      if (result.success && result.data) {
        setAIRoles(result.data.aiRoles);
      }
    } catch (err) {
      reportError(err as Error, { component: 'useAIChat', action: 'loadAIRoles' });
      setError('加载AI角色失败');
    }
  }, []);

  // Load conversation history
  const loadConversationHistory = useCallback(async (targetChildId: string, sessionId?: string, page: number = 1) => {
    if (!targetChildId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.getConversationHistory(targetChildId, {
        page,
        limit: 50,
        sessionId,
      });

      if (result.success && result.data) {
        if (page === 1) {
          setMessages(result.data.conversations);
        } else {
          setMessages(prev => [...prev, ...result.data.conversations]);
        }
        setCurrentPage(page);
      }
    } catch (err) {
      reportError(err as Error, { component: 'useAIChat', action: 'loadConversationHistory' });
      setError('加载对话历史失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load sessions
  const loadSessions = useCallback(async (targetChildId: string) => {
    if (!targetChildId) return;

    try {
      const result = await apiClient.getAISessions(targetChildId);
      if (result.success && result.data) {
        setSessions(result.data.sessions);

        // Set current session if not set
        if (result.data.sessions.length > 0 && !currentSessionId) {
          setCurrentSessionId(result.data.sessions[0].sessionId);
        }
      }
    } catch (err) {
      reportError(err as Error, { component: 'useAIChat', action: 'loadSessions' });
      setError('加载会话列表失败');
    }
  }, [currentSessionId]);

  // Send message to AI
  const sendMessage = useCallback(async (
    message: string,
    aiRole: 'recorder' | 'guardian' | 'listener' | 'advisor' | 'cultural_mentor',
    targetChildId: string,
    sessionId?: string
  ): Promise<boolean> => {
    if (!message.trim() || !targetChildId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.chat({
        childId: targetChildId,
        message: message.trim(),
        aiRole,
        sessionId: sessionId || currentSessionId || undefined,
      });

      if (result.success && result.data) {
        const newMessage: AIMessage = {
          id: Date.now().toString(),
          sessionId: result.data.sessionId,
          userMessage: result.data.message,
          aiResponse: result.data.aiResponse,
          aiRole: result.data.aiRole,
          aiRoleName: result.data.aiRoleName,
          emotion: result.data.emotion,
          createdAt: new Date().toISOString(),
        };

        setMessages(prev => [...prev, newMessage]);

        // Update session if it's a new one
        if (result.data.sessionId !== currentSessionId) {
          setCurrentSessionId(result.data.sessionId);
          // Reload sessions to get updated list
          loadSessions(targetChildId);
        }

        return true;
      } else {
        setError(result.error || '发送消息失败');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '发送消息时发生错误';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentSessionId, loadSessions]);

  // Create new session
  const createNewSession = useCallback((): string => {
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCurrentSessionId(newSessionId);
    setMessages([]);
    return newSessionId;
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    messages,
    sessions,
    aiRoles,
    isLoading,
    error,
    sendMessage,
    loadConversationHistory,
    loadSessions,
    loadAIRoles,
    clearError,
    createNewSession,
    currentSessionId,
    setCurrentSessionId,
  };
}

// Hook for AI role information
export function useAIRoleConfig() {
  return AI_ROLES_CONFIG;
}

// Hook for AI chat statistics
export function useAIChatStats(childId?: string) {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async (targetChildId?: string, period: string = '7d') => {
    if (!targetChildId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.getChatStats(targetChildId, period);
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (err) {
      reportError(err as Error, { component: 'useAIChat', action: 'loadChatStats' });
      setError('加载统计信息失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    stats,
    isLoading,
    error,
    loadStats,
  };
}

// Hook for emotion analysis
export function useEmotionAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);

  const analyzeEmotion = useCallback(async (text: string): Promise<string | null> => {
    if (!text.trim()) return null;

    setIsAnalyzing(true);

    try {
      // For now, we'll use a simple keyword-based approach
      // In the future, this could call an API for more sophisticated analysis
      const lowerText = text.toLowerCase();

      if (lowerText.includes('开心') || lowerText.includes('高兴') || lowerText.includes('快乐')) {
        setEmotion('happy');
        return 'happy';
      } else if (lowerText.includes('难过') || lowerText.includes('伤心') || lowerText.includes('哭')) {
        setEmotion('sad');
        return 'sad';
      } else if (lowerText.includes('生气') || lowerText.includes('愤怒') || lowerText.includes('讨厌')) {
        setEmotion('angry');
        return 'angry';
      } else if (lowerText.includes('害怕') || lowerText.includes('紧张') || lowerText.includes('担心')) {
        setEmotion('fear');
        return 'fear';
      } else {
        setEmotion('neutral');
        return 'neutral';
      }
    } catch (err) {
      reportError(err as Error, { component: 'useAIChat', action: 'analyzeEmotion' });
      setEmotion(null);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, []);

  return {
    isAnalyzing,
    emotion,
    analyzeEmotion,
  };
}

export default useAIChat;