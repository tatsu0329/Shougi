/**
 * 将棋ゲームの状態管理（Zustand）
 */

import { create } from 'zustand';
import {
  Board,
  CPULevel,
  GameState,
  Hand,
  HandPieceType,
  Move,
  Piece,
  PieceType,
  Player,
  Position,
} from '@/types/game';
import {
  createInitialBoard,
  createInitialHand,
  makeMove,
  getPossibleMoves,
  isInCheck,
  isValidPosition,
  isSamePosition,
} from '@/utils/gameLogic';
import { getAIMove } from '@/utils/aiLogic';
import { isValidMove } from '@/utils/moveValidation';
import { canPromote, mustPromote } from '@/utils/promotionLogic';

interface GameStore extends GameState {
  // CPU Level
  cpuLevel: CPULevel;
  setCPULevel: (level: CPULevel) => void;
  // Promotion
  pendingMove: { from: Position; to: Position } | null;
  showPromotionModal: boolean;
  // Actions
  selectPosition: (position: Position) => void;
  selectHandPiece: (pieceType: HandPieceType) => void;
  makePlayerMove: (to: Position, promote?: boolean) => void;
  confirmMove: (promote: boolean) => void;
  makeEnemyMove: () => void;
  resetGame: () => void;
  checkGameOver: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state
  board: createInitialBoard(),
  playerHand: createInitialHand(),
  enemyHand: createInitialHand(),
  currentPlayer: Player.PLAYER,
  selectedPosition: null,
  selectedHandPiece: null,
  possibleMoves: [],
  gameOver: false,
  winner: null,
  check: false,
  cpuLevel: CPULevel.MEDIUM,
  pendingMove: null,
  showPromotionModal: false,

  // Set CPU Level
  setCPULevel: (level: CPULevel) => {
    set({ cpuLevel: level });
  },

  // Select position on board
  selectPosition: (position: Position) => {
    const state = get();
    if (state.gameOver || state.currentPlayer !== Player.PLAYER) return;

    // 既に選択されている位置をクリックした場合、選択解除
    if (state.selectedPosition && 
        state.selectedPosition.row === position.row && 
        state.selectedPosition.col === position.col) {
      set({ selectedPosition: null, possibleMoves: [] });
      return;
    }

    // 持ち駒が選択されている場合、盤面に打つ
    if (state.selectedHandPiece) {
      const hand = state.currentPlayer === Player.PLAYER ? state.playerHand : state.enemyHand;
      if (hand[state.selectedHandPiece] > 0) {
        const piece: Piece = {
          type: state.selectedHandPiece,
          player: state.currentPlayer,
          promoted: false,
        };

        const move: Move = {
          from: 'hand',
          to: position,
          piece,
        };

        // 移動の合法性チェック
        if (!isValidMove(
          state.board,
          move,
          state.playerHand,
          state.enemyHand,
          state.currentPlayer
        )) {
          return; // 不正な手は無視
        }

        const { board, playerHand, enemyHand } = makeMove(
          state.board,
          move,
          state.playerHand,
          state.enemyHand,
          state.currentPlayer
        );

        const newPlayer = state.currentPlayer === Player.PLAYER ? Player.ENEMY : Player.PLAYER;
        const check = isInCheck(board, newPlayer);

        set({
          board,
          playerHand,
          enemyHand,
          currentPlayer: newPlayer,
          selectedHandPiece: null,
          possibleMoves: [],
          check,
        });

        get().checkGameOver();

        // CPの手番
        if (!get().gameOver) {
          setTimeout(() => {
            get().makeEnemyMove();
          }, 500);
        }
      }
      return;
    }

    // 盤上の駒を選択
    const piece = state.board[position.row][position.col];
    if (piece && piece.player === state.currentPlayer) {
      const moves = getPossibleMoves(
        state.board,
        position,
        state.playerHand,
        state.currentPlayer
      );
      set({
        selectedPosition: position,
        possibleMoves: moves,
      });
    } else if (state.selectedPosition) {
      // 移動先を選択
      // 移動先が可能な移動先に含まれているかチェック
      if (!state.possibleMoves.some(move => isSamePosition(move, position))) {
        // 不正な移動先の場合は選択を解除
        set({ selectedPosition: null, possibleMoves: [] });
        return;
      }

      const piece = state.board[state.selectedPosition.row][state.selectedPosition.col]!;
      const mustPromotePiece = mustPromote(piece, position, state.currentPlayer);
      const canPromotePiece = canPromote(piece, state.selectedPosition, position, state.currentPlayer);

      // 成りが必須の場合、自動的に成る
      if (mustPromotePiece) {
        const move: Move = {
          from: state.selectedPosition,
          to: position,
          piece,
          promote: true,
        };

        // 移動の合法性チェック
        if (!isValidMove(
          state.board,
          move,
          state.playerHand,
          state.enemyHand,
          state.currentPlayer
        )) {
          set({ selectedPosition: null, possibleMoves: [] });
          return;
        }

        const { board, playerHand, enemyHand } = makeMove(
          state.board,
          move,
          state.playerHand,
          state.enemyHand,
          state.currentPlayer
        );

        const newPlayer = state.currentPlayer === Player.PLAYER ? Player.ENEMY : Player.PLAYER;
        const check = isInCheck(board, newPlayer);

        set({
          board,
          playerHand,
          enemyHand,
          currentPlayer: newPlayer,
          selectedPosition: null,
          possibleMoves: [],
          check,
        });

        get().checkGameOver();

        if (!get().gameOver) {
          setTimeout(() => {
            get().makeEnemyMove();
          }, 500);
        }
      } else if (canPromotePiece) {
        // 成り可能な場合、成り選択モーダルを表示
        set({
          pendingMove: { from: state.selectedPosition, to: position },
          showPromotionModal: true,
          selectedPosition: null,
          possibleMoves: [],
        });
      } else {
        // 成りできない場合、そのまま移動
        const move: Move = {
          from: state.selectedPosition,
          to: position,
          piece,
          promote: false,
        };

        if (!isValidMove(
          state.board,
          move,
          state.playerHand,
          state.enemyHand,
          state.currentPlayer
        )) {
          set({ selectedPosition: null, possibleMoves: [] });
          return;
        }

        const { board, playerHand, enemyHand } = makeMove(
          state.board,
          move,
          state.playerHand,
          state.enemyHand,
          state.currentPlayer
        );

        const newPlayer = state.currentPlayer === Player.PLAYER ? Player.ENEMY : Player.PLAYER;
        const check = isInCheck(board, newPlayer);

        set({
          board,
          playerHand,
          enemyHand,
          currentPlayer: newPlayer,
          selectedPosition: null,
          possibleMoves: [],
          check,
        });

        get().checkGameOver();

        if (!get().gameOver) {
          setTimeout(() => {
            get().makeEnemyMove();
          }, 500);
        }
      }
    }
  },

  // Select piece from hand
  selectHandPiece: (pieceType: HandPieceType) => {
    const state = get();
    if (state.gameOver || state.currentPlayer !== Player.PLAYER) return;

    const hand = state.playerHand;
    if (hand[pieceType] > 0) {
      set({
        selectedHandPiece: state.selectedHandPiece === pieceType ? null : pieceType,
        selectedPosition: null,
        possibleMoves: [],
      });
    }
  },

  // Make player move
  makePlayerMove: (to: Position, promote?: boolean) => {
    const state = get();
    if (state.gameOver || state.currentPlayer !== Player.PLAYER) return;

    if (state.selectedPosition) {
      const move: Move = {
        from: state.selectedPosition,
        to,
        piece: state.board[state.selectedPosition.row][state.selectedPosition.col]!,
        promote,
      };

      const { board, playerHand, enemyHand } = makeMove(
        state.board,
        move,
        state.playerHand,
        state.enemyHand,
        state.currentPlayer
      );

      const newPlayer = Player.ENEMY;
      const check = isInCheck(board, newPlayer);

      set({
        board,
        playerHand,
        enemyHand,
        currentPlayer: newPlayer,
        selectedPosition: null,
        possibleMoves: [],
        check,
      });

      get().checkGameOver();
    }
  },

  // Confirm move with promotion choice
  confirmMove: (promote: boolean) => {
    const state = get();
    if (!state.pendingMove) return;

    const piece = state.board[state.pendingMove.from.row][state.pendingMove.from.col];
    if (!piece) {
      set({ pendingMove: null, showPromotionModal: false });
      return;
    }

    const move: Move = {
      from: state.pendingMove.from,
      to: state.pendingMove.to,
      piece,
      promote,
    };

    if (!isValidMove(
      state.board,
      move,
      state.playerHand,
      state.enemyHand,
      state.currentPlayer
    )) {
      set({ pendingMove: null, showPromotionModal: false });
      return;
    }

    const { board, playerHand, enemyHand } = makeMove(
      state.board,
      move,
      state.playerHand,
      state.enemyHand,
      state.currentPlayer
    );

    const newPlayer = state.currentPlayer === Player.PLAYER ? Player.ENEMY : Player.PLAYER;
    const check = isInCheck(board, newPlayer);

    set({
      board,
      playerHand,
      enemyHand,
      currentPlayer: newPlayer,
      pendingMove: null,
      showPromotionModal: false,
      check,
    });

    get().checkGameOver();

    if (!get().gameOver) {
      setTimeout(() => {
        get().makeEnemyMove();
      }, 500);
    }
  },

  // Make enemy (CPU) move
  makeEnemyMove: () => {
    const state = get();
    if (state.gameOver || state.currentPlayer !== Player.ENEMY) return;

    // レベルに応じたAIで手を選ぶ
    const aiMove = getAIMove(
      state.cpuLevel,
      state.board,
      state.enemyHand,
      state.playerHand,
      state.enemyHand,
      Player.ENEMY
    );

    if (aiMove) {
      const move: Move = {
        from: aiMove.from,
        to: aiMove.to,
        piece: aiMove.piece,
        promote: aiMove.promote,
      };

      const { board, playerHand, enemyHand } = makeMove(
        state.board,
        move,
        state.playerHand,
        state.enemyHand,
        Player.ENEMY
      );

      const check = isInCheck(board, Player.PLAYER);

      set({
        board,
        playerHand,
        enemyHand,
        currentPlayer: Player.PLAYER,
        selectedPosition: null,
        selectedHandPiece: null,
        possibleMoves: [],
        check,
      });

      get().checkGameOver();
    }
  },

  // Reset game
  resetGame: () => {
    set({
      board: createInitialBoard(),
      playerHand: createInitialHand(),
      enemyHand: createInitialHand(),
      currentPlayer: Player.PLAYER,
      selectedPosition: null,
      selectedHandPiece: null,
      possibleMoves: [],
      gameOver: false,
      winner: null,
      check: false,
      pendingMove: null,
      showPromotionModal: false,
    });
  },

  // Check if game is over
  checkGameOver: () => {
    const state = get();
    const playerKing = state.board.some(row =>
      row.some(cell => cell && cell.type === PieceType.KING && cell.player === Player.PLAYER)
    );
    const enemyKing = state.board.some(row =>
      row.some(cell => cell && cell.type === PieceType.KING && cell.player === Player.ENEMY)
    );

    if (!playerKing) {
      set({ gameOver: true, winner: Player.ENEMY });
    } else if (!enemyKing) {
      set({ gameOver: true, winner: Player.PLAYER });
    }
  },
}));

