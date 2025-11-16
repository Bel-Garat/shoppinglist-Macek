import React, { useState } from "react";

export default function AddItemForm({ onAdd }){
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);

  const submit = (e) => {
    e.preventDefault();
    if(!name.trim()) return;
    onAdd(name, qty);
    setName("");
    setQty(1);
  };

  return (
    <form className="row" onSubmit={submit}>
      <input
        value={name}
        onChange={e=>setName(e.target.value)}
        placeholder="Název položky"
      />
      <input
        type="number"
        min="1"
        value={qty}
        onChange={e=>setQty(e.target.value)}
        style={{width:90}}
      />
      <button type="submit" className="success">+ Přidat</button>
    </form>
  );
}
