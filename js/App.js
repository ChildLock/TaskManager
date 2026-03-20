// ============================================================
// App.js
// 役割: アプリ全体の状態管理と、コンポーネントの組み立て（レイアウト）を担う
//
// 責務の分離:
//   - useState / useMemo でアプリの状態と派生データを管理する
//   - イベントハンドラ（handle~）でユーザー操作に応じた状態変更を行う
//   - 各コンポーネントに props を渡してレイアウトを組み立てる
//   - 自分自身は具体的なUIパーツを描画しない
// ============================================================
function App() {

  // ──────────────────────────────────────────
  // State（アプリ全体で共有する状態）
  // ──────────────────────────────────────────
  const [tasks,  setTasks]  = useState(INITIAL_TASKS);
  const [nav,    setNav]    = useState('all');   // 選択中のステータスフィルター
  const [filter, setFilter] = useState('all');   // 選択中の優先度フィルター
  const [modal,  setModal]  = useState(false);   // 新規作成モーダルの開閉
  const [form,   setForm]   = useState({         // モーダルのフォーム入力値
    title: '', desc: '', priority: 'md', tags: '', due: ''
  });

  // ──────────────────────────────────────────
  // 派生データ（useMemo: 依存値が変わった時だけ再計算）
  // ──────────────────────────────────────────

  // ナビの件数バッジ用：ステータスごとのタスク件数
  const counts = useMemo(() => ({
    all:  tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    wip:  tasks.filter(t => t.status === 'wip').length,
    done: tasks.filter(t => t.status === 'done').length,
  }), [tasks]);

  // ステータス（nav）+ 優先度（filter）でフィルタした表示リスト
  const visible = useMemo(() => {
    let t = nav === 'all' ? tasks : tasks.filter(t => t.status === nav);
    if (filter !== 'all') t = t.filter(t => t.priority === filter);
    return t;
  }, [tasks, nav, filter]);

  // 完了率（%）: 完了件数 ÷ 全件数 × 100
  const doneRate = Math.round((counts.done / tasks.length) * 100) || 0;

  // 期限切れ件数: 未完了 かつ 期限日 < 今日
  const overdue = tasks.filter(t => !t.done && t.due < TODAY).length;

  // ──────────────────────────────────────────
  // イベントハンドラ
  // ──────────────────────────────────────────

  /**
   * タスクの完了/未完了をトグルする
   * done フラグと status を連動して更新する
   * 実際のアプリでは: PATCH /api/tasks/:id/status
   */
  function handleToggle(id) {
    setTasks(prev => prev.map(t =>
      t.id === id
        ? { ...t, done: !t.done, status: !t.done ? 'done' : 'todo' }
        : t
    ));
  }

  /**
   * モーダルのフォームフィールドを部分更新する
   * TaskModal の onChange prop から呼ばれる
   * computed property name: { [field]: value } で動的にキーを指定できる
   */
  function handleFormChange(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  /**
   * フォームの内容で新しいタスクを追加する
   * タイトルが空の場合は何もしない（バリデーション）
   * 実際のアプリでは: POST /api/tasks
   */
  function handleAddTask() {
    if (!form.title.trim()) return;

    const newTask = {
      id:       Date.now(),  // 仮のID（本番ではサーバーが採番）
      title:    form.title.trim(),
      desc:     form.desc.trim(),
      status:   'todo',      // 新規作成は常に「未着手」から
      priority: form.priority,
      // "API, テスト, " → ['API', 'テスト']（空文字を除去）
      tags: form.tags
        ? form.tags.split(',').map(s => s.trim()).filter(Boolean)
        : [],
      due:  form.due || '未設定',
      done: false,
    };

    setTasks(prev => [newTask, ...prev]); // リストの先頭に追加
    setForm({ title:'', desc:'', priority:'md', tags:'', due:'' }); // フォームリセット
    setModal(false); // モーダルを閉じる
  }

  // ──────────────────────────────────────────
  // レンダリング（レイアウトの組み立て）
  // ──────────────────────────────────────────
  return (
    <div className="app">

      {/* サイドバー: ナビゲーション */}
      <Sidebar
        nav={nav}
        counts={counts}
        onNav={setNav}
      />

      {/* メインエリア */}
      <main className="main">

        {/* トップバー: ページタイトル + 新規作成ボタン */}
        <TopBar
          nav={nav}
          onNewTask={() => setModal(true)}
        />

        {/* フィルターバー: 優先度フィルター */}
        <FilterBar
          filter={filter}
          visibleCount={visible.length}
          onFilter={setFilter}
        />

        {/* 統計行: 合計・進行中・期限切れ・完了率 */}
        <StatsRow
          total={tasks.length}
          wipCount={counts.wip}
          overdue={overdue}
          doneRate={doneRate}
        />

        {/* タスク一覧 */}
        <TaskList
          tasks={visible}
          onToggle={handleToggle}
        />

      </main>

      {/* 新規タスク作成モーダル（modal === true の時だけレンダリング）*/}
      {modal && (
        <TaskModal
          form={form}
          onChange={handleFormChange}
          onSubmit={handleAddTask}
          onClose={() => setModal(false)}
        />
      )}

    </div>
  );
}

// ──────────────────────────────────────────
// マウント
// ──────────────────────────────────────────
// React アプリを index.html の #root 要素にマウントする
// このファイルが最後に読み込まれるため、全コンポーネントが揃った状態でマウントされる
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
