/**
 * ルール説明モーダルコンポーネント
 */

import React from 'react';
import { theme } from '@/theme/theme';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl"
        style={{
          backgroundColor: theme.colors.ui.surface,
          padding: theme.spacing.xl,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 閉じるボタン */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all hover:bg-gray-200"
          style={{
            color: theme.colors.ui.text.primary,
            fontSize: theme.fonts.size.xl,
          }}
        >
          ×
        </button>

        {/* タイトル */}
        <h2
          className="mb-6 font-bold"
          style={{
            fontSize: theme.fonts.size['3xl'],
            color: theme.colors.ui.primary,
            fontWeight: theme.fonts.weight.bold,
          }}
        >
          将棋のルール
        </h2>

        {/* ルール説明 */}
        <div className="space-y-6">
          <section>
            <h3
              className="mb-3 font-semibold"
              style={{
                fontSize: theme.fonts.size.xl,
                color: theme.colors.ui.primary,
                fontWeight: theme.fonts.weight.semibold,
              }}
            >
              基本ルール
            </h3>
            <ul
              className="space-y-2 ml-4 list-disc"
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.ui.text.primary,
                lineHeight: '1.6',
              }}
            >
              <li>将棋は9×9の盤面で行います</li>
              <li>先手（あなた）と後手（CPU）が交互に手を指します</li>
              <li>相手の王（玉）を詰ませた側が勝ちです</li>
              <li style={{ listStyle: 'none', marginLeft: '-1.5rem', marginTop: '0.5rem', fontStyle: 'italic', color: theme.colors.ui.text.secondary }}>
                ※「王を取る」ではなく、詰み＝王が逃げられない状態が正式
              </li>
              <li>1手では以下のいずれかを行います</li>
              <li style={{ marginLeft: '1rem' }}>盤上の駒を動かす</li>
              <li style={{ marginLeft: '1rem' }}>持ち駒を盤面に打つ</li>
            </ul>
          </section>

          <section>
            <h3
              className="mb-3 font-semibold"
              style={{
                fontSize: theme.fonts.size.xl,
                color: theme.colors.ui.primary,
                fontWeight: theme.fonts.weight.semibold,
              }}
            >
              駒の動き方
            </h3>
            <div
              className="space-y-3"
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.ui.text.primary,
                lineHeight: '1.6',
              }}
            >
              <div>
                <strong>王（玉）:</strong> 周囲8方向に1マスずつ動けます
              </div>
              <div>
                <strong>飛（飛車）:</strong> 縦横に何マスでも動けます
              </div>
              <div>
                <strong>角（角行）:</strong> 斜めに何マスでも動けます
              </div>
              <div>
                <strong>金（金将）:</strong> 前・後・左・右・斜め前の計6方向に1マス動けます
                <br />
                <span style={{ fontSize: theme.fonts.size.sm, color: theme.colors.ui.text.secondary }}>
                  （※斜め後ろには動けません）
                </span>
              </div>
              <div>
                <strong>銀（銀将）:</strong> 前と斜め4方向の計5方向に1マス動けます
                <br />
                <span style={{ fontSize: theme.fonts.size.sm, color: theme.colors.ui.text.secondary }}>
                  （※真後ろ・左右には動けません）
                </span>
              </div>
              <div>
                <strong>桂（桂馬）:</strong> 前に2マス進み、左右どちらかに1マス動きます
                <br />
                <span style={{ fontSize: theme.fonts.size.sm, color: theme.colors.ui.text.secondary }}>
                  • 他の駒を飛び越えられます
                  <br />
                  • 後ろには戻れません
                </span>
              </div>
              <div>
                <strong>香（香車）:</strong> 前方向に何マスでも動けます
                <br />
                <span style={{ fontSize: theme.fonts.size.sm, color: theme.colors.ui.text.secondary }}>
                  • 後ろには戻れません
                </span>
              </div>
              <div>
                <strong>歩（歩兵）:</strong> 前に1マスだけ動けます
              </div>
            </div>
          </section>

          <section>
            <h3
              className="mb-3 font-semibold"
              style={{
                fontSize: theme.fonts.size.xl,
                color: theme.colors.ui.primary,
                fontWeight: theme.fonts.weight.semibold,
              }}
            >
              成り（成駒）
            </h3>
            <ul
              className="space-y-2 ml-4 list-disc"
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.ui.text.primary,
                lineHeight: '1.6',
              }}
            >
              <li>駒は敵陣（相手側の3段）に入る・動く・出るときに成ることができます</li>
              <li>成るかどうかは任意（ただし一部例外あり）</li>
              <li>成ると駒の動きが変わります</li>
            </ul>
            <div className="mt-3 overflow-x-auto">
              <table
                className="w-full border-collapse"
                style={{
                  fontSize: theme.fonts.size.sm,
                  border: `1px solid ${theme.colors.ui.secondary}`,
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: theme.colors.ui.secondary, color: theme.colors.ui.text.inverse }}>
                    <th style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}` }}>元の駒</th>
                    <th style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}` }}>成った駒</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>飛</td>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>龍（りゅう）</td>
                  </tr>
                  <tr style={{ backgroundColor: theme.colors.ui.background }}>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>角</td>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>馬（うま）</td>
                  </tr>
                  <tr>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>銀</td>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>成銀</td>
                  </tr>
                  <tr style={{ backgroundColor: theme.colors.ui.background }}>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>桂</td>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>成桂</td>
                  </tr>
                  <tr>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>香</td>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>成香</td>
                  </tr>
                  <tr style={{ backgroundColor: theme.colors.ui.background }}>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>歩</td>
                    <td style={{ padding: theme.spacing.sm, border: `1px solid ${theme.colors.ui.secondary}`, textAlign: 'center' }}>と金</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul
              className="space-y-2 ml-4 list-disc mt-3"
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.ui.text.primary,
                lineHeight: '1.6',
              }}
            >
              <li>王と金は成れません</li>
              <li>成った駒は裏返して表示されます</li>
              <li>成るかどうかは基本的に任意ですが、一部例外があります</li>
            </ul>
            <div
              className="mt-3 p-3 rounded"
              style={{
                backgroundColor: theme.colors.ui.background,
                fontSize: theme.fonts.size.sm,
                color: theme.colors.ui.text.secondary,
              }}
            >
              <strong>※ 成りが必須の場合</strong>
              <br />
              以下の駒は、成らないと次に動けなくなる段に入った場合、必ず成ります：
              <ul className="ml-4 mt-2 list-disc space-y-1">
                <li>桂：先手なら0-1段目、後手なら7-8段目に入った場合</li>
                <li>香：先手なら0段目、後手なら8段目に入った場合</li>
                <li>歩：先手なら0段目、後手なら8段目に入った場合</li>
              </ul>
            </div>
            <div
              className="mt-3 p-3 rounded"
              style={{
                backgroundColor: theme.colors.ui.background,
                fontSize: theme.fonts.size.sm,
                color: theme.colors.ui.text.secondary,
              }}
            >
              <strong>※ 操作方法</strong>
              <br />
              敵陣に入る・動く・出るときに成り可能な駒を動かすと、成り選択のダイアログが表示されます。
              <br />
              「成る」を選択すると成り駒に、「成らない」を選択するとそのまま移動します。
            </div>
          </section>

          <section>
            <h3
              className="mb-3 font-semibold"
              style={{
                fontSize: theme.fonts.size.xl,
                color: theme.colors.ui.primary,
                fontWeight: theme.fonts.weight.semibold,
              }}
            >
              持ち駒
            </h3>
            <ul
              className="space-y-2 ml-4 list-disc"
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.ui.text.primary,
                lineHeight: '1.6',
              }}
            >
              <li>相手の駒を取ると、自分の持ち駒として使えます</li>
              <li>持ち駒は、盤面の空いているマスに打つことができます</li>
            </ul>
            <div className="mt-3">
              <h4
                className="mb-2 font-semibold"
                style={{
                  fontSize: theme.fonts.size.lg,
                  color: theme.colors.ui.primary,
                }}
              >
                持ち駒のルール
              </h4>
              <ul
                className="space-y-2 ml-4 list-disc"
                style={{
                  fontSize: theme.fonts.size.base,
                  color: theme.colors.ui.text.primary,
                  lineHeight: '1.6',
                }}
              >
                <li>歩は同じ筋に2枚打てません（二歩禁止）</li>
                <li>歩・香は最前段には打てません</li>
                <li>桂は最前段・その1つ手前の段には打てません</li>
                <li>歩を打って即詰みにする手（打ち歩詰め）は禁止です</li>
              </ul>
              <div
                className="mt-3 p-3 rounded"
                style={{
                  backgroundColor: theme.colors.ui.background,
                  fontSize: theme.fonts.size.sm,
                  color: theme.colors.ui.text.secondary,
                }}
              >
                ※ この「打ち歩詰め」は重要なので、ルール説明では入れておくと◎
              </div>
            </div>
          </section>

          <section>
            <h3
              className="mb-3 font-semibold"
              style={{
                fontSize: theme.fonts.size.xl,
                color: theme.colors.ui.primary,
                fontWeight: theme.fonts.weight.semibold,
              }}
            >
              王手と詰み
            </h3>
            <ul
              className="space-y-2 ml-4 list-disc"
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.ui.text.primary,
                lineHeight: '1.6',
              }}
            >
              <li>王が相手の駒の利き（攻撃範囲）に入っている状態を「王手」といいます</li>
              <li>王手をかけられたら、必ず王手を回避する手を指さなければなりません</li>
              <li>王手を回避できない状態を「詰み」といい、その時点で負けです</li>
            </ul>
          </section>

          <section>
            <h3
              className="mb-3 font-semibold"
              style={{
                fontSize: theme.fonts.size.xl,
                color: theme.colors.ui.primary,
                fontWeight: theme.fonts.weight.semibold,
              }}
            >
              操作方法
            </h3>
            <ul
              className="space-y-2 ml-4 list-disc"
              style={{
                fontSize: theme.fonts.size.base,
                color: theme.colors.ui.text.primary,
                lineHeight: '1.6',
              }}
            >
              <li>盤上の駒をクリックして選択します</li>
              <li>移動可能なマスがハイライト表示されます</li>
              <li>移動先のマスをクリックして移動します</li>
              <li>持ち駒をクリックして選択し、盤面の空いているマスをクリックして打ちます</li>
            </ul>
          </section>
        </div>

        {/* 閉じるボタン（下部） */}
        <div className="mt-8 text-center">
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-lg font-semibold transition-all hover:opacity-90"
            style={{
              backgroundColor: theme.colors.ui.primary,
              color: theme.colors.ui.text.inverse,
              fontSize: theme.fonts.size.base,
            }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

