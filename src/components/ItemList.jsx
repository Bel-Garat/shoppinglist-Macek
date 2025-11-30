import React from "react";
import ItemRow from "./ItemRow";

function ItemList({ items, onToggleItem, onRemoveItem }) {
  if (items.length === 0) {
    return <div className="empty">Žádné položky.</div>;
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemRow
          key={item.id}
          item={item}
          onToggleItem={onToggleItem}
          onRemoveItem={onRemoveItem}
        />
      ))}
    </div>
  );
}

export default ItemList;
