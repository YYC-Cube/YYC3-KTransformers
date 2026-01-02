"use client";

import { useState, useCallback, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { reportError } from '@/lib/global-error-handler';

// Types
interface GrowthRecord {
  id: string;
  childId: string;
  childName: string;
  title: string;
  description: string;
  category: 'milestone' | 'daily' | 'achievement' | 'health' | 'education' | 'social';
  mediaUrls: string[];
  tags: string[];
  location: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface GrowthStats {
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
}

interface UseGrowthRecordsReturn {
  records: GrowthRecord[];
  stats: GrowthStats | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
  filters: {
    category?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  };
  createRecord: (data: {
    childId: string;
    title: string;
    description?: string;
    category: 'milestone' | 'daily' | 'achievement' | 'health' | 'education' | 'social';
    mediaUrls?: string[];
    tags?: string[];
    location?: string;
    isPublic?: boolean;
  }) => Promise<boolean>;
  updateRecord: (recordId: string, data: Partial<{
    title: string;
    description: string;
    category: string;
    mediaUrls: string[];
    tags: string[];
    location: string;
    isPublic: boolean;
  }>) => Promise<boolean>;
  deleteRecord: (recordId: string) => Promise<boolean>;
  loadRecords: (childId: string, options?: {
    page?: number;
    limit?: number;
    category?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }) => Promise<void>;
  loadRecord: (recordId: string) => Promise<GrowthRecord | null>;
  searchRecords: (childId: string, query: string, options?: {
    page?: number;
    limit?: number;
    category?: string;
  }) => Promise<void>;
  loadStats: (childId: string, period?: string) => Promise<void>;
  setFilters: (filters: Partial<{
    category: string;
    tags: string[];
    startDate: string;
    endDate: string;
    sortBy: string;
    sortOrder: string;
  }>) => void;
  clearError: () => void;
  resetFilters: () => void;
}

const GROWTH_CATEGORIES = {
  milestone: { name: '里程碑', color: 'blue', icon: '🎯' },
  daily: { name: '日常生活', color: 'green', icon: '📅' },
  achievement: { name: '成就', color: 'gold', icon: '🏆' },
  health: { name: '健康', color: 'red', icon: '❤️' },
  education: { name: '教育', color: 'purple', icon: '📚' },
  social: { name: '社交', color: 'orange', icon: '👥' },
};

export function useGrowthRecords(childId?: string): UseGrowthRecordsReturn {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null>(null);
  const [filters, setFiltersState] = useState<{
    category?: string;
    tags?: string[];
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: string;
  }>({});

  // Load records when childId or filters change
  useEffect(() => {
    if (childId) {
      loadRecords(childId, { ...filters, page: 1 });
    }
  }, [childId]);

  // Load records
  const loadRecords = useCallback(async (
    targetChildId: string,
    options: {
      page?: number;
      limit?: number;
      category?: string;
      tags?: string[];
      startDate?: string;
      endDate?: string;
      sortBy?: string;
      sortOrder?: string;
    } = {}
  ) => {
    if (!targetChildId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.getGrowthRecords(targetChildId, options);

      if (result.success && result.data) {
        setRecords(result.data.growthRecords);
        setPagination(result.data.pagination);
        setFiltersState({
          category: options.category,
          tags: options.tags,
          startDate: options.startDate,
          endDate: options.endDate,
          sortBy: options.sortBy,
          sortOrder: options.sortOrder,
        });
      }
    } catch (err) {
      reportError(err as Error, { component: 'useGrowthRecords', action: 'loadGrowthRecords' });
      setError('加载成长记录失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load single record
  const loadRecord = useCallback(async (recordId: string): Promise<GrowthRecord | null> => {
    if (!recordId) return null;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.getGrowthRecord(recordId);

      if (result.success && result.data) {
        return result.data.growthRecord;
      }
      return null;
    } catch (err) {
      reportError(err as Error, { component: 'useGrowthRecords', action: 'loadGrowthRecord', recordId });
      setError('加载成长记录详情失败');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create record
  const createRecord = useCallback(async (data: {
    childId: string;
    title: string;
    description?: string;
    category: 'milestone' | 'daily' | 'achievement' | 'health' | 'education' | 'social';
    mediaUrls?: string[];
    tags?: string[];
    location?: string;
    isPublic?: boolean;
  }): Promise<boolean> => {
    if (!data.childId || !data.title.trim()) return false;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.createGrowthRecord({
        ...data,
        title: data.title.trim(),
      });

      if (result.success) {
        // Reload records to include the new one
        if (childId) {
          await loadRecords(childId, { ...filters, page: 1 });
        }
        return true;
      } else {
        setError(result.error || '创建成长记录失败');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '创建成长记录时发生错误';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [childId, filters, loadRecords]);

  // Update record
  const updateRecord = useCallback(async (
    recordId: string,
    data: Partial<{
      title: string;
      description: string;
      category: string;
      mediaUrls: string[];
      tags: string[];
      location: string;
      isPublic: boolean;
    }>
  ): Promise<boolean> => {
    if (!recordId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.updateGrowthRecord(recordId, data);

      if (result.success) {
        // Update the record in the local state
        if (result.data) {
          setRecords(prev => prev.map(record =>
            record.id === recordId
              ? { ...record, ...result.data.growthRecord }
              : record
          ));
        }
        return true;
      } else {
        setError(result.error || '更新成长记录失败');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '更新成长记录时发生错误';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Delete record
  const deleteRecord = useCallback(async (recordId: string): Promise<boolean> => {
    if (!recordId) return false;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.deleteGrowthRecord(recordId);

      if (result.success) {
        // Remove the record from the local state
        setRecords(prev => prev.filter(record => record.id !== recordId));
        return true;
      } else {
        setError(result.error || '删除成长记录失败');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '删除成长记录时发生错误';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search records
  const searchRecords = useCallback(async (
    targetChildId: string,
    query: string,
    options: {
      page?: number;
      limit?: number;
      category?: string;
    } = {}
  ) => {
    if (!targetChildId || !query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.searchGrowthRecords(targetChildId, query.trim(), options);

      if (result.success && result.data) {
        setRecords(result.data.growthRecords);
        setPagination(result.data.pagination);
      }
    } catch (err) {
      reportError(err as Error, { component: 'useGrowthRecords', action: 'searchGrowthRecords', query });
      setError('搜索成长记录失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load statistics
  const loadStats = useCallback(async (targetChildId: string, period: string = '12m') => {
    if (!targetChildId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.getGrowthStats(targetChildId, period);

      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (err) {
      reportError(err as Error, { component: 'useGrowthRecords', action: 'loadGrowthStats', childId });
      setError('加载统计信息失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set filters
  const setFilters = useCallback((newFilters: Partial<{
    category: string;
    tags: string[];
    startDate: string;
    endDate: string;
    sortBy: string;
    sortOrder: string;
  }>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFiltersState(updatedFilters);

    if (childId) {
      loadRecords(childId, { ...updatedFilters, page: 1 });
    }
  }, [filters, childId, loadRecords]);

  // Reset filters
  const resetFilters = useCallback(() => {
    setFiltersState({});
    if (childId) {
      loadRecords(childId, { page: 1 });
    }
  }, [childId, loadRecords]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    records,
    stats,
    isLoading,
    error,
    pagination,
    filters,
    createRecord,
    updateRecord,
    deleteRecord,
    loadRecords,
    loadRecord,
    searchRecords,
    loadStats,
    setFilters,
    clearError,
    resetFilters,
  };
}

// Hook for growth categories
export function useGrowthCategories() {
  return GROWTH_CATEGORIES;
}

// Hook for growth record statistics
export function useGrowthRecordStats(childId?: string) {
  const [stats, setStats] = useState<GrowthStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async (targetChildId?: string, period: string = '12m') => {
    if (!targetChildId) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiClient.getGrowthStats(targetChildId, period);
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (err) {
      reportError(err as Error, { component: 'useGrowthRecords', action: 'refreshGrowthStats', childId: targetChildId, period });
      setError('加载统计信息失败');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (childId) {
      loadStats(childId);
    }
  }, [childId, loadStats]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
  };
}

export default useGrowthRecords;
