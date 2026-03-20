// ============================================================
// TaskCard.js
// 役割: タスク1件分の情報を1枚のカードとして表示する
//       表示内容: タイトル・優先度/ステータスバッジ・説明・タグ・期限
//       ステータスバッジをクリックすると todo→wip→done とサイクルする
//
// props:
//   task     - タスクオブジェクト（INITIAL_TASKS の要素と同じ型）
//   index    - リスト内のインデックス（フェードインのディレイ計算に使用）
//   onToggle - ステータス変更のコールバック (id: number) => void
// ============================================================
function TaskCard({ task: t, index, onToggle }) {
  // 期限切れ判定: 未完了 かつ 期限日文字列 < 今日の文字列
  // YYYY-MM-DD 形式なら文字列の辞書順比較で日付の大小を判定できる
  const isOverdue = !t.done && t.due < TODAY;

  // 次のステータスラベル（ツールチップ用）
  const NEXT_LABEL = { todo: '→ 着手中にする', wip: '→ 完了にする', done: '→ 未着手に戻す' };

  return (
    <div
      className={`task-card${t.done ? ' done' : ''}`}
      style={{ animationDelay: `${index * 0.03}s` }}
    >

      {/* ── チェックボタン（ステータスを1段階進める）── */}
      <div
        className={`check-btn${t.status === 'done' ? ' checked' : t.status === 'wip' ? ' half' : ''}`}
        title={NEXT_LABEL[t.status]}
        onClick={(e) => { e.stopPropagation(); onToggle(t.id); }}
      />

      {/* ── タスク詳細エリア ── */}
      <div className="task-body">

        {/* タイトル行: タイトル + 優先度/ステータスバッジ */}
        <div className="task-title-row">
          <div className="task-title">{t.title}</div>
          <div className="badges">
            <span className={`badge badge-${t.priority}`}>{PRIORITY_LABEL[t.priority]}</span>
            {/*
              ステータスバッジをクリックでもステータス変更できる
              cursor:pointer でクリック可能と分かるようにする
            */}
            <span
              className={`badge badge-${t.status}`}
              style={{cursor:'pointer'}}
              title={NEXT_LABEL[t.status]}
              onClick={(e) => { e.stopPropagation(); onToggle(t.id); }}
            >
              {STATUS_LABEL[t.status]}
            </span>
          </div>
        </div>

        {/* 説明文（空文字の場合は表示しない）*/}
        {t.desc && (
          <div style={{fontSize:'12px', color:'var(--hint)', marginBottom:6, lineHeight:1.5}}>
            {t.desc}
          </div>
        )}

        {/* メタ情報: タグ一覧 + 期限日 */}
        <div className="task-meta">
          {t.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          <span className={`due${isOverdue ? ' overdue' : ''}`}>
            {t.done ? `完了: ${t.due}` : `期限: ${t.due}`}
          </span>
        </div>

      </div>
    </div>
  );
}
