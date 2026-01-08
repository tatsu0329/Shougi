/**
 * 将棋ゲームの型定義
 */

// 駒の種類
export enum PieceType {
  KING = 'KING',           // 王/玉
  ROOK = 'ROOK',           // 飛
  BISHOP = 'BISHOP',       // 角
  GOLD = 'GOLD',           // 金
  SILVER = 'SILVER',       // 銀
  KNIGHT = 'KNIGHT',       // 桂
  LANCE = 'LANCE',         // 香
  PAWN = 'PAWN',           // 歩
}

// 成り駒の種類
export enum PromotedPieceType {
  DRAGON = 'DRAGON',       // 龍（飛の成り）
  HORSE = 'HORSE',         // 馬（角の成り）
  PRO_SILVER = 'PRO_SILVER', // 成銀
  PRO_KNIGHT = 'PRO_KNIGHT', // 成桂
  PRO_LANCE = 'PRO_LANCE',   // 成香
  PRO_PAWN = 'PRO_PAWN',     // と
}

// プレイヤー
export enum Player {
  PLAYER = 'PLAYER',       // 先手（下側）
  ENEMY = 'ENEMY',         // 後手（上側）
}

// CPUレベル
export enum CPULevel {
  EASY = 'EASY',           // 簡単
  MEDIUM = 'MEDIUM',       // 中級
  HARD = 'HARD',           // 上級
}

// 位置
export interface Position {
  row: number;  // 0-8 (9段目から1段目)
  col: number;  // 0-8 (1筋から9筋)
}

// 駒
export interface Piece {
  type: PieceType | PromotedPieceType;
  player: Player;
  promoted: boolean;
}

// 盤面のセル
export type Cell = Piece | null;

// 盤面（9x9の2次元配列）
export type Board = Cell[][];

// 持ち駒
export interface Hand {
  [PieceType.PAWN]: number;
  [PieceType.LANCE]: number;
  [PieceType.KNIGHT]: number;
  [PieceType.SILVER]: number;
  [PieceType.GOLD]: number;
  [PieceType.BISHOP]: number;
  [PieceType.ROOK]: number;
}

// 持ち駒として使用可能な駒の型
export type HandPieceType = Exclude<PieceType, PieceType.KING>;

// ゲーム状態
export interface GameState {
  board: Board;
  playerHand: Hand;
  enemyHand: Hand;
  currentPlayer: Player;
  selectedPosition: Position | null;
  selectedHandPiece: HandPieceType | null;
  possibleMoves: Position[];
  gameOver: boolean;
  winner: Player | null;
  check: boolean;
}

// 移動
export interface Move {
  from: Position | 'hand';
  to: Position;
  piece: Piece;
  promote?: boolean;
}
