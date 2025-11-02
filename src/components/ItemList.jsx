import React from "react";
import ItemRow from "./ItemRow";

export default function ItemList({ items, onToggle, onRemove, onEdit }){
  return (
    <div className="list">
      {items.length === 0 ? (
        <div className="badge">Žádné položky pro zvolený filtr.</div>
      ) : items.map(it => (
        <ItemRow key={it.id} item={it} onToggle={onToggle} onRemove={onRemove} onEdit={onEdit} />
      ))}
    </div>
  );
}
