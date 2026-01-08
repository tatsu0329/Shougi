/**
 * 将棋盤コンポーネント
 */

import React from 'react';
import { Board as BoardType, Position, Player } from '@/types/game';
import { Piece } from './Piece';
import { useGameStore } from '@/store/gameStore';
import { theme } from '@/theme/theme';
import { isSamePosition } from '@/utils/gameLogic';

interface BoardProps {
  board: BoardType;
}

export const Board: React.FC<BoardProps> = ({ board }) => {
  const { selectPosition, selectedPosition, possibleMoves, currentPlayer } = useGameStore();

  const handleCellClick = (position: Position) => {
    if (currentPlayer === Player.PLAYER) {
      selectPosition(position);
    }
  };

  const isSelected = (position: Position): boolean => {
    return selectedPosition !== null && isSamePosition(selectedPosition, position);
  };

  const isPossibleMove = (position: Position): boolean => {
    return possibleMoves.some(move => isSamePosition(move, position));
  };

  return (
    <div
      className="inline-block p-4"
      style={{
        backgroundColor: theme.colors.board.light,
        border: `3px solid ${theme.colors.board.border}`,
        borderRadius: theme.borderRadius.lg,
      }}
    >
      <div className="grid grid-cols-9 gap-0">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const position: Position = { row: rowIndex, col: colIndex };
            const selected = isSelected(position);
            const possible = isPossibleMove(position);
            const isLight = (rowIndex + colIndex) % 2 === 0;

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                  flex items-center justify-center
                  relative
                  cursor-pointer
                  transition-all
                  ${possible ? 'hover:bg-green-200' : ''}
                `}
                style={{
                  backgroundColor: selected
                    ? theme.colors.piece.selected
                    : possible
                    ? theme.colors.piece.highlight
                    : isLight
                    ? theme.colors.board.light
                    : theme.colors.board.dark,
                  border: `1px solid ${theme.colors.board.grid}`,
                }}
                onClick={() => handleCellClick(position)}
              >
                {cell && (
                  <Piece
                    piece={cell}
                    size="md"
                    selected={selected}
                  />
                )}
                {possible && !cell && (
                  <div
                    className="absolute w-3 h-3 rounded-full"
                    style={{ backgroundColor: theme.colors.piece.highlight }}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

