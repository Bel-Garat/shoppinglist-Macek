import React, { useState } from "react";

export default function ItemRow({ item, onToggle, onRemove, onEdit }){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.qty);

  const save = () => {
    const patch = {
      name: name.trim() || item.name,
      qty: Number(qty) || 1
    };
    onEdit(item.id, patch);
    setEditing(false);
  };

  return (
    <div className={"item-row" + (item.done ? " done" : "")}>
      <input
        type="checkbox"
        checked={item.done}
        onChange={() => onToggle(item.id)}
      />

      {editing ? (
        <input value={name} onChange={e=>setName(e.target.value)} />
      ) : (
        <strong>{item.name}</strong>
      )}

      {editing ? (
        <input
          type="number"
          min="1"
          value={qty}
          onChange={e=>setQty(e.target.value)}
        />
      ) : (
        <span className="badge">Množství: {item.qty}</span>
      )}

      <div className="row" style={{justifyContent:"flex-end"}}>
        {editing ? (
          <>
            <button className="success" onClick={save}>Uložit</button>
            <button onClick={() => {setEditing(false); setName(item.name); setQty(item.qty);}}>Zrušit</button>
          </>
        ) : (
          <>
            <button className="primary" onClick={() => setEditing(true)}>Upravit</button>
            <button className="danger" onClick={() => onRemove(item.id)}>Smazat</button>
          </>
        )}
      </div>
    </div>
  );
}
