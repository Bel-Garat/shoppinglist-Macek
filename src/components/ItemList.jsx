import React from "react";
import ItemRow from "./ItemRow";

export default function ItemList({ items, onToggle, onRemove, onEdit }){
  if(items.length === 0){
    return <div className="app-subtitle">Žádné položky. Přidejte první položku pomocí formuláře výše.</div>;
  }
  return (
    <div className="item-list">
      {items.map(it => (
        <ItemRow
          key={it.id}
          item={it}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
