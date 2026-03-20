// ============================================================
// App.js
// 役割: アプリ全体の状態管理と、コンポーネントの組み立て
//
// ステータス遷移ルール（constants.js の STATUS_TRANSITIONS に従う）:
//   todo    → wip（通常着手・コメントなし）
//   todo    → done（緊急完了・コメント必須・isEmergency:true）
//   wip     → review（確認依頼・コメントなし）
//   review  → done（承認・コメントなし）
//   review  → wip（差戻し・コメント必須）
//   done    → 移動不可
//
// 差戻し・緊急完了はコメント入力モーダル（ReviewBackModal）を経由する
// ============================================================
function App() {

  // ──────────────────────────────────────────
  // State
  // ──────────────────────────────────────────
  const [tasks,         setTasks]         = useState(INITIAL_TASKS);
  const [nav,           setNav]           = useState('all');
  const [filter,        setFilter]        = useState('all');
  const [modal,         setModal]         = useState(false);
  // コメント入力モーダル: { id, type:'back'|'emergency' } | null
  const [commentTarget, setCommentTarget] = useState(null);
  const [form,          setForm]          = useState({
    title: '', desc: '', priority: 'md', tags: '', due: ''
  });

  // 現在のログインユーザー名（本番ではJWT等から取得する）
  var CURRENT_USER = '田中 太郎';

  // ──────────────────────────────────────────
  // 派生データ
  // ──────────────────────────────────────────
  const counts = useMemo(function() {
    return {
      all:    tasks.length,
      todo:   tasks.filter(function(t) { return t.status === 'todo'; }).length,
      wip:    tasks.filter(function(t) { return t.status === 'wip'; }).length,
      review: tasks.filter(function(t) { return t.status === 'review'; }).length,
      done:   tasks.filter(function(t) { return t.status === 'done'; }).length,
    };
  }, [tasks]);

  const visible = useMemo(function() {
    var t = nav === 'all' ? tasks : tasks.filter(function(t) { return t.status === nav; });
    if (filter !== 'all') t = t.filter(function(t) { return t.priority === filter; });
    return t;
  }, [tasks, nav, filter]);

  var doneRate = Math.round((counts.done / tasks.length) * 100) || 0;
  var overdue  = tasks.filter(function(t) { return !t.done && t.due < TODAY; }).length;

  // ──────────────────────────────────────────
  // ステータス変更の共通ロジック
  // ──────────────────────────────────────────

  /**
   * ステータスを変更して履歴を追記する
   * @param {number}  id          - 対象タスクID
   * @param {string}  nextStatus  - 変更後ステータス
   * @param {string}  comment     - 変更理由
   * @param {boolean} isEmergency - 緊急完了フラグ
   */
  function changeStatus(id, nextStatus, comment, isEmergency) {
    setTasks(function(prev) {
      return prev.map(function(t) {
        if (t.id !== id) return t;
        var entry = {
          id:          Date.now(),
          taskId:      id,
          fromStatus:  t.status,
          toStatus:    nextStatus,
          comment:     comment || '',
          changedAt:   new Date().toISOString().slice(0, 16),
          changedBy:   CURRENT_USER,
          isEmergency: !!isEmergency,
        };
        return Object.assign({}, t, {
          status:  nextStatus,
          done:    nextStatus === 'done',
          history: (t.history || []).concat([entry]),
        });
      });
    });
  }

  // ──────────────────────────────────────────
  // イベントハンドラ
  // ──────────────────────────────────────────

  /** 削除トグル: deleted フラグを反転する（物理削除はしない）*/
  function handleDelete(id) {
    setTasks(function(prev) {
      return prev.map(function(t) {
        if (t.id !== id) return t;
        return Object.assign({}, t, { deleted: !t.deleted });
      });
    });
  }

  /** 通常前進: コメント不要 */
  function handleForward(id) {
    var task = tasks.find(function(t) { return t.id === id; });
    if (!task) return;
    var next = (STATUS_TRANSITIONS[task.status] || {}).forward;
    if (!next) return;
    changeStatus(id, next, '', false);
  }

  /** 差戻し: コメント入力モーダルを開く */
  function handleBackRequest(id) {
    setCommentTarget({ id: id, type: 'back' });
  }

  /** 緊急完了: コメント入力モーダルを開く */
  function handleEmergencyRequest(id) {
    setCommentTarget({ id: id, type: 'emergency' });
  }

  /** コメント入力モーダルで確定 */
  function handleCommentSubmit(comment) {
    if (!commentTarget) return;
    var task = tasks.find(function(t) { return t.id === commentTarget.id; });
    if (!task) return;

    var nextStatus = commentTarget.type === 'back'
      ? (STATUS_TRANSITIONS[task.status] || {}).back
      : (STATUS_TRANSITIONS[task.status] || {}).emergency;

    if (!nextStatus) return;
    changeStatus(commentTarget.id, nextStatus, comment, commentTarget.type === 'emergency');
    setCommentTarget(null);
  }

  /** フォームフィールドの部分更新 */
  function handleFormChange(field, value) {
    setForm(function(prev) {
      var next = Object.assign({}, prev);
      next[field] = value;
      return next;
    });
  }

  /** 新規タスク追加 */
  function handleAddTask() {
    if (!form.title.trim()) return;
    var newTask = {
      id:       Date.now(),
      title:    form.title.trim(),
      desc:     form.desc.trim(),
      status:   'todo',
      priority: form.priority,
      tags:     form.tags
        ? form.tags.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
        : [],
      due:      form.due || '未設定',
      done:     false,
      deleted:  false,
      history:  [],
    };
    setTasks(function(prev) { return [newTask].concat(prev); });
    setForm({ title:'', desc:'', priority:'md', tags:'', due:'' });
    setModal(false);
  }

  // ──────────────────────────────────────────
  // レンダリング
  // ──────────────────────────────────────────
  return (
    <div className="app">

      <Sidebar nav={nav} counts={counts} onNav={setNav} />

      <main className="main">

        <TopBar nav={nav} onNewTask={function() { setModal(true); }} />

        <FilterBar filter={filter} visibleCount={visible.length} onFilter={setFilter} />

        <StatsRow
          total={tasks.length}
          wipCount={counts.wip}
          overdue={overdue}
          doneRate={doneRate}
        />

        {/* 確認依頼待ちバナー */}
        {counts.review > 0 && (
          <div
            style={{
              margin:'8px 28px 0',
              padding:'8px 16px',
              background:'var(--accent-dim)',
              border:'1px solid rgba(212,240,100,0.3)',
              borderRadius:'var(--r-sm)',
              fontSize:'13px',
              color:'var(--accent)',
              cursor:'pointer',
            }}
            onClick={function() { setNav('review'); }}
          >
            {'確認依頼待ちが ' + counts.review + ' 件あります　→ 確認する'}
          </div>
        )}

        <TaskList
          tasks={visible}
          onForward={handleForward}
          onBack={handleBackRequest}
          onEmergency={handleEmergencyRequest}
          onDelete={handleDelete}
        />

      </main>

      {/* 新規作成モーダル */}
      {modal && (
        <TaskModal
          form={form}
          onChange={handleFormChange}
          onSubmit={handleAddTask}
          onClose={function() { setModal(false); }}
        />
      )}

      {/* 差戻し / 緊急完了 コメント入力モーダル */}
      {commentTarget && (
        <ReviewBackModal
          type={commentTarget.type}
          taskTitle={(tasks.find(function(t) { return t.id === commentTarget.id; }) || {}).title || ''}
          onSubmit={handleCommentSubmit}
          onClose={function() { setCommentTarget(null); }}
        />
      )}

    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
