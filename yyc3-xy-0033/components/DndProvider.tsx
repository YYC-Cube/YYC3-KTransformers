'use client';

import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';

interface DndProviderWrapperProps {
  children: React.ReactNode;
}

const DndProviderWrapper: React.FC<DndProviderWrapperProps> = ({ children }) => {
  const isTouchDevice = typeof window !== 'undefined' && 'ontouchstart' in window;

  return (
    <DndProvider backend={isTouchDevice ? TouchBackend : HTML5Backend}>
      {children}
    </DndProvider>
  );
};

export default DndProviderWrapper;
