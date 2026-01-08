/**
 * 駒コンポーネント
 */

import React from 'react';
import { Piece as PieceType, Player } from '@/types/game';
import { pieceNames } from '@/utils/pieceNames';
import { theme } from '@/theme/theme';

interface PieceProps {
  piece: PieceType;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  onClick?: () => void;
}

export const Piece: React.FC<PieceProps> = ({
  piece,
  size = 'md',
  selected = false,
  onClick,
}) => {
  const isPlayer = piece.player === Player.PLAYER;
  const name = pieceNames[piece.type][isPlayer ? 'player' : 'enemy'];

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-lg',
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        flex items-center justify-center
        rounded-md
        font-bold
        cursor-pointer
        transition-all
        ${isPlayer ? 'bg-white text-black' : 'bg-black text-white'}
        ${selected ? 'ring-4 ring-yellow-400' : ''}
        ${onClick ? 'hover:scale-110' : ''}
        shadow-md
      `}
      style={{
        backgroundColor: isPlayer ? theme.colors.piece.player : theme.colors.piece.enemy,
        color: isPlayer ? theme.colors.piece.enemy : theme.colors.piece.player,
        borderColor: theme.colors.board.border,
        borderWidth: '2px',
        boxShadow: selected ? `0 0 0 4px ${theme.colors.piece.selected}` : theme.shadows.md,
      }}
      onClick={onClick}
    >
      {name}
    </div>
  );
};

