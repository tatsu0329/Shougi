'use client';

import React, { useState } from 'react';
import { Board } from '@/components/Board';
import { Hand } from '@/components/Hand';
import { GameStatus } from '@/components/GameStatus';
import { RulesModal } from '@/components/RulesModal';
import { CPULevelSelector } from '@/components/CPULevelSelector';
import { PromotionModal } from '@/components/PromotionModal';
import { useGameStore } from '@/store/gameStore';
import { Player } from '@/types/game';
import { theme } from '@/theme/theme';
import { mustPromote } from '@/utils/promotionLogic';

export default function Home() {
  const { board, playerHand, enemyHand, pendingMove, showPromotionModal, confirmMove } = useGameStore();
  const [isRulesOpen, setIsRulesOpen] = useState(false);

  // 成りが必須かどうかを判定
  const mustPromotePiece = pendingMove
    ? (() => {
        const piece = board[pendingMove.from.row]?.[pendingMove.from.col];
        return piece ? mustPromote(piece, pendingMove.to, Player.PLAYER) : false;
      })()
    : false;

  return (
    <main
      className="min-h-screen p-4"
      style={{
        backgroundColor: theme.colors.ui.background,
        fontFamily: theme.fonts.family.primary,
      }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <h1
              className="text-3xl sm:text-4xl font-bold flex-1"
              style={{
                color: theme.colors.ui.primary,
                fontSize: theme.fonts.size['4xl'],
                fontWeight: theme.fonts.weight.bold,
              }}
            >
              将棋
            </h1>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setIsRulesOpen(true)}
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all hover:opacity-90"
                style={{
                  backgroundColor: theme.colors.ui.secondary,
                  color: theme.colors.ui.text.inverse,
                  fontSize: theme.fonts.size.sm,
                }}
              >
                ルール
              </button>
            </div>
          </div>
          <p
            style={{
              color: theme.colors.ui.text.secondary,
              fontSize: theme.fonts.size.base,
            }}
          >
            CPUとの対戦
          </p>
        </header>

        <CPULevelSelector />

        <GameStatus />

        <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
          {/* 後手の持ち駒 */}
          <div className="w-full lg:w-auto">
            <Hand hand={enemyHand} player={Player.ENEMY} />
          </div>

          {/* 将棋盤 */}
          <div className="flex-shrink-0">
            <Board board={board} />
          </div>

          {/* 先手の持ち駒 */}
          <div className="w-full lg:w-auto">
            <Hand hand={playerHand} player={Player.PLAYER} />
          </div>
        </div>

        <div className="mt-6 text-center">
          <p
            style={{
              color: theme.colors.ui.text.secondary,
              fontSize: theme.fonts.size.sm,
            }}
          >
            盤上の駒をクリックして選択し、移動先をクリックしてください。
            <br />
            持ち駒をクリックして選択し、盤面に打つことができます。
          </p>
        </div>
      </div>

      {/* ルール説明モーダル */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* 成り選択モーダル */}
      <PromotionModal
        isOpen={showPromotionModal}
        onPromote={() => confirmMove(true)}
        onNotPromote={() => confirmMove(false)}
        mustPromote={mustPromotePiece}
      />
    </main>
  );
}

