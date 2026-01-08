/**
 * 将棋のゲームロジック
 */

import {
  Board,
  Cell,
  Hand,
  HandPieceType,
  Move,
  Piece,
  PieceType,
  Player,
  Position,
  PromotedPieceType,
  GameState,
} from '@/types/game';

// 初期盤面の作成
export function createInitialBoard(): Board {
  const board: Board = Array(9).fill(null).map(() => Array(9).fill(null));

  // 後手（上側）の配置
  board[0][0] = { type: PieceType.LANCE, player: Player.ENEMY, promoted: false };
  board[0][1] = { type: PieceType.KNIGHT, player: Player.ENEMY, promoted: false };
  board[0][2] = { type: PieceType.SILVER, player: Player.ENEMY, promoted: false };
  board[0][3] = { type: PieceType.GOLD, player: Player.ENEMY, promoted: false };
  board[0][4] = { type: PieceType.KING, player: Player.ENEMY, promoted: false };
  board[0][5] = { type: PieceType.GOLD, player: Player.ENEMY, promoted: false };
  board[0][6] = { type: PieceType.SILVER, player: Player.ENEMY, promoted: false };
  board[0][7] = { type: PieceType.KNIGHT, player: Player.ENEMY, promoted: false };
  board[0][8] = { type: PieceType.LANCE, player: Player.ENEMY, promoted: false };
  board[1][1] = { type: PieceType.ROOK, player: Player.ENEMY, promoted: false };
  board[1][7] = { type: PieceType.BISHOP, player: Player.ENEMY, promoted: false };
  board[2][0] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][1] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][2] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][3] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][4] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][5] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][6] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][7] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };
  board[2][8] = { type: PieceType.PAWN, player: Player.ENEMY, promoted: false };

  // 先手（下側）の配置
  board[6][0] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][1] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][2] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][3] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][4] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][5] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][6] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][7] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[6][8] = { type: PieceType.PAWN, player: Player.PLAYER, promoted: false };
  board[7][1] = { type: PieceType.BISHOP, player: Player.PLAYER, promoted: false };
  board[7][7] = { type: PieceType.ROOK, player: Player.PLAYER, promoted: false };
  board[8][0] = { type: PieceType.LANCE, player: Player.PLAYER, promoted: false };
  board[8][1] = { type: PieceType.KNIGHT, player: Player.PLAYER, promoted: false };
  board[8][2] = { type: PieceType.SILVER, player: Player.PLAYER, promoted: false };
  board[8][3] = { type: PieceType.GOLD, player: Player.PLAYER, promoted: false };
  board[8][4] = { type: PieceType.KING, player: Player.PLAYER, promoted: false };
  board[8][5] = { type: PieceType.GOLD, player: Player.PLAYER, promoted: false };
  board[8][6] = { type: PieceType.SILVER, player: Player.PLAYER, promoted: false };
  board[8][7] = { type: PieceType.KNIGHT, player: Player.PLAYER, promoted: false };
  board[8][8] = { type: PieceType.LANCE, player: Player.PLAYER, promoted: false };

  return board;
}

// 初期持ち駒
export function createInitialHand(): Hand {
  return {
    [PieceType.PAWN]: 0,
    [PieceType.LANCE]: 0,
    [PieceType.KNIGHT]: 0,
    [PieceType.SILVER]: 0,
    [PieceType.GOLD]: 0,
    [PieceType.BISHOP]: 0,
    [PieceType.ROOK]: 0,
  };
}

// 位置が盤面内かチェック
export function isValidPosition(pos: Position): boolean {
  return pos.row >= 0 && pos.row < 9 && pos.col >= 0 && pos.col < 9;
}

// 位置が同じかチェック
export function isSamePosition(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

// 可能な移動先を取得
export function getPossibleMoves(
  board: Board,
  position: Position,
  hand: Hand,
  currentPlayer: Player
): Position[] {
  const piece = board[position.row][position.col];
  if (!piece || piece.player !== currentPlayer) {
    return [];
  }

  const moves: Position[] = [];
  const directions = getMoveDirections(piece, position, currentPlayer);

  for (const dir of directions) {
    let newRow = position.row + dir.row;
    let newCol = position.col + dir.col;

    // 範囲チェック
    if (!isValidPosition({ row: newRow, col: newCol })) {
      continue;
    }

    // 移動可能な位置を追加
    const targetPiece = board[newRow][newCol];
    if (!targetPiece || targetPiece.player !== currentPlayer) {
      moves.push({ row: newRow, col: newCol });
    }
  }

  // 長距離移動の駒の処理
  const isPlayer = currentPlayer === Player.PLAYER;

  // 飛・龍の処理
  if (piece.type === PieceType.ROOK || piece.type === PromotedPieceType.DRAGON) {
    const rookDirections = [
      { row: -1, col: 0 }, { row: 1, col: 0 },
      { row: 0, col: -1 }, { row: 0, col: 1 }
    ];
    for (const dir of rookDirections) {
      for (let i = 1; i < 9; i++) {
        const newRow = position.row + dir.row * i;
        const newCol = position.col + dir.col * i;
        if (!isValidPosition({ row: newRow, col: newCol })) break;
        const targetPiece = board[newRow][newCol];
        if (targetPiece && targetPiece.player === currentPlayer) break;
        moves.push({ row: newRow, col: newCol });
        if (targetPiece) break;
      }
    }
    // 龍は王の動きも追加
    if (piece.type === PromotedPieceType.DRAGON) {
      const kingDirs = [
        { row: -1, col: -1 }, { row: -1, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 1 }
      ];
      for (const dir of kingDirs) {
        const newRow = position.row + dir.row;
        const newCol = position.col + dir.col;
        if (isValidPosition({ row: newRow, col: newCol })) {
          const targetPiece = board[newRow][newCol];
          if (!targetPiece || targetPiece.player !== currentPlayer) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
    }
  }

  // 角・馬の処理
  if (piece.type === PieceType.BISHOP || piece.type === PromotedPieceType.HORSE) {
    const bishopDirections = [
      { row: -1, col: -1 }, { row: -1, col: 1 },
      { row: 1, col: -1 }, { row: 1, col: 1 }
    ];
    for (const dir of bishopDirections) {
      for (let i = 1; i < 9; i++) {
        const newRow = position.row + dir.row * i;
        const newCol = position.col + dir.col * i;
        if (!isValidPosition({ row: newRow, col: newCol })) break;
        const targetPiece = board[newRow][newCol];
        if (targetPiece && targetPiece.player === currentPlayer) break;
        moves.push({ row: newRow, col: newCol });
        if (targetPiece) break;
      }
    }
    // 馬は王の動きも追加
    if (piece.type === PromotedPieceType.HORSE) {
      const kingDirs = [
        { row: -1, col: 0 }, { row: 1, col: 0 },
        { row: 0, col: -1 }, { row: 0, col: 1 }
      ];
      for (const dir of kingDirs) {
        const newRow = position.row + dir.row;
        const newCol = position.col + dir.col;
        if (isValidPosition({ row: newRow, col: newCol })) {
          const targetPiece = board[newRow][newCol];
          if (!targetPiece || targetPiece.player !== currentPlayer) {
            moves.push({ row: newRow, col: newCol });
          }
        }
      }
    }
  }

  // 香の処理
  if (piece.type === PieceType.LANCE) {
    const direction = isPlayer ? { row: -1, col: 0 } : { row: 1, col: 0 };
    for (let i = 1; i < 9; i++) {
      const newRow = position.row + direction.row * i;
      const newCol = position.col + direction.col * i;
      if (!isValidPosition({ row: newRow, col: newCol })) break;
      const targetPiece = board[newRow][newCol];
      if (targetPiece && targetPiece.player === currentPlayer) break;
      moves.push({ row: newRow, col: newCol });
      if (targetPiece) break;
    }
  }

  // 歩の処理
  if (piece.type === PieceType.PAWN) {
    const direction = isPlayer ? { row: -1, col: 0 } : { row: 1, col: 0 };
    const newRow = position.row + direction.row;
    const newCol = position.col + direction.col;
    if (isValidPosition({ row: newRow, col: newCol })) {
      const targetPiece = board[newRow][newCol];
      if (!targetPiece || targetPiece.player !== currentPlayer) {
        moves.push({ row: newRow, col: newCol });
      }
    }
  }

  return moves;
}

// 駒の移動方向を取得
function getMoveDirections(
  piece: Piece,
  position: Position,
  player: Player
): Array<{ row: number; col: number }> {
  const isPlayer = player === Player.PLAYER;
  const directions: Array<{ row: number; col: number }> = [];

  if (piece.promoted) {
    // 成り駒の移動
    switch (piece.type) {
      case PromotedPieceType.DRAGON:
        // 龍は飛の動き + 王の動き（既に処理済み）
        return [];
      case PromotedPieceType.HORSE:
        // 馬は角の動き + 王の動き（既に処理済み）
        return [];
      case PromotedPieceType.PRO_SILVER:
      case PromotedPieceType.PRO_KNIGHT:
      case PromotedPieceType.PRO_LANCE:
      case PromotedPieceType.PRO_PAWN:
        // 成り駒は金と同じ動き
        return getGoldDirections(isPlayer);
    }
  }

  switch (piece.type) {
    case PieceType.KING:
      return [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 }, { row: 0, col: 1 },
        { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 }
      ];
    case PieceType.GOLD:
      return getGoldDirections(isPlayer);
    case PieceType.SILVER:
      return isPlayer
        ? [
            { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
            { row: 1, col: -1 }, { row: 1, col: 1 }
          ]
        : [
            { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
            { row: -1, col: -1 }, { row: -1, col: 1 }
          ];
    case PieceType.KNIGHT:
      return isPlayer
        ? [{ row: -2, col: -1 }, { row: -2, col: 1 }]
        : [{ row: 2, col: -1 }, { row: 2, col: 1 }];
    case PieceType.LANCE:
    case PieceType.PAWN:
      // 長距離移動は別処理
      return [];
    default:
      return [];
  }
}

function getGoldDirections(isPlayer: boolean): Array<{ row: number; col: number }> {
  return isPlayer
    ? [
        { row: -1, col: -1 }, { row: -1, col: 0 }, { row: -1, col: 1 },
        { row: 0, col: -1 }, { row: 0, col: 1 },
        { row: 1, col: 0 }
      ]
    : [
        { row: 1, col: -1 }, { row: 1, col: 0 }, { row: 1, col: 1 },
        { row: 0, col: -1 }, { row: 0, col: 1 },
        { row: -1, col: 0 }
      ];
}

// 移動を実行
export function makeMove(
  board: Board,
  move: Move,
  playerHand: Hand,
  enemyHand: Hand,
  currentPlayer: Player
): { board: Board; playerHand: Hand; enemyHand: Hand } {
  const newBoard = board.map(row => row.map(cell => cell));
  const newPlayerHand = { ...playerHand };
  const newEnemyHand = { ...enemyHand };

  if (move.from === 'hand') {
    // 持ち駒から打つ
    const handPieceType = move.piece.type as HandPieceType;
    if (currentPlayer === Player.PLAYER) {
      newPlayerHand[handPieceType]--;
    } else {
      newEnemyHand[handPieceType]--;
    }
    newBoard[move.to.row][move.to.col] = move.piece;
  } else {
    // 盤上の駒を動かす
    const capturedPiece = newBoard[move.to.row][move.to.col];
    if (capturedPiece && capturedPiece.player !== currentPlayer) {
      // 取った駒を持ち駒に追加（KINGは取られないのでHandPieceTypeとして扱える）
      const capturedType = getBasePieceType(capturedPiece.type) as HandPieceType;
      if (currentPlayer === Player.PLAYER) {
        newPlayerHand[capturedType]++;
      } else {
        newEnemyHand[capturedType]++;
      }
    }

    newBoard[move.from.row][move.from.col] = null;
    newBoard[move.to.row][move.to.col] = {
      ...move.piece,
      promoted: move.promote || move.piece.promoted,
      type: move.promote ? getPromotedType(move.piece.type) : move.piece.type,
    };
  }

  return { board: newBoard, playerHand: newPlayerHand, enemyHand: newEnemyHand };
}

// 基本の駒タイプを取得
function getBasePieceType(type: PieceType | PromotedPieceType): PieceType {
  switch (type) {
    case PromotedPieceType.DRAGON:
      return PieceType.ROOK;
    case PromotedPieceType.HORSE:
      return PieceType.BISHOP;
    case PromotedPieceType.PRO_SILVER:
      return PieceType.SILVER;
    case PromotedPieceType.PRO_KNIGHT:
      return PieceType.KNIGHT;
    case PromotedPieceType.PRO_LANCE:
      return PieceType.LANCE;
    case PromotedPieceType.PRO_PAWN:
      return PieceType.PAWN;
    default:
      return type as PieceType;
  }
}

// 成り駒タイプを取得
function getPromotedType(type: PieceType | PromotedPieceType): PromotedPieceType | PieceType {
  switch (type) {
    case PieceType.ROOK:
      return PromotedPieceType.DRAGON;
    case PieceType.BISHOP:
      return PromotedPieceType.HORSE;
    case PieceType.SILVER:
      return PromotedPieceType.PRO_SILVER;
    case PieceType.KNIGHT:
      return PromotedPieceType.PRO_KNIGHT;
    case PieceType.LANCE:
      return PromotedPieceType.PRO_LANCE;
    case PieceType.PAWN:
      return PromotedPieceType.PRO_PAWN;
    default:
      return type;
  }
}

// 王の位置を取得
export function findKing(board: Board, player: Player): Position | null {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.type === PieceType.KING && piece.player === player) {
        return { row, col };
      }
    }
  }
  return null;
}

// 王手チェック
export function isInCheck(board: Board, player: Player): boolean {
  const kingPos = findKing(board, player);
  if (!kingPos) return false;

  const enemy = player === Player.PLAYER ? Player.ENEMY : Player.PLAYER;
  const emptyHand: Hand = createInitialHand();

  // 敵の全駒の移動可能位置をチェック
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const piece = board[row][col];
      if (piece && piece.player === enemy) {
        const moves = getPossibleMoves(board, { row, col }, emptyHand, enemy);
        if (moves.some(move => isSamePosition(move, kingPos))) {
          return true;
        }
      }
    }
  }

  return false;
}

