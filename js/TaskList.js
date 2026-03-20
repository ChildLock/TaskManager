// ============================================================
// TaskList.js
// 役割: フィルター済みのタスク配列を受け取り、TaskCard を並べて表示する
//       タスクが0件の場合は空状態メッセージを表示する
//
// props:
//   tasks    - 表示するタスクの配列（App でフィルター済みのもの）
//   onToggle - 完了トグルのコールバック。TaskCard に渡す (id: number) => void
// ============================================================
function TaskList({ tasks, onToggle }) {

  // タスクが0件の場合は空状態を表示
  if (tasks.length === 0) {
    return (
      <div className="task-area">
        <div className="empty">
          <div className="empty-icon">✓</div>
          <div className="empty-text">タスクがありません</div>
        </div>
      </div>
    );
  }

  return (
    <div className="task-area">
      {tasks.map((task, i) => (
        // TaskCard に task・index・onToggle を渡す
        // key には task.id を使い、Reactが差分更新できるようにする
        <TaskCard
          key={task.id}
          task={task}
          index={i}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
