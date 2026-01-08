/**
 * 移動の合法性検証
 */

import {
  Board,
  Hand,
  Move,
  PieceType,
  Player,
  Position,
  HandPieceType,
  PromotedPieceType,
} from '@/types/game';
import { getPossibleMoves, isInCheck, makeMove, findKing, isSamePosition } from '@/utils/gameLogic';

// 移動が合法かどうかを検証
export function isValidMove(
  board: Board,
  move: Move,
  playerHand: Hand,
  enemyHand: Hand,
  currentPlayer: Player
): boolean {
  // 持ち駒から打つ場合
  if (move.from === 'hand') {
    return isValidDrop(board, move, playerHand, enemyHand, currentPlayer);
  }

  // 盤上の駒を動かす場合
  return isValidBoardMove(board, move, playerHand, enemyHand, currentPlayer);
}

// 持ち駒を打つ場合の合法性チェック
function isValidDrop(
  board: Board,
  move: Move,
  playerHand: Hand,
  enemyHand: Hand,
  currentPlayer: Player
): boolean {
  const hand = currentPlayer === Player.PLAYER ? playerHand : enemyHand;
  const pieceType = move.piece.type as HandPieceType;

  // 1. 持ち駒を持っているか
  if (hand[pieceType] <= 0) {
    return false;
  }

  // 2. 打つ場所が空いているか
  if (board[move.to.row][move.to.col]) {
    return false;
  }

  // 3. 歩・香・桂の打ち込み制限
  const isPlayer = currentPlayer === Player.PLAYER;
  if (pieceType === PieceType.PAWN) {
    // 最前段には打てない
    if (isPlayer && move.to.row === 0) return false;
    if (!isPlayer && move.to.row === 8) return false;
    // 二歩禁止
    if (hasPawnInColumn(board, move.to.col, currentPlayer)) {
      return false;
    }
    // 打ち歩詰め禁止
    if (wouldBeDropPawnMate(board, move, playerHand, enemyHand, currentPlayer)) {
      return false;
    }
  }
  if (pieceType === PieceType.LANCE) {
    // 最前段には打てない
    if (isPlayer && move.to.row === 0) return false;
    if (!isPlayer && move.to.row === 8) return false;
  }
  if (pieceType === PieceType.KNIGHT) {
    // 最前段とその1つ手前の段には打てない
    if (isPlayer && move.to.row <= 1) return false;
    if (!isPlayer && move.to.row >= 7) return false;
  }

  return true;
}

// 盤上の駒を動かす場合の合法性チェック
function isValidBoardMove(
  board: Board,
  move: Move,
  playerHand: Hand,
  enemyHand: Hand,
  currentPlayer: Player
): boolean {
  // move.fromが'hand'の場合はこの関数では処理しない
  if (move.from === 'hand') {
    return false;
  }

  // 1. 移動元に駒があるか
  if (!board[move.from.row] || !board[move.from.row][move.from.col]) {
    return false;
  }

  const piece = board[move.from.row][move.from.col];
  if (!piece || piece.player !== currentPlayer) {
    return false;
  }

  // 2. 移動先が可能な移動先に含まれているか
  const possibleMoves = getPossibleMoves(
    board,
    move.from,
    currentPlayer === Player.PLAYER ? playerHand : enemyHand,
    currentPlayer
  );

  if (!possibleMoves.some(pos => isSamePosition(pos, move.to))) {
    return false;
  }

  // 3. 移動後に自分の王が王手にならないか（自殺手の禁止）
  const { board: newBoard } = makeMove(board, move, playerHand, enemyHand, currentPlayer);
  if (isInCheck(newBoard, currentPlayer)) {
    return false;
  }

  return true;
}

// 同じ筋に歩があるかチェック（二歩禁止）
function hasPawnInColumn(board: Board, col: number, player: Player): boolean {
  for (let row = 0; row < 9; row++) {
    const piece = board[row][col];
    if (
      piece &&
      piece.player === player &&
      (piece.type === PieceType.PAWN || piece.type === PromotedPieceType.PRO_PAWN)
    ) {
      return true;
    }
  }
  return false;
}

// 打ち歩詰めかどうかをチェック
function wouldBeDropPawnMate(
  board: Board,
  move: Move,
  playerHand: Hand,
  enemyHand: Hand,
  currentPlayer: Player
): boolean {
  // 移動をシミュレート
  const { board: newBoard } = makeMove(board, move, playerHand, enemyHand, currentPlayer);

  const enemy = currentPlayer === Player.PLAYER ? Player.ENEMY : Player.PLAYER;

  // 相手が王手されているか
  if (!isInCheck(newBoard, enemy)) {
    return false;
  }

  // 相手が王手を回避できるかチェック
  const enemyHandForCheck = currentPlayer === Player.PLAYER ? enemyHand : playerHand;
  const playerHandForCheck = currentPlayer === Player.PLAYER ? playerHand : enemyHand;

  // 全ての可能な手を試す
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = newBoard[row][col];
      if (piece && piece.player === enemy) {
        const moves = getPossibleMoves(newBoard, { row, col }, enemyHandForCheck, enemy);
        for (const moveTo of moves) {
          const testMove: Move = {
            from: { row, col },
            to: moveTo,
            piece,
          };
          const { board: testBoard } = makeMove(
            newBoard,
            testMove,
            playerHandForCheck,
            enemyHandForCheck,
            enemy
          );
          // 王手を回避できた
          if (!isInCheck(testBoard, enemy)) {
            return false;
          }
        }
      }
    }
  }

  // 持ち駒から打つ手もチェック
  // （簡略化のため、ここでは盤上の駒の移動のみチェック）
  // 実際には持ち駒から打つ手も全てチェックする必要がありますが、
  // 計算量が多いため、簡易版として実装

  // 王手を回避できない = 打ち歩詰め
  return true;
}

