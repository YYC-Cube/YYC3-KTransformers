/**
 * @file API客户端配置与实现
 * @description YYC³ AI小语智能成长守护系统的API客户端实现
 * @author YYC³团队
 * @version 1.0.0
 */

// API Client Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3200';

// API Client Class
class APIClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private getAuthHeaders(): Record<string, string> {
    // 从localStorage获取token
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        return {
          'Authorization': `Bearer ${token}`,
        };
      }
    }
    return {};
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const headers = {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ user: any; tokens: { accessToken: string; refreshToken: string } }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    return this.request<{ user: any; tokens: { accessToken: string; refreshToken: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(refreshToken: string) {
    return this.request('/api/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  async getProfile() {
    return this.request<{ user: any; stats: any }>('/api/auth/profile');
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatarUrl?: string;
  }) {
    return this.request<{ user: any }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // AI Chat endpoints
  async chat(data: {
    childId: string;
    message: string;
    aiRole: 'recorder' | 'guardian' | 'listener' | 'advisor' | 'cultural_mentor';
    sessionId?: string;
  }) {
    return this.request<{
      sessionId: string;
      message: string;
      aiResponse: string;
      aiRole: string;
      aiRoleName: string;
      emotion: string;
      context: any;
    }>('/api/ai/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getConversationHistory(childId: string, options: {
    page?: number;
    limit?: number;
    sessionId?: string;
  } = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.sessionId) params.append('sessionId', options.sessionId);

    return this.request<{
      conversations: Array<{
        id: string;
        sessionId: string;
        userMessage: string;
        aiResponse: string;
        aiRole: string;
        aiRoleName: string;
        emotion: string;
        createdAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
    }>(`/api/ai/children/${childId}/conversations?${params.toString()}`);
  }

  async getAISessions(childId: string) {
    return this.request<{
      child: { id: string; name: string };
      sessions: Array<{
        sessionId: string;
        lastMessageAt: string;
        messageCount: number;
        lastMessage: string;
      }>;
    }>(`/api/ai/children/${childId}/sessions`);
  }

  async getAIRoles() {
    return this.request<{
      aiRoles: Array<{
        id: string;
        name: string;
        description: string;
        personality: string;
        capabilities: string[];
        isActive: boolean;
      }>;
    }>('/api/ai/roles');
  }

  async getChatStats(childId: string, period: string = '7d') {
    return this.request<{
      period: string;
      summary: {
        totalConversations: number;
        uniqueSessions: number;
        activeDays: number;
        averagePerDay: string;
      };
      roleUsage: {
        recorder: number;
        guardian: number;
        listener: number;
        advisor: number;
        culturalMentor: number;
      };
      dailyStats: Array<{
        date: string;
        conversationsCount: number;
      }>;
    }>(`/api/ai/children/${childId}/stats?period=${period}`);
  }

  // Growth Records endpoints
  async createGrowthRecord(data: {
    childId: string;
    title: string;
    description?: string;
    category: 'milestone' | 'daily' | 'achievement' | 'health' | 'education' | 'social';
    mediaUrls?: string[];
    tags?: string[];
    location?: string;
    isPublic?: boolean;
  }) {
    return this.request<{
      growthRecord: {
        id: string;
        childId: string;
        title: string;
        description: string;
        category: string;
        mediaUrls: string[];
        tags: string[];
        location: string;
        isPublic: boolean;
        createdAt: string;
        updatedAt: string;
      };
    }>('/api/growth', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getGrowthRecords(childId: string, options: {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  } = {}) {
    const params = new URLSearchParams();
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.category) params.append('category', options.category);
    if (options.tags) options.tags.forEach(tag => params.append('tags', tag));
    if (options.startDate) params.append('startDate', options.startDate);
    if (options.endDate) params.append('endDate', options.endDate);
    if (options.sortBy) params.append('sortBy', options.sortBy);
    if (options.sortOrder) params.append('sortOrder', options.sortOrder);

    return this.request<{
      child: { id: string; name: string };
      growthRecords: Array<{
        id: string;
        title: string;
        description: string;
        category: string;
        mediaUrls: string[];
        tags: string[];
        location: string;
        isPublic: boolean;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
      filters: any;
    }>(`/api/growth/children/${childId}?${params.toString()}`);
  }

  async getGrowthRecord(recordId: string) {
    return this.request<{
      growthRecord: {
        id: string;
        childId: string;
        childName: string;
        title: string;
        description: string;
        category: string;
        mediaUrls: string[];
        tags: string[];
        location: string;
        isPublic: boolean;
        createdAt: string;
        updatedAt: string;
      };
    }>(`/api/growth/${recordId}`);
  }

  async updateGrowthRecord(recordId: string, data: {
    title?: string;
    description?: string;
    category?: string;
    mediaUrls?: string[];
    tags?: string[];
    location?: string;
    isPublic?: boolean;
  }) {
    return this.request<{
      growthRecord: {
        id: string;
        title: string;
        description: string;
        category: string;
        mediaUrls: string[];
        tags: string[];
        location: string;
        isPublic: boolean;
        updatedAt: string;
      };
    }>(`/api/growth/${recordId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteGrowthRecord(recordId: string) {
    return this.request(`/api/growth/${recordId}`, {
      method: 'DELETE',
    });
  }

  async searchGrowthRecords(childId: string, query: string, options: {
    page?: number;
    limit?: number;
    category?: string;
  } = {}) {
    const params = new URLSearchParams();
    params.append('q', query);
    if (options.page) params.append('page', options.page.toString());
    if (options.limit) params.append('limit', options.limit.toString());
    if (options.category) params.append('category', options.category);

    return this.request<{
      child: { id: string; name: string };
      query: string;
      growthRecords: Array<{
        id: string;
        title: string;
        description: string;
        category: string;
        mediaUrls: string[];
        tags: string[];
        location: string;
        isPublic: boolean;
        createdAt: string;
        updatedAt: string;
      }>;
      pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
      };
      filters: any;
    }>(`/api/growth/children/${childId}/search?${params.toString()}`);
  }

  async getGrowthStats(childId: string, period: string = '12m') {
    return this.request<{
      period: string;
      startDate: string;
      endDate: string;
      child: {
        id: string;
        name: string;
        birthDate: string;
      };
      summary: {
        totalRecords: number;
        milestoneRecords: number;
        dailyRecords: number;
        achievementRecords: number;
        healthRecords: number;
        educationRecords: number;
        socialRecords: number;
        activeDays: number;
        publicRecords: number;
        averagePerMonth: string;
      };
      monthlyStats: Array<{
        month: string;
        recordsCount: number;
      }>;
      topTags: Array<{
        tag: string;
        usageCount: number;
      }>;
    }>(`/api/growth/children/${childId}/stats?period=${period}`);
  }

  // Health check
  async healthCheck() {
    return this.request<{
      status: 'healthy' | 'unhealthy';
      timestamp: string;
      uptime: number;
      version: string;
      environment: string;
      services: {
        database: { status: string; lastCheck: string };
        redis: { status: string; lastCheck: string };
      };
      metrics: {
        memoryUsage: number;
        cpuUsage: number;
      };
    }>('/health');
  }
}

// Create singleton instance
export const apiClient = new APIClient();

// Export convenience methods
export const {
  login,
  register,
  logout,
  getProfile,
  updateProfile,
  chat,
  getConversationHistory,
  getAISessions,
  getAIRoles,
  getChatStats,
  createGrowthRecord,
  getGrowthRecords,
  getGrowthRecord,
  updateGrowthRecord,
  deleteGrowthRecord,
  searchGrowthRecords,
  getGrowthStats,
  healthCheck,
} = apiClient;

export default apiClient;