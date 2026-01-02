/**
 * next-intl 兼容性垫片
 * 暂时解决模块缺失问题
 */

export const useTranslations = (key: string) => {
  return (t: string) => t;
};

export const useLocale = () => 'zh';

export default {
  useTranslations,
  useLocale,
};