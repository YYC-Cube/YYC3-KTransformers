/**
 * @file ClientWrapper.tsx
 * @description 客户端组件包装器，用于在服务端渲染的应用中正确渲染客户端组件
 * @module components/ClientWrapper
 * @author YYC
 * @version 1.0.0
 * @created 2024-12-10
 * @updated 2024-12-10
 */

'use client';

import React from 'react';
import IntelligentAIWidget from '@/components/ai-widget/IntelligentAIWidget';

const ClientWrapper: React.FC = () => {
  return <IntelligentAIWidget />;
};

export default ClientWrapper;