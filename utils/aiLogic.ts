/**
 * CPU AIロジック
 */

import {
  Board,
  Hand,
  Move,
  Piece,
  PieceType,
  Player,
  Position,
  CPULevel,
  PromotedPieceType,
} from '@/types/game';
import { getPossibleMoves, isInCheck, makeMove, findKing } from '@/utils/gameLogic';
import { canPromote, mustPromote } from '@/utils/promotionLogic';

interface AIMove {
  from: Position | 'hand';
  to: Position;
  piece: Piece;
  promote?: boolean;
  score?: number;
}

// 全ての可能な手を取得
function getAllPossibleMoves(
  board: Board,
  hand: Hand,
  player: Player
): AIMove[] {
  const moves: AIMove[] = [];

  // 盤上の駒の移動
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.player === player) {
        const possibleMoves = getPossibleMoves(board, { row, col }, hand, player);
        for (const moveTo of possibleMoves) {
          const mustPromotePiece = mustPromote(piece, moveTo, player);
          const canPromotePiece = canPromote(piece, { row, col }, moveTo, player);
          
          // 成りが必須の場合
          if (mustPromotePiece) {
            moves.push({
              from: { row, col },
              to: moveTo,
              piece,
              promote: true,
            });
          } else if (canPromotePiece) {
            // 成り可能な場合、成る手と成らない手の両方を追加
            moves.push({
              from: { row, col },
              to: moveTo,
              piece,
              promote: true,
            });
            moves.push({
              from: { row, col },
              to: moveTo,
              piece,
              promote: false,
            });
          } else {
            // 成りできない場合
            moves.push({
              from: { row, col },
              to: moveTo,
              piece,
              promote: false,
            });
          }
        }
      }
    }
  }

  // 持ち駒から打つ
  Object.entries(hand).forEach(([type, count]) => {
    if (count > 0) {
      const pieceType = type as PieceType;
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (!board[row][col]) {
            // 歩・香・桂の打ち込み制限
            if (pieceType === PieceType.PAWN && row === (player === Player.PLAYER ? 0 : 8)) continue;
            if (pieceType === PieceType.LANCE && row === (player === Player.PLAYER ? 0 : 8)) continue;
            if (pieceType === PieceType.KNIGHT) {
              if (player === Player.PLAYER && row <= 1) continue;
              if (player === Player.ENEMY && row >= 7) continue;
            }

            moves.push({
              from: 'hand',
              to: { row, col },
              piece: {
                type: pieceType,
                player,
                promoted: false,
              },
            });
          }
        }
      }
    }
  });

  return moves;
}

// 駒の基本価値
function getPieceValue(pieceType: PieceType | PromotedPieceType): number {
  switch (pieceType) {
    case PieceType.KING:
      return 10000;
    case PieceType.ROOK:
      return 100;
    case PieceType.BISHOP:
      return 100;
    case PieceType.GOLD:
      return 60;
    case PieceType.SILVER:
      return 50;
    case PieceType.KNIGHT:
      return 40;
    case PieceType.LANCE:
      return 40;
    case PieceType.PAWN:
      return 20;
    case PromotedPieceType.DRAGON:
      return 120;
    case PromotedPieceType.HORSE:
      return 120;
    case PromotedPieceType.PRO_SILVER:
      return 55;
    case PromotedPieceType.PRO_KNIGHT:
      return 45;
    case PromotedPieceType.PRO_LANCE:
      return 45;
    case PromotedPieceType.PRO_PAWN:
      return 30;
    default:
      return 0;
  }
}

// 局面評価
function evaluatePosition(
  board: Board,
  playerHand: Hand,
  enemyHand: Hand,
  player: Player
): number {
  let score = 0;
  const isPlayer = player === Player.PLAYER;

  // 盤上の駒の価値
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece) {
        const pieceValue = getPieceValue(piece.type);
        if (piece.player === player) {
          score += pieceValue;
          // 敵陣にいる駒は追加価値
          if (isPlayer && row <= 2) score += 5;
          if (!isPlayer && row >= 6) score += 5;
        } else {
          score -= pieceValue;
          // 敵陣にいる敵の駒は追加ペナルティ
          if (isPlayer && row <= 2) score -= 5;
          if (!isPlayer && row >= 6) score -= 5;
        }
      }
    }
  }

  // 持ち駒の価値
  Object.entries(playerHand).forEach(([type, count]) => {
    const value = getPieceValue(type as PieceType);
    score += value * count * 0.8; // 持ち駒は少し低めに評価
  });

  Object.entries(enemyHand).forEach(([type, count]) => {
    const value = getPieceValue(type as PieceType);
    score -= value * count * 0.8;
  });

  // 王の安全性
  const myKing = findKing(board, player);
  const enemyKing = findKing(board, player === Player.PLAYER ? Player.ENEMY : Player.PLAYER);
  
  if (myKing) {
    if (!isInCheck(board, player)) {
      score += 50; // 王が安全
    } else {
      score -= 100; // 王手されている
    }
  }

  if (enemyKing) {
    if (isInCheck(board, player === Player.PLAYER ? Player.ENEMY : Player.PLAYER)) {
      score += 200; // 相手が王手されている
    }
  }

  return score;
}

// 手の評価（スコア計算）
function evaluateMove(
  move: AIMove,
  board: Board,
  playerHand: Hand,
  enemyHand: Hand,
  player: Player
): number {
  // 移動をシミュレート
  const { board: newBoard, playerHand: newPlayerHand, enemyHand: newEnemyHand } = makeMove(
    board,
    move,
    playerHand,
    enemyHand,
    player
  );

  // 1. 相手の王を取れる場合（詰み）
  const enemyKing = findKing(newBoard, player === Player.PLAYER ? Player.ENEMY : Player.PLAYER);
  if (!enemyKing) {
    return 50000; // 詰み（最高スコア）
  }

  // 2. 自分の王が取られる場合（負け）
  const myKing = findKing(newBoard, player);
  if (!myKing) {
    return -50000; // 負け（最低スコア）
  }

  // 局面評価
  let score = evaluatePosition(newBoard, newPlayerHand, newEnemyHand, player);

  // 3. 王手をかける（追加ボーナス）
  if (isInCheck(newBoard, player === Player.PLAYER ? Player.ENEMY : Player.PLAYER)) {
    score += 300;
  }

  // 4. 相手の駒を取る（追加ボーナス）
  if (move.from !== 'hand') {
    const targetPiece = board[move.to.row][move.to.col];
    if (targetPiece && targetPiece.player !== player) {
      const capturedValue = getPieceValue(targetPiece.type);
      score += capturedValue * 0.5; // 取った駒の価値の50%を追加
    }
  }

  // 5. 成り
  if (move.promote) {
    score += 20; // 成りによる追加価値
  }

  // 6. 敵陣に進む（成りの可能性）
  const isPlayer = player === Player.PLAYER;
  if (isPlayer && move.to.row <= 2) {
    score += 10;
  } else if (!isPlayer && move.to.row >= 6) {
    score += 10;
  }

  // 7. 王の周りを固める（守備）
  if (myKing) {
    const kingRow = myKing.row;
    const kingCol = myKing.col;
    const distance = Math.abs(move.to.row - kingRow) + Math.abs(move.to.col - kingCol);
    if (distance <= 2) {
      score += 5; // 王の近くに駒を配置
    }
  }

  // 8. 相手の王に近づく（攻撃）
  if (enemyKing) {
    const kingRow = enemyKing.row;
    const kingCol = enemyKing.col;
    const distance = Math.abs(move.to.row - kingRow) + Math.abs(move.to.col - kingCol);
    if (distance <= 3) {
      score += 8; // 相手の王に近づく
    }
  }

  return score;
}

// 簡単レベル：ランダムに手を選ぶ
export function getEasyMove(
  board: Board,
  hand: Hand,
  playerHand: Hand,
  enemyHand: Hand,
  player: Player
): AIMove | null {
  const moves = getAllPossibleMoves(board, hand, player);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

// 中級レベル：1手先読み + 評価関数
export function getMediumMove(
  board: Board,
  hand: Hand,
  playerHand: Hand,
  enemyHand: Hand,
  player: Player
): AIMove | null {
  const moves = getAllPossibleMoves(board, hand, player);
  if (moves.length === 0) return null;

  // 各手を評価
  const scoredMoves = moves.map(move => {
    const baseScore = evaluateMove(move, board, playerHand, enemyHand, player);
    
    // 1手先読み（簡易版）
    const { board: newBoard, playerHand: newPlayerHand, enemyHand: newEnemyHand } = makeMove(
      board,
      move,
      playerHand,
      enemyHand,
      player
    );
    
    // 相手の最良の手を想定
    const enemyMoves = getAllPossibleMoves(
      newBoard,
      player === Player.PLAYER ? enemyHand : playerHand,
      player === Player.PLAYER ? Player.ENEMY : Player.PLAYER
    );
    
    let worstEnemyScore = Infinity;
    for (const enemyMove of enemyMoves.slice(0, 5)) { // 上位5手のみ
      const { board: afterEnemyBoard } = makeMove(
        newBoard,
        enemyMove,
        newPlayerHand,
        newEnemyHand,
        player === Player.PLAYER ? Player.ENEMY : Player.PLAYER
      );
      const positionScore = evaluatePosition(
        afterEnemyBoard,
        newPlayerHand,
        newEnemyHand,
        player
      );
      worstEnemyScore = Math.min(worstEnemyScore, positionScore);
    }
    
    return {
      ...move,
      score: baseScore - (worstEnemyScore === Infinity ? 0 : worstEnemyScore * 0.3),
    };
  });

  // スコア順にソート
  scoredMoves.sort((a, b) => (b.score || 0) - (a.score || 0));

  // 上位20%からランダムに選ぶ
  const topCount = Math.max(1, Math.floor(scoredMoves.length * 0.2));
  const topMoves = scoredMoves.slice(0, topCount);
  return topMoves[Math.floor(Math.random() * topMoves.length)];
}

// 上級レベル：2-3手先読み + 高度な評価
export function getHardMove(
  board: Board,
  hand: Hand,
  playerHand: Hand,
  enemyHand: Hand,
  player: Player
): AIMove | null {
  const moves = getAllPossibleMoves(board, hand, player);
  if (moves.length === 0) return null;

  // 各手を評価（2手先読み）
  const scoredMoves = moves.map(move => {
    const baseScore = evaluateMove(move, board, playerHand, enemyHand, player);
    
    // 2手先読み
    const { board: newBoard, playerHand: newPlayerHand, enemyHand: newEnemyHand } = makeMove(
      board,
      move,
      playerHand,
      enemyHand,
      player
    );

    // 相手の最良の手を想定
    const enemyMoves = getAllPossibleMoves(
      newBoard,
      player === Player.PLAYER ? enemyHand : playerHand,
      player === Player.PLAYER ? Player.ENEMY : Player.PLAYER
    );

    if (enemyMoves.length === 0) {
      // 相手に手がない = 詰み
      return { ...move, score: 50000 };
    }

    let worstScore = Infinity;
    for (const enemyMove of enemyMoves.slice(0, 8)) { // 上位8手を評価
      const { board: afterEnemyBoard, playerHand: afterEnemyPlayerHand, enemyHand: afterEnemyEnemyHand } = makeMove(
        newBoard,
        enemyMove,
        newPlayerHand,
        newEnemyHand,
        player === Player.PLAYER ? Player.ENEMY : Player.PLAYER
      );

      // さらに1手先を読む
      const myNextMoves = getAllPossibleMoves(
        afterEnemyBoard,
        player === Player.PLAYER ? afterEnemyPlayerHand : afterEnemyEnemyHand,
        player
      );

      let bestNextScore = -Infinity;
      for (const nextMove of myNextMoves.slice(0, 5)) {
        const { board: finalBoard } = makeMove(
          afterEnemyBoard,
          nextMove,
          afterEnemyPlayerHand,
          afterEnemyEnemyHand,
          player
        );
        const finalScore = evaluatePosition(
          finalBoard,
          afterEnemyPlayerHand,
          afterEnemyEnemyHand,
          player
        );
        bestNextScore = Math.max(bestNextScore, finalScore);
      }

      worstScore = Math.min(worstScore, bestNextScore === -Infinity ? evaluatePosition(afterEnemyBoard, afterEnemyPlayerHand, afterEnemyEnemyHand, player) : bestNextScore);
    }

    return {
      ...move,
      score: baseScore - (worstScore === Infinity ? 0 : worstScore * 0.4),
    };
  });

  // スコア順にソート
  scoredMoves.sort((a, b) => (b.score || 0) - (a.score || 0));

  // 最良の手を選ぶ（5%の確率で2-3番目を選ぶ）
  if (Math.random() < 0.05 && scoredMoves.length > 2) {
    const randomIndex = Math.floor(Math.random() * 2) + 1;
    return scoredMoves[randomIndex];
  }
  
  // 同点の場合は最初の手を選ぶ
  return scoredMoves[0];
}

// レベルに応じたAIを取得
export function getAIMove(
  level: CPULevel,
  board: Board,
  hand: Hand,
  playerHand: Hand,
  enemyHand: Hand,
  player: Player
): AIMove | null {
  switch (level) {
    case CPULevel.EASY:
      return getEasyMove(board, hand, playerHand, enemyHand, player);
    case CPULevel.MEDIUM:
      return getMediumMove(board, hand, playerHand, enemyHand, player);
    case CPULevel.HARD:
      return getHardMove(board, hand, playerHand, enemyHand, player);
    default:
      return getEasyMove(board, hand, playerHand, enemyHand, player);
  }
}

