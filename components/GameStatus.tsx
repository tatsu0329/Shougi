/**
 * ゲーム状態表示コンポーネント
 */

import React from 'react';
import { useGameStore } from '@/store/gameStore';
import { Player } from '@/types/game';
import { theme } from '@/theme/theme';

export const GameStatus: React.FC = () => {
  const { currentPlayer, gameOver, winner, check, resetGame } = useGameStore();

  return (
    <div
      className="p-4 rounded-lg mb-4"
      style={{
        backgroundColor: theme.colors.ui.surface,
        border: `2px solid ${theme.colors.ui.secondary}`,
      }}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p
            className="font-semibold mb-1"
            style={{
              fontSize: theme.fonts.size.lg,
              color: theme.colors.ui.text.primary,
            }}
          >
            {gameOver
              ? winner === Player.PLAYER
                ? '🎉 あなたの勝ち！'
                : '😢 CPの勝ち！'
              : currentPlayer === Player.PLAYER
              ? 'あなたの手番'
              : 'CPの手番'}
          </p>
          {check && !gameOver && (
            <p
              style={{
                fontSize: theme.fonts.size.sm,
                color: theme.colors.ui.accent,
                fontWeight: theme.fonts.weight.bold,
              }}
            >
              ⚠️ 王手！
            </p>
          )}
        </div>
        <button
          onClick={resetGame}
          className="px-6 py-2 rounded-lg font-semibold transition-all hover:opacity-90"
          style={{
            backgroundColor: theme.colors.ui.primary,
            color: theme.colors.ui.text.inverse,
            fontSize: theme.fonts.size.base,
          }}
        >
          新しいゲーム
        </button>
      </div>
    </div>
  );
};

