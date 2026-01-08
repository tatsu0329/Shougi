/**
 * 駒の表示名
 */

import { PieceType, PromotedPieceType } from '@/types/game';

export const pieceNames: Record<PieceType | PromotedPieceType, { player: string; enemy: string }> = {
  [PieceType.KING]: { player: '王', enemy: '玉' },
  [PieceType.ROOK]: { player: '飛', enemy: '飛' },
  [PieceType.BISHOP]: { player: '角', enemy: '角' },
  [PieceType.GOLD]: { player: '金', enemy: '金' },
  [PieceType.SILVER]: { player: '銀', enemy: '銀' },
  [PieceType.KNIGHT]: { player: '桂', enemy: '桂' },
  [PieceType.LANCE]: { player: '香', enemy: '香' },
  [PieceType.PAWN]: { player: '歩', enemy: '歩' },
  [PromotedPieceType.DRAGON]: { player: '龍', enemy: '龍' },
  [PromotedPieceType.HORSE]: { player: '馬', enemy: '馬' },
  [PromotedPieceType.PRO_SILVER]: { player: '成銀', enemy: '成銀' },
  [PromotedPieceType.PRO_KNIGHT]: { player: '成桂', enemy: '成桂' },
  [PromotedPieceType.PRO_LANCE]: { player: '成香', enemy: '成香' },
  [PromotedPieceType.PRO_PAWN]: { player: 'と', enemy: 'と' },
};

