// ============================================================
// Sidebar.js
// 役割: ロゴ・ステータスナビ・ログインユーザー情報を表示する
//       ナビクリックで App のステータスフィルターを切り替える
//
// props:
//   nav    - 現在選択中のナビID ('all' | 'todo' | 'wip' | 'done')
//   counts - ステータスごとのタスク件数 { all, todo, wip, done }
//   onNav  - ナビクリック時のコールバック (id: string) => void
// ============================================================
function Sidebar({ nav, counts, onNav }) {
  return (
    <aside className="sidebar">

      {/* ── ロゴ ── */}
      <div className="logo">
        <div className="logo-mark">
          {/* 4つの正方形を並べたグリッドアイコン */}
          <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="5" height="5" rx="1.5" fill="#0f0f0f"/>
            <rect x="8" y="1" width="5" height="5" rx="1.5" fill="#0f0f0f"/>
            <rect x="1" y="8" width="5" height="5" rx="1.5" fill="#0f0f0f"/>
            <rect x="8" y="8" width="5" height="5" rx="1.5" fill="#0f0f0f" opacity="0.4"/>
          </svg>
        </div>
        <span className="logo-name">TaskFlow</span>
      </div>

      {/* ── ステータス別ナビゲーション ── */}
      <div className="nav-section">
        <div className="nav-label">ビュー</div>
        {/* NAV定数（constants.js）をループしてナビ項目を生成 */}
        {NAV.map(n => (
          <div
            key={n.id}
            className={`nav-item${nav === n.id ? ' active' : ''}`}
            onClick={() => onNav(n.id)}
          >
            {/* ステータスカラーのドット */}
            <div className="nav-dot" style={{ background: n.dot }} />
            {n.label}
            {/* 件数バッジ */}
            <span className="count">{counts[n.id]}</span>
          </div>
        ))}
      </div>

      {/* ── ログインユーザー情報（サイドバー最下部）── */}
      <div className="sidebar-footer">
        <div className="user-row">
          {/* イニシャルアバター */}
          <div className="avatar">田</div>
          <div className="user-info">
            <div className="user-name">田中 太郎</div>
            <div className="user-role">開発者</div>
          </div>
        </div>
      </div>

    </aside>
  );
}
