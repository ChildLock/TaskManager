// ============================================================
// TaskModal.js
// 役割: 新規タスク作成フォームをモーダルダイアログとして表示する
//       フォームの状態は App が持ち、このコンポーネントは表示のみ担当する
//       タイトルが空の場合は「作成する」ボタンを無効化する
//
// props:
//   form      - フォームの現在値 { title, desc, priority, tags, due }
//   onChange  - フィールド更新のコールバック (field: string, value: string) => void
//   onSubmit  - 作成ボタン / Enterキー押下時のコールバック () => void
//   onClose   - キャンセル / オーバーレイクリック時のコールバック () => void
// ============================================================
function TaskModal({ form, onChange, onSubmit, onClose }) {
  // フィールド名と値を受け取って onChange に渡すショートハンド
  const update = (field, value) => onChange(field, value);

  return (
    // ── オーバーレイ（クリックでモーダルを閉じる）──
    <div className="modal-overlay" onClick={onClose}>

      {/*
        ── モーダル本体 ──
        e.stopPropagation(): モーダル内のクリックがオーバーレイに伝播するのを防ぐ
        （モーダル内をクリックしても閉じないようにする）
      */}
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-title">新規タスクを作成</div>

        {/* タイトル（必須）*/}
        <div className="field">
          <label>タイトル *</label>
          <input
            autoFocus  // モーダルを開いた直後に自動フォーカス
            placeholder="タスクのタイトルを入力..."
            value={form.title}
            onChange={e => update('title', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && onSubmit()} // Enter でも作成できる
          />
        </div>

        {/* 詳細説明（任意）*/}
        <div className="field">
          <label>詳細（任意）</label>
          <textarea
            placeholder="タスクの説明を入力..."
            value={form.desc}
            onChange={e => update('desc', e.target.value)}
          />
        </div>

        {/* 優先度 + 期限（2カラム横並び）*/}
        <div className="field-row">
          <div className="field">
            <label>優先度</label>
            <select
              value={form.priority}
              onChange={e => update('priority', e.target.value)}
            >
              <option value="hi">高</option>
              <option value="md">中</option>
              <option value="lo">低</option>
            </select>
          </div>
          <div className="field">
            <label>期限</label>
            <input
              type="date"
              value={form.due}
              onChange={e => update('due', e.target.value)}
            />
          </div>
        </div>

        {/* タグ（カンマ区切りで複数指定）*/}
        <div className="field">
          <label>タグ（カンマ区切り）</label>
          <input
            placeholder="例: バックエンド, API, テスト"
            value={form.tags}
            onChange={e => update('tags', e.target.value)}
          />
        </div>

        {/* アクションボタン */}
        <div className="modal-actions">
          <button className="btn btn-ghost" onClick={onClose}>
            キャンセル
          </button>
          {/* タイトルが空の時は disabled にしてクリックを無効化 */}
          <button
            className="btn btn-primary"
            onClick={onSubmit}
            disabled={!form.title.trim()}
          >
            作成する
          </button>
        </div>

      </div>
    </div>
  );
}
