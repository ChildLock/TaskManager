// ============================================================
// TaskCard.js
// 役割: タスク1件分の情報を表示する
//
// 削除フラグ仕様:
//   - 完了以外のステータスで「×」ボタンが表示される
//   - クリックすると deleted:true になりグレーアウト表示
//   - 削除済みの場合は「-」ボタンが表示され、押すと削除取り消し
//   - 物理削除はしない（履歴として残す）
//
// props:
//   task        - タスクオブジェクト（history[], deleted を含む）
//   index       - フェードインのディレイ計算用
//   onForward   - 通常前進 (id) => void
//   onBack      - 差戻し依頼 (id) => void
//   onEmergency - 緊急完了依頼 (id) => void
//   onDelete    - 削除トグル (id) => void
// ============================================================
function TaskCard({ task: t, index, onForward, onBack, onEmergency, onDelete }) {
  const { useState: useLocalState } = React;
  const [showHistory, setShowHistory] = useLocalState(false);

  var isOverdue    = !t.done && t.due < TODAY;
  var transition   = STATUS_TRANSITIONS[t.status] || {};
  var canForward   = !!transition.forward && !t.deleted;
  var canBack      = !!transition.back    && !t.deleted;
  var canEmergency = !!transition.emergency && !t.deleted;
  // 完了以外なら削除ボタンを表示
  var canDelete    = t.status !== 'done';

  var checkClass = t.status === 'done'   ? 'checked'
                 : t.status === 'review' ? 'reviewing'
                 : t.status === 'wip'    ? 'half'
                 : '';

  return (
    <div
      className={'task-card' + (t.done ? ' done' : '') + (t.deleted ? ' deleted' : '')}
      style={{ animationDelay: (index * 0.03) + 's' }}
    >
      {/* 削除ボタン（× または -）*/}
      {canDelete && (
        <div
          className={'delete-btn' + (t.deleted ? ' deleted' : '')}
          title={t.deleted ? '削除を取り消す' : 'タスクを削除する'}
          onClick={function(e) { e.stopPropagation(); onDelete(t.id); }}
        >
          {t.deleted ? '−' : '×'}
        </div>
      )}

      {/* チェックボタン（削除済みは操作不可）*/}
      <div
        className={'check-btn' + (checkClass ? (' ' + checkClass) : '')}
        title={t.deleted ? '削除済み' : canForward ? STATUS_FORWARD_LABEL[t.status] : '変更不可'}
        style={{ cursor: canForward ? 'pointer' : 'default', opacity: canForward ? 1 : 0.4 }}
        onClick={function(e) { e.stopPropagation(); if (canForward) onForward(t.id); }}
      />

      <div className="task-body">

        {/* 削除済みバナー */}
        {t.deleted && (
          <div style={{
            fontSize:'11px', color:'var(--hint)',
            marginBottom:4,
            display:'flex', alignItems:'center', gap:6
          }}>
            <span style={{
              padding:'1px 8px', borderRadius:'99px',
              background:'var(--surface2)', border:'1px solid var(--border)'
            }}>削除済み</span>
            <span>「−」ボタンで取り消せます</span>
          </div>
        )}

        {/* タイトル行 */}
        <div className="task-title-row">
          <div className={'task-title' + (t.deleted ? ' task-title-deleted' : '')}>{t.title}</div>
          <div className="badges">
            <span className={'badge badge-' + t.priority}>{PRIORITY_LABEL[t.priority]}</span>
            <span className={'badge ' + STATUS_DEF[t.status].color}>
              {STATUS_LABEL[t.status]}
            </span>
          </div>
        </div>

        {/* 説明文 */}
        {t.desc && (
          <div style={{fontSize:'12px', color:'var(--hint)', marginBottom:6, lineHeight:1.5}}>
            {t.desc}
          </div>
        )}

        {/* メタ情報 + アクションボタン（削除済みはボタン非表示）*/}
        <div className="task-meta" style={{justifyContent:'space-between'}}>
          <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
            {t.tags.map(function(tag) { return <span key={tag} className="tag">{tag}</span>; })}
            <span className={'due' + (isOverdue ? ' overdue' : '')}>
              {t.done ? ('完了: ' + t.due) : ('期限: ' + t.due)}
            </span>
          </div>

          {!t.deleted && (
            <div style={{display:'flex', gap:6, alignItems:'center', flexShrink:0}}>

              {canEmergency && (
                <button
                  className="btn-status emergency"
                  title="通常フローを省略して完了にする（コメント必須）"
                  onClick={function(e) { e.stopPropagation(); onEmergency(t.id); }}
                >
                  {STATUS_EMERGENCY_LABEL[t.status]}
                </button>
              )}

              {canBack && (
                <button
                  className="btn-status back"
                  title="着手中に戻す（コメント必須）"
                  onClick={function(e) { e.stopPropagation(); onBack(t.id); }}
                >
                  差戻し
                </button>
              )}

              {canForward && (
                <button
                  className="btn-status forward"
                  onClick={function(e) { e.stopPropagation(); onForward(t.id); }}
                >
                  {STATUS_FORWARD_LABEL[t.status]}
                </button>
              )}

              {t.history && t.history.length > 0 && (
                <button
                  className={'btn-status history-btn' + (showHistory ? ' active' : '')}
                  title="変更履歴を見る"
                  onClick={function(e) { e.stopPropagation(); setShowHistory(function(s) { return !s; }); }}
                >
                  {'履歴 ' + t.history.length}
                </button>
              )}
            </div>
          )}
        </div>

        {/* 履歴パネル */}
        {showHistory && t.history.length > 0 && (
          <div className="history-panel">
            {[...t.history].reverse().map(function(h) {
              return (
                <div key={h.id} className="history-item">
                  <div className="history-arrow">
                    <span
                      className={'badge ' + (STATUS_DEF[h.fromStatus] ? STATUS_DEF[h.fromStatus].color : '')}
                      style={{fontSize:'10px', padding:'1px 6px'}}
                    >
                      {STATUS_LABEL[h.fromStatus] || h.fromStatus}
                    </span>
                    <span style={{color:'var(--hint)', fontSize:'11px', margin:'0 4px'}}>→</span>
                    <span
                      className={'badge ' + (STATUS_DEF[h.toStatus] ? STATUS_DEF[h.toStatus].color : '')}
                      style={{fontSize:'10px', padding:'1px 6px'}}
                    >
                      {STATUS_LABEL[h.toStatus] || h.toStatus}
                    </span>
                    <span style={{fontSize:'11px', color:'var(--hint)', marginLeft:8}}>
                      {h.changedAt.replace('T', ' ').slice(0, 16)}
                    </span>
                    {h.isEmergency && (
                      <span style={{fontSize:'10px', color:'var(--amber)', marginLeft:4}}>⚡ 緊急</span>
                    )}
                  </div>
                  {h.comment && (
                    <div style={{fontSize:'12px', color:'var(--muted)', marginTop:3, paddingLeft:4}}>
                      {h.comment}
                    </div>
                  )}
                  <div style={{fontSize:'11px', color:'var(--hint)', marginTop:2, paddingLeft:4}}>
                    {h.changedBy || ''}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
