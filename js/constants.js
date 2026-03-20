// ============================================================
// constants.js
// 役割: アプリ全体で使う定数・初期データを定義する
//       すべてのコンポーネントから参照されるため、必ず最初に読み込む
// ============================================================

// React Hooks を グローバルの React オブジェクトから取り出す
// （CDN版Reactはモジュールではないため、window.React 経由でアクセスする）
const { useState, useMemo } = React;

// ──────────────────────────────────────────
// ステータス定義・遷移ルール
// ──────────────────────────────────────────

/**
 * ステータスの定義
 * order: サイドバーや並び替えで使う表示順
 * color: バッジの配色クラス
 */
const STATUS_DEF = {
  todo:    { label: '未着手',       color: 'badge-todo',    order: 0 },
  wip:     { label: '着手中',       color: 'badge-wip',     order: 1 },
  review:  { label: '確認依頼待ち', color: 'badge-review',  order: 2 },
  done:    { label: '完了',         color: 'badge-done',    order: 3 },
};

/**
 * ステータス遷移ルール
 * forward:   通常の前進先
 * back:      差戻し先（コメント必須）
 * emergency: 緊急完了の遷移先（コメント必須・todoのみ）
 *
 * ルール:
 *   todo    → wip（通常着手）
 *   todo    → done（緊急完了・コメント必須）
 *   wip     → review（確認依頼）
 *   review  → done（承認・完了）
 *   review  → wip（差戻し・コメント必須）
 *   done    → 移動不可
 */
const STATUS_TRANSITIONS = {
  todo:   { forward: 'wip',    back: null,  emergency: 'done' },
  wip:    { forward: 'review', back: null,  emergency: null   },
  review: { forward: 'done',   back: 'wip', emergency: null   },
  done:   { forward: null,     back: null,  emergency: null   },
};

/**
 * 各ボタンのラベル
 */
const STATUS_FORWARD_LABEL = {
  todo:   '着手する',
  wip:    '確認依頼する',
  review: '完了にする',
  done:   null,
};

const STATUS_EMERGENCY_LABEL = {
  todo: '緊急完了',
};

/**
 * 履歴エントリの型（TypeScriptなら interface StatusHistory として定義）
 *   id:         number  - 履歴の一意ID
 *   taskId:     number  - 対象タスクのID
 *   fromStatus: string  - 変更前のステータス
 *   toStatus:   string  - 変更後のステータス
 *   comment:    string  - 変更理由（差戻し時は必須）
 *   changedAt:  string  - 変更日時（ISO形式）
 */

// ──────────────────────────────────────────
// タスクデータ
// ──────────────────────────────────────────

// タスクの型コメントを更新
/**
 * サンプルタスクデータ
 * 実際のアプリでは useState の初期値ではなく、
 * useEffect 内で GET /api/tasks を呼び出してセットする
 *
 * タスクの型（TypeScript なら interface Task として定義する）:
 *   id:       number                        - 一意のID（サーバーが発行）
 *   title:    string                        - タイトル
 *   desc:     string                        - 詳細説明
 *   status:   'todo'|'wip'|'review'|'done'
 *   priority: 'hi'|'md'|'lo'
 *   tags:     string[]                      - タグ一覧
 *   due:      string                        - 期限（YYYY-MM-DD 形式）
 *   done:     boolean                       - 完了フラグ
 *   history:  StatusHistory[]               - ステータス変更履歴
 */
const INITIAL_TASKS = [
  { id:1, title:'認証APIのエンドポイント実装', desc:'register/login エンドポイントとJWTの発行ロジックを実装する', status:'wip',    priority:'hi', tags:['バックエンド','API'],      due:'2026-03-20', done:false, deleted:false, history:[] },
  { id:2, title:'Prismaスキーマの設計',        desc:'User・Task・Tag テーブルの定義とリレーション設定',            status:'todo',   priority:'hi', tags:['DB設計'],               due:'2026-03-22', done:false, deleted:false, history:[] },
  { id:3, title:'タスク一覧コンポーネント作成', desc:'フィルタ・ソート・ページネーション対応のReactコンポーネント', status:'review', priority:'md', tags:['フロントエンド','React'], due:'2026-03-24', done:false, deleted:false, history:[
    { id:1, taskId:3, fromStatus:'wip', toStatus:'review', comment:'実装完了。レビューお願いします。', changedAt:'2026-03-19T10:00:00' }
  ]},
  { id:4, title:'JWTミドルウェアのテスト',      desc:'jest を使った認証ミドルウェアのユニットテスト',               status:'todo',   priority:'md', tags:['テスト'],               due:'2026-03-25', done:false, deleted:false, history:[] },
  { id:5, title:'Viteプロジェクト初期設定',     desc:'TypeScript + Tailwind の設定とディレクトリ構成の整備',        status:'todo',   priority:'lo', tags:['環境構築'],             due:'2026-03-26', done:false, deleted:false, history:[] },
  { id:6, title:'ディレクトリ構成の決定',       desc:'フロント・バックの構成を確定してREADMEに記載',                status:'done',   priority:'lo', tags:['設計'],                due:'2026-03-18', done:true,  deleted:false, history:[
    { id:1, taskId:6, fromStatus:'todo',   toStatus:'wip',    comment:'', changedAt:'2026-03-17T09:00:00' },
    { id:2, taskId:6, fromStatus:'wip',    toStatus:'review', comment:'確認お願いします', changedAt:'2026-03-17T15:00:00' },
    { id:3, taskId:6, fromStatus:'review', toStatus:'done',   comment:'', changedAt:'2026-03-18T10:00:00' },
  ]},
];

// ──────────────────────────────────────────
// ラベル変換マップ
// ──────────────────────────────────────────

// STATUS_DEF から自動生成（二重管理を防ぐ）
const STATUS_LABEL = Object.fromEntries(
  Object.entries(STATUS_DEF).map(([k, v]) => [k, v.label])
);

// 優先度の英語キー → 日本語表示ラベル
const PRIORITY_LABEL = {
  hi: '高',
  md: '中',
  lo: '低',
};

// ──────────────────────────────────────────
// ナビゲーション定義
// ──────────────────────────────────────────

/**
 * サイドバーのナビ項目定義
 *   id:    フィルターキー（'all' はすべて表示）
 *   label: 表示テキスト
 *   dot:   ステータスに対応するカラードット色
 */
const NAV = [
  { id:'all',    label:'すべて',       dot:'#888580' },
  { id:'todo',   label:'未着手',       dot:'#5b9cf6' },
  { id:'wip',    label:'着手中',       dot:'#f5a623' },
  { id:'review', label:'確認依頼待ち', dot:'#a78bfa' },
  { id:'done',   label:'完了',         dot:'#3ecfaa' },
];

// ──────────────────────────────────────────
// 日付
// ──────────────────────────────────────────

// 今日の日付（期限切れ判定に使用）
// 実際のアプリでは: new Date().toISOString().slice(0, 10)
const TODAY = '2026-03-19';
