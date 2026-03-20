// ============================================================
// ReviewBackModal.js
// 役割: コメント入力が必要な操作（差戻し・緊急完了）のモーダル
//       type='back'      → 差戻しモーダル（赤）
//       type='emergency' → 緊急完了モーダル（アンバー）
//
// props:
//   type      - 'back' | 'emergency'
//   taskTitle - 対象タスクのタイトル（確認表示用）
//   onSubmit  - 確定時コールバック (comment: string) => void
//   onClose   - キャンセル時コールバック () => void
// ============================================================
function ReviewBackModal({ type, taskTitle, onSubmit, onClose }) {
  const { useState: useLocalState } = React;
  const [comment, setComment] = useLocalState('');

  var isBack      = type === 'back';
  var accentColor = isBack ? 'var(--red)' : 'var(--amber)';
  var accentDim   = isBack ? 'var(--red-dim)' : 'var(--amber-dim)';
  var title       = isBack ? '差し戻し' : '緊急完了';
  var placeholder = isBack
    ? '例: ○○の部分を修正してください'
    : '例: 緊急対応のため手順を省略して完了とします';
  var submitLabel = isBack ? '差し戻す' : '緊急完了にする';
  var description = isBack
    ? '差し戻し理由を入力してください（必須）'
    : '通常フローを省略する理由を入力してください（必須）';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={function(e) { e.stopPropagation(); }} style={{maxWidth:'420px'}}>

        {/* ヘッダー */}
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:16}}>
          <div style={{
            width:32, height:32, borderRadius:8,
            background: accentDim,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0
          }}>
            {isBack ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2L2 12h12L8 2z" stroke={accentColor} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
                <path d="M8 7v3M8 11.5v.5" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 2v8M5 7l3 3 3-3" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 13h10" stroke={accentColor} strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            )}
          </div>
          <div className="modal-title" style={{margin:0, color: accentColor}}>{title}</div>
        </div>

        {/* 対象タスク名 */}
        <div style={{
          background:'var(--surface2)', borderRadius:'var(--r-sm)',
          padding:'8px 12px', marginBottom:12,
          fontSize:'13px', color:'var(--muted)'
        }}>
          {taskTitle}
        </div>

        {/* 説明 */}
        <div style={{fontSize:'12px', color:'var(--hint)', marginBottom:12}}>
          {description}
        </div>

        {/* コメント入力（必須）*/}
        <div className="field">
          <label>理由 *</label>
          <textarea
            autoFocus
            placeholder={placeholder}
            value={comment}
            onChange={function(e) { setComment(e.target.value); }}
            style={{minHeight:'80px'}}
          />
        </div>

        {/* ボタン */}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            キャンセル
          </button>
          <button
            className="btn"
            style={{
              background:  comment.trim() ? accentColor : 'var(--surface2)',
              color:       comment.trim() ? '#fff'       : 'var(--hint)',
              cursor:      comment.trim() ? 'pointer'    : 'not-allowed',
              border:      'none',
            }}
            disabled={!comment.trim()}
            onClick={function() { if (comment.trim()) onSubmit(comment.trim()); }}
          >
            {submitLabel}
          </button>
        </div>

      </div>
    </div>
  );
}
