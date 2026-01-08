/**
 * CPUレベル選択コンポーネント
 */

import React from 'react';
import { CPULevel } from '@/types/game';
import { useGameStore } from '@/store/gameStore';
import { theme } from '@/theme/theme';

export const CPULevelSelector: React.FC = () => {
  const { cpuLevel, setCPULevel, gameOver } = useGameStore();

  const levels = [
    { value: CPULevel.EASY, label: '簡単', description: 'ランダムに手を選びます' },
    { value: CPULevel.MEDIUM, label: '中級', description: '少し考えて手を選びます' },
    { value: CPULevel.HARD, label: '上級', description: 'より高度な判断をします' },
  ];

  return (
    <div
      className="p-4 rounded-lg mb-4"
      style={{
        backgroundColor: theme.colors.ui.surface,
        border: `2px solid ${theme.colors.ui.secondary}`,
      }}
    >
      <h3
        className="mb-3 font-semibold"
        style={{
          fontSize: theme.fonts.size.lg,
          color: theme.colors.ui.primary,
        }}
      >
        CPUレベル
      </h3>
      <div className="flex flex-col sm:flex-row gap-3">
        {levels.map((level) => (
          <button
            key={level.value}
            onClick={() => !gameOver && setCPULevel(level.value)}
            disabled={gameOver}
            className={`
              flex-1 px-4 py-3 rounded-lg font-semibold transition-all
              ${cpuLevel === level.value ? '' : 'hover:opacity-90'}
              ${gameOver ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
            style={{
              backgroundColor:
                cpuLevel === level.value
                  ? theme.colors.ui.primary
                  : theme.colors.ui.secondary,
              color: theme.colors.ui.text.inverse,
              fontSize: theme.fonts.size.base,
              border:
                cpuLevel === level.value
                  ? `3px solid ${theme.colors.ui.accent}`
                  : `2px solid ${theme.colors.ui.secondary}`,
            }}
          >
            <div className="font-bold mb-1">{level.label}</div>
            <div
              style={{
                fontSize: theme.fonts.size.xs,
                opacity: 0.9,
              }}
            >
              {level.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

