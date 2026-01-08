/**
 * 持ち駒コンポーネント
 */

import React from 'react';
import { Hand as HandType, HandPieceType, PieceType, Player } from '@/types/game';
import { Piece } from './Piece';
import { useGameStore } from '@/store/gameStore';
import { theme } from '@/theme/theme';
import { pieceNames } from '@/utils/pieceNames';

interface HandProps {
  hand: HandType;
  player: Player;
}

export const Hand: React.FC<HandProps> = ({ hand, player }) => {
  const { selectHandPiece, selectedHandPiece, currentPlayer } = useGameStore();
  const isPlayer = player === Player.PLAYER;
  const isActive = currentPlayer === player;

  const handPieces: Array<{ type: HandPieceType; count: number }> = [
    { type: PieceType.ROOK as HandPieceType, count: hand[PieceType.ROOK] },
    { type: PieceType.BISHOP as HandPieceType, count: hand[PieceType.BISHOP] },
    { type: PieceType.GOLD as HandPieceType, count: hand[PieceType.GOLD] },
    { type: PieceType.SILVER as HandPieceType, count: hand[PieceType.SILVER] },
    { type: PieceType.KNIGHT as HandPieceType, count: hand[PieceType.KNIGHT] },
    { type: PieceType.LANCE as HandPieceType, count: hand[PieceType.LANCE] },
    { type: PieceType.PAWN as HandPieceType, count: hand[PieceType.PAWN] },
  ].filter(item => item.count > 0);

  if (handPieces.length === 0) {
    return (
      <div
        className="p-4 rounded-lg text-center"
        style={{
          backgroundColor: theme.colors.ui.surface,
          minHeight: '100px',
        }}
      >
        <p style={{ color: theme.colors.ui.text.secondary, fontSize: theme.fonts.size.sm }}>
          持ち駒なし
        </p>
      </div>
    );
  }

  return (
    <div
      className="p-4 rounded-lg"
      style={{
        backgroundColor: theme.colors.ui.surface,
        border: `2px solid ${isActive ? theme.colors.ui.accent : theme.colors.ui.secondary}`,
        opacity: isActive ? 1 : 0.6,
      }}
    >
      <h3
        className="mb-2 font-semibold"
        style={{
          fontSize: theme.fonts.size.sm,
          color: theme.colors.ui.text.primary,
        }}
      >
        {isPlayer ? '先手の持ち駒' : '後手の持ち駒'}
      </h3>
      <div className="flex flex-wrap gap-2">
        {handPieces.map(({ type, count }) => {
          const piece = {
            type,
            player,
            promoted: false,
          };
          const selected = selectedHandPiece === type && isActive;
          const name = pieceNames[type][isPlayer ? 'player' : 'enemy'];

          return (
            <div
              key={type}
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => isActive && selectHandPiece(type)}
            >
              <Piece
                piece={piece}
                size="sm"
                selected={selected}
              />
              <span
                className="font-bold"
                style={{
                  fontSize: theme.fonts.size.xs,
                  color: theme.colors.ui.text.primary,
                }}
              >
                {count > 1 ? count : ''}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

