// ============================================================
// TaskCard.js
// 役割: タスク1件分の情報を1枚のカードとして表示する
//       表示内容: タイトル・優先度/ステータスバッジ・説明・タグ・期限
//       チェックボタンで完了/未完了をトグルできる
//
// props:
//   task     - タスクオブジェクト（INITIAL_TASKS の要素と同じ型）
//   index    - リスト内のインデックス（フェードインのディレイ計算に使用）
//   onToggle - チェックボタンクリック時のコールバック (id: number) => void
// ============================================================
function TaskCard({ task: t, index, onToggle }) {
  // 期限切れ判定: 未完了 かつ 期限日文字列 < 今日の文字列
  // YYYY-MM-DD 形式なら文字列の辞書順比較で日付の大小を判定できる
  const isOverdue = !t.done && t.due < TODAY;

  return (
    <div
      className={`task-card${t.done ? ' done' : ''}`}
      // animationDelay でリスト内のカードを順番にずらしてフェードインさせる
      style={{ animationDelay: `${index * 0.03}s` }}
    >

      {/* ── チェックボタン（完了/未完了トグル）── */}
      {/*
        e.stopPropagation(): カード全体のクリックイベントへの伝播を止める
        （将来カードクリックで詳細表示を実装した場合でも、チェックと混在しない）
      */}
      <div
        className={`check-btn${t.done ? ' checked' : ''}`}
        onClick={(e) => { e.stopPropagation(); onToggle(t.id); }}
      />

      {/* ── タスク詳細エリア ── */}
      <div className="task-body">

        {/* タイトル行: タイトル + 優先度/ステータスバッジ */}
        <div className="task-title-row">
          <div className="task-title">{t.title}</div>
          <div className="badges">
            {/* PRIORITY_LABEL / STATUS_LABEL は constants.js で定義 */}
            <span className={`badge badge-${t.priority}`}>{PRIORITY_LABEL[t.priority]}</span>
            <span className={`badge badge-${t.status}`}>{STATUS_LABEL[t.status]}</span>
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
            {/* 完了済みは「完了: 日付」、未完了は「期限: 日付」と表示 */}
            {t.done ? `完了: ${t.due}` : `期限: ${t.due}`}
          </span>
        </div>

      </div>
    </div>
  );
}
