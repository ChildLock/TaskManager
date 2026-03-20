// ============================================================
// TopBar.js
// 役割: ページタイトルと「新規タスク」ボタンを表示する
//       タイトルは選択中のナビラベルを動的に表示する
//
// props:
//   nav       - 現在選択中のナビID（タイトル表示に使用）
//   onNewTask - 新規タスクボタンクリック時のコールバック () => void
// ============================================================
function TopBar({ nav, onNewTask }) {
  // 現在のナビIDに対応するラベル文字列を NAV 定数から引く
  const navLabel = NAV.find(n => n.id === nav)?.label;

  return (
    <div className="topbar">

      {/* ページタイトル（例: "すべて / タスク"）*/}
      <div className="page-title">
        {navLabel} <span>/ タスク</span>
      </div>

      {/* 新規タスク作成ボタン */}
      <div className="topbar-actions">
        <button className="btn btn-primary" onClick={onNewTask}>
          {/* プラスアイコン（SVG インライン描画）*/}
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          新規タスク
        </button>
      </div>

    </div>
  );
}
