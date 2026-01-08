# 将棋アプリ

React (Next.js) + TypeScriptで作成された将棋の対戦アプリです。

## 機能

- CPとの対戦
- 完全な将棋ルールの実装
- レスポンシブデザイン（モバイル対応）
- グローバルテーマによる統一されたUI

## 技術スタック

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand** (状態管理)
- **React 18**

## セットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## プロジェクト構造

```
├── app/              # Next.js App Router
│   ├── layout.tsx    # ルートレイアウト
│   ├── page.tsx      # メインページ
│   └── globals.css   # グローバルスタイル
├── components/       # Reactコンポーネント
│   ├── Board.tsx     # 将棋盤
│   ├── Piece.tsx     # 駒
│   ├── Hand.tsx      # 持ち駒
│   └── GameStatus.tsx # ゲーム状態
├── store/            # 状態管理
│   └── gameStore.ts  # 将棋ゲームの状態管理
├── types/            # TypeScript型定義
│   └── game.ts       # 将棋の型定義
├── utils/            # ユーティリティ
│   ├── gameLogic.ts  # 将棋のゲームロジック
│   └── pieceNames.ts # 駒の表示名
└── theme/            # テーマ設定
    └── theme.ts      # グローバルテーマ
```

## 使い方

1. 盤上の駒をクリックして選択
2. 移動先のマスをクリックして移動
3. 持ち駒をクリックして選択し、盤面に打つ
4. CPが自動的に手を打ちます

## 今後の拡張予定

- ユーザー同士の対戦機能
- より高度なCP AI
- 棋譜の保存・読み込み
- 成りの選択UI

