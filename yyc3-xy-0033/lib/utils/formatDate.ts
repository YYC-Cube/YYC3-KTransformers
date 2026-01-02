/**
 * YYC³ AI小语智能成长守护系统 - 日期格式化工具
 * @file formatDate.ts
 * @description 提供多语言日期格式化功能
 * @author YYC³团队 <admin@0379.email>
 * @version 1.0.0
 */

/**
 * 格式化日期为指定语言环境的字符串
 * @param date - 要格式化的日期
 * @param locale - 语言环境代码，默认为 'zh-CN'
 * @param options - 日期格式化选项
 * @returns 格式化后的日期字符串
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  locale: string = 'zh-CN',
  options?: Intl.DateTimeFormatOptions
): string {
  // 处理 null 或 undefined
  if (date === null || date === undefined) {
    return '--';
  }

  // 将输入转换为 Date 对象
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '--';
  }

  // 默认格式化选项
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  // 合并用户提供的选项
  const formatOptions = { ...defaultOptions, ...options };

  // 使用 Intl.DateTimeFormat 进行格式化
  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

/**
 * 格式化日期为相对时间（如：3天前、1小时前）
 * @param date - 要格式化的日期
 * @param locale - 语言环境代码，默认为 'zh-CN'
 * @returns 相对时间字符串
 */
export function formatRelativeTime(
  date: Date | string | number | null | undefined,
  locale: string = 'zh-CN'
): string {
  // 处理 null 或 undefined
  if (date === null || date === undefined) {
    return '--';
  }

  // 将输入转换为 Date 对象
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;

  // 检查日期是否有效
  if (isNaN(dateObj.getTime())) {
    return '--';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  // 定义时间单位
  const timeUnits = [
    { name: 'year', seconds: 31536000 },
    { name: 'month', seconds: 2592000 },
    { name: 'day', seconds: 86400 },
    { name: 'hour', seconds: 3600 },
    { name: 'minute', seconds: 60 },
    { name: 'second', seconds: 1 },
  ];

  // 找到最合适的时间单位
  for (const unit of timeUnits) {
    const value = Math.floor(diffInSeconds / unit.seconds);
    if (value >= 1) {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      return rtf.format(-value, unit.name as Intl.RelativeTimeFormatUnit);
    }
  }

  // 如果差值小于1秒，返回"刚刚"
  return locale === 'zh-CN' ? '刚刚' : 'just now';
}

/**
 * 格式化日期为短日期格式（如：2024/01/01）
 * @param date - 要格式化的日期
 * @param locale - 语言环境代码，默认为 'zh-CN'
 * @returns 短日期字符串
 */
export function formatShortDate(
  date: Date | string | number | null | undefined,
  locale: string = 'zh-CN'
): string {
  // 处理 null 或 undefined
  if (date === null || date === undefined) {
    return '--';
  }

  return formatDate(date, locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

/**
 * 格式化日期为带时间的格式（如：2024年1月1日 14:30）
 * @param date - 要格式化的日期
 * @param locale - 语言环境代码，默认为 'zh-CN'
 * @returns 带时间的日期字符串
 */
export function formatDateTime(
  date: Date | string | number | null | undefined,
  locale: string = 'zh-CN'
): string {
  // 处理 null 或 undefined
  if (date === null || date === undefined) {
    return '--';
  }

  return formatDate(date, locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}