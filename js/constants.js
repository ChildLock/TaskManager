// ============================================================
// constants.js
// 役割: アプリ全体で使う定数・初期データを定義する
//       すべてのコンポーネントから参照されるため、必ず最初に読み込む
// ============================================================

// React Hooks を グローバルの React オブジェクトから取り出す
// （CDN版Reactはモジュールではないため、window.React 経由でアクセスする）
const { useState, useMemo } = React;

// ──────────────────────────────────────────
// タスクデータ
// ──────────────────────────────────────────

/**
 * サンプルタスクデータ
 * 実際のアプリでは useState の初期値ではなく、
 * useEffect 内で GET /api/tasks を呼び出してセットする
 *
 * タスクの型（TypeScript なら interface Task として定義する）:
 *   id:       number            - 一意のID（サーバーが発行）
 *   title:    string            - タイトル
 *   desc:     string            - 詳細説明
 *   status:   'todo'|'wip'|'done'
 *   priority: 'hi'|'md'|'lo'
 *   tags:     string[]          - タグ一覧
 *   due:      string            - 期限（YYYY-MM-DD 形式）
 *   done:     boolean           - 完了フラグ
 */
const INITIAL_TASKS = [
  { id:1, title:'認証APIのエンドポイント実装', desc:'register/login エンドポイントとJWTの発行ロジックを実装する', status:'wip',  priority:'hi', tags:['バックエンド','API'],      due:'2026-03-20', done:false },
  { id:2, title:'Prismaスキーマの設計',        desc:'User・Task・Tag テーブルの定義とリレーション設定',            status:'todo', priority:'hi', tags:['DB設計'],               due:'2026-03-22', done:false },
  { id:3, title:'タスク一覧コンポーネント作成', desc:'フィルタ・ソート・ページネーション対応のReactコンポーネント', status:'wip',  priority:'md', tags:['フロントエンド','React'], due:'2026-03-24', done:false },
  { id:4, title:'JWTミドルウェアのテスト',      desc:'jest を使った認証ミドルウェアのユニットテスト',               status:'todo', priority:'md', tags:['テスト'],               due:'2026-03-25', done:false },
  { id:5, title:'Viteプロジェクト初期設定',     desc:'TypeScript + Tailwind の設定とディレクトリ構成の整備',        status:'todo', priority:'lo', tags:['環境構築'],             due:'2026-03-26', done:false },
  { id:6, title:'ディレクトリ構成の決定',       desc:'フロント・バックの構成を確定してREADMEに記載',                status:'done', priority:'lo', tags:['設計'],                due:'2026-03-18', done:true  },
];

// ──────────────────────────────────────────
// ラベル変換マップ
// ──────────────────────────────────────────

// ステータスの英語キー → 日本語表示ラベル
const STATUS_LABEL = {
  todo: '未着手',
  wip:  '進行中',
  done: '完了',
};

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
  { id:'all',  label:'すべて', dot:'#888580' },
  { id:'todo', label:'未着手', dot:'#5b9cf6' },
  { id:'wip',  label:'進行中', dot:'#f5a623' },
  { id:'done', label:'完了',   dot:'#3ecfaa' },
];

// ──────────────────────────────────────────
// 日付
// ──────────────────────────────────────────

// 今日の日付（期限切れ判定に使用）
// 実際のアプリでは: new Date().toISOString().slice(0, 10)
const TODAY = '2026-03-19';
