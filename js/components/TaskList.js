// ============================================================
// TaskList.js
// 役割: フィルター済みのタスク配列を受け取り、TaskCard を並べて表示する
//
// props:
//   tasks       - 表示するタスクの配列
//   onForward   - 通常前進 (id) => void
//   onBack      - 差戻し依頼 (id) => void
//   onEmergency - 緊急完了依頼 (id) => void
//   onDelete    - 削除トグル (id) => void
// ============================================================
function TaskList({ tasks, onForward, onBack, onEmergency, onDelete }) {

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
      {tasks.map(function(task, i) {
        return (
          <TaskCard
            key={task.id}
            task={task}
            index={i}
            onForward={onForward}
            onBack={onBack}
            onEmergency={onEmergency}
            onDelete={onDelete}
          />
        );
      })}
    </div>
  );
}
