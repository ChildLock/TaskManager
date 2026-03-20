// ============================================================
// FilterBar.js
// 役割: 優先度フィルターのボタン群と現在の表示件数を表示する
//       ボタンクリックで App の優先度フィルターを切り替える
//
// props:
//   filter       - 現在選択中の優先度フィルター値 ('all'|'hi'|'md'|'lo')
//   visibleCount - フィルター後の表示件数
//   onFilter     - フィルターボタンクリック時のコールバック (value: string) => void
// ============================================================
function FilterBar({ filter, visibleCount, onFilter }) {
  // フィルターボタンの選択肢 [値, 表示ラベル] の配列
  const OPTIONS = [
    ['all', 'すべて'],
    ['hi',  '高'],
    ['md',  '中'],
    ['lo',  '低'],
  ];

  return (
    <div className="filters">

      <span style={{fontSize:'12px', color:'var(--hint)', marginRight:2}}>優先度</span>

      {/* フィルターボタンをループで生成 */}
      {OPTIONS.map(([value, label]) => (
        <button
          key={value}
          className={`filter-pill${filter === value ? ' active' : ''}`}
          onClick={() => onFilter(value)}
        >
          {label}
        </button>
      ))}

      {/* 区切り線 */}
      <div className="filter-sep" />

      {/* フィルター後の表示件数 */}
      <span className="sort-label">{visibleCount} 件表示</span>

    </div>
  );
}
