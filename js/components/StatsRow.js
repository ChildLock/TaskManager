// ============================================================
// StatsRow.js
// 役割: 合計・進行中・期限切れ・完了率の4つの統計数値を表示する
//       表示のみで、ロジックは持たない（純粋な表示コンポーネント）
//
// props:
//   total    - 全タスク件数
//   wipCount - 進行中タスク件数
//   overdue  - 期限切れタスク件数
//   doneRate - 完了率（0〜100 の整数）
// ============================================================
function StatsRow({ total, wipCount, overdue, doneRate }) {
  return (
    <div className="stats-row">

      {/* 合計タスク */}
      <div className="stat-cell">
        <div>
          <div className="stat-desc">合計タスク</div>
          <div className="stat-num">{total}</div>
        </div>
      </div>

      {/* 進行中 */}
      <div className="stat-cell">
        <div>
          <div className="stat-desc">進行中</div>
          <div className="stat-num" style={{color:'var(--amber)'}}>
            {wipCount}
          </div>
        </div>
      </div>

      {/* 期限切れ（1件以上なら赤で警告）*/}
      <div className="stat-cell">
        <div>
          <div className="stat-desc">期限切れ</div>
          <div
            className="stat-num"
            style={{color: overdue > 0 ? 'var(--red)' : 'var(--hint)'}}
          >
            {overdue}
          </div>
        </div>
      </div>

      {/* 完了率 */}
      <div className="stat-cell">
        <div>
          <div className="stat-desc">完了率</div>
          <div className="stat-num" style={{color:'var(--teal)'}}>
            {doneRate}%
          </div>
        </div>
      </div>

    </div>
  );
}
