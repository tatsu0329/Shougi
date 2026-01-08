/**
 * 成り選択モーダルコンポーネント
 */

import React from 'react';
import { theme } from '@/theme/theme';

interface PromotionModalProps {
  isOpen: boolean;
  onPromote: () => void;
  onNotPromote: () => void;
  mustPromote: boolean;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  isOpen,
  onPromote,
  onNotPromote,
  mustPromote,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={mustPromote ? undefined : onNotPromote}
    >
      <div
        className="relative w-full max-w-md rounded-lg shadow-xl"
        style={{
          backgroundColor: theme.colors.ui.surface,
          padding: theme.spacing.xl,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="mb-4 text-center font-bold"
          style={{
            fontSize: theme.fonts.size['2xl'],
            color: theme.colors.ui.primary,
            fontWeight: theme.fonts.weight.bold,
          }}
        >
          {mustPromote ? '成ります' : '成りますか？'}
        </h3>

        {mustPromote && (
          <p
            className="mb-4 text-center"
            style={{
              fontSize: theme.fonts.size.sm,
              color: theme.colors.ui.text.secondary,
            }}
          >
            この駒は成らないと次に動けなくなるため、必ず成ります
          </p>
        )}

        <div className="flex gap-4">
          {!mustPromote && (
            <button
              onClick={onNotPromote}
              className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
              style={{
                backgroundColor: theme.colors.ui.secondary,
                color: theme.colors.ui.text.inverse,
                fontSize: theme.fonts.size.base,
              }}
            >
              成らない
            </button>
          )}
          <button
            onClick={onPromote}
            className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.colors.ui.primary,
              color: theme.colors.ui.text.inverse,
              fontSize: theme.fonts.size.base,
            }}
          >
            成る
          </button>
        </div>
      </div>
    </div>
  );
};

