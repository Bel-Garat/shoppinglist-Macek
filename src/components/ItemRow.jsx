import React, { useState } from "react";

export default function ItemRow({ item, onToggle, onRemove, onEdit }){
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.name);
  const [qty, setQty] = useState(item.qty);

  const save = () => {
    onEdit(item.id, { name: name.trim() || item.name, qty: Number(qty)||1 });
    setEditing(false);
  };

  return (
    <div className={"item" + (item.done ? " done" : "")}>
      <input type="checkbox" checked={item.done} onChange={()=>onToggle(item.id)} />
      {editing ? (
        <div className="row">
          <input value={name} onChange={e=>setName(e.target.value)} />
          <span className="kbd">id:{item.id.slice(0,4)}</span>
        </div>
      ) : (
        <div className="row">
          <strong>{item.name}</strong>
          <span className="badge">id:{item.id.slice(0,4)}</span>
        </div>
      )}

      {editing ? (
        <input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} />
      ) : (
        <span className="badge">Množství: {item.qty}</span>
      )}

      <div className="row" style={{justifyContent:"flex-end"}}>
        {editing ? (
          <>
            <button className="success" onClick={save}>Uložit</button>
            <button onClick={()=>setEditing(false)}>Zrušit</button>
          </>
        ) : (
          <>
            <button className="primary" onClick={()=>setEditing(true)}>Upravit</button>
            <button className="danger" onClick={()=>onRemove(item.id)}>Smazat</button>
          </>
        )}
      </div>
    </div>
  );
}
