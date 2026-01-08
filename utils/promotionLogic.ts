/**
 * 成りのロジック
 */

import {
  Board,
  Piece,
  PieceType,
  Player,
  Position,
  PromotedPieceType,
} from '@/types/game';

// 敵陣かどうかを判定
export function isEnemyTerritory(row: number, player: Player): boolean {
  if (player === Player.PLAYER) {
    return row <= 2; // 先手から見て0-2段目が敵陣
  } else {
    return row >= 6; // 後手から見て6-8段目が敵陣
  }
}

// 成り可能かどうかを判定
export function canPromote(
  piece: Piece,
  from: Position,
  to: Position,
  player: Player
): boolean {
  // 既に成っている駒は成れない
  if (piece.promoted) {
    return false;
  }

  // 王と金は成れない
  if (piece.type === PieceType.KING || piece.type === PieceType.GOLD) {
    return false;
  }

  // 敵陣に入る・動く・出るときに成れる
  const fromInEnemyTerritory = isEnemyTerritory(from.row, player);
  const toInEnemyTerritory = isEnemyTerritory(to.row, player);

  return fromInEnemyTerritory || toInEnemyTerritory;
}

// 成りが必須かどうかを判定（桂・香・歩の場合）
export function mustPromote(
  piece: Piece,
  to: Position,
  player: Player
): boolean {
  if (piece.promoted) {
    return false;
  }

  const isPlayer = player === Player.PLAYER;

  // 桂：成らないと次に動けなくなる段に入った場合、必ず成る
  if (piece.type === PieceType.KNIGHT) {
    if (isPlayer && to.row <= 1) {
      return true; // 先手なら0-1段目
    }
    if (!isPlayer && to.row >= 7) {
      return true; // 後手なら7-8段目
    }
  }

  // 香：成らないと次に動けなくなる段に入った場合、必ず成る
  if (piece.type === PieceType.LANCE) {
    if (isPlayer && to.row === 0) {
      return true; // 先手なら0段目
    }
    if (!isPlayer && to.row === 8) {
      return true; // 後手なら8段目
    }
  }

  // 歩：成らないと次に動けなくなる段に入った場合、必ず成る
  if (piece.type === PieceType.PAWN) {
    if (isPlayer && to.row === 0) {
      return true; // 先手なら0段目
    }
    if (!isPlayer && to.row === 8) {
      return true; // 後手なら8段目
    }
  }

  return false;
}

