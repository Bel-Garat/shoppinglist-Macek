import React from "react";

function ItemRow({ item, onToggleItem, onRemoveItem }) {
  return (
    <div className={`item-row ${item.done ? "item-row--done" : ""}`}>
      <label className="item-main">
        <input
          type="checkbox"
          checked={item.done}
          onChange={() => onToggleItem(item.id)}
        />
        <span className="item-name">{item.name}</span>
      </label>
      <span className="item-qty">Množství: {item.quantity}</span>
      <button className="danger" onClick={() => onRemoveItem(item.id)}>
        Smazat
      </button>
    </div>
  );
}

export default ItemRow;
