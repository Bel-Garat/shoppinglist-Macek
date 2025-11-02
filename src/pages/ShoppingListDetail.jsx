import React, { useMemo, useState } from "react";
import AddItemForm from "../components/AddItemForm";
import ItemList from "../components/ItemList";
import MemberList from "../components/MemberList";

const INITIAL_DATA = {
  id: "list-1",
  name: "Sobota nákup",
  ownerId: "u1",
  members: [
    { id: "u1", name: "Karel", role: "vlastník" },
    { id: "u2", name: "Jan", role: "člen" },
    { id: "u3", name: "Marek", role: "člen" },
  ],
  items: [
    { id: "i1", name: "Mléko", qty: 2, done: false, ts: Date.now()-50000 },
    { id: "i2", name: "Chléb", qty: 1, done: true, ts: Date.now()-40000 },
    { id: "i3", name: "Jablka", qty: 6, done: false, ts: Date.now()-30000 },
  ]
};

export default function ShoppingListDetail(){
  const [title, setTitle] = useState(INITIAL_DATA.name);
  const [items, setItems] = useState(INITIAL_DATA.items);
  const [filter, setFilter] = useState("all"); 
  const [sort, setSort] = useState("recent"); 

  const filtered = useMemo(() => {
    let arr = [...items];
    if(filter === "open") arr = arr.filter(i => !i.done);
    if(filter === "done") arr = arr.filter(i => i.done);
    if(sort === "alpha") arr.sort((a,b)=>a.name.localeCompare(b.name));
    if(sort === "recent") arr.sort((a,b)=>b.ts - a.ts);
    return arr;
  }, [items, filter, sort]);

  const addItem = (name, qty) => {
    if(!name.trim()) return;
    setItems(prev => [
      { id: Math.random().toString(36).slice(2), name, qty: Number(qty)||1, done:false, ts: Date.now() },
      ...prev
    ]);
  };

  const toggleDone = (id) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, done: !i.done, ts: Date.now() } : i));
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const editItem = (id, patch) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch, ts: Date.now() } : i));
  };

  return (
    <div className="card">
      <div className="space-between">
        <div className="row">
          <h1 style={{marginRight:12}}>{title}</h1>
          <span className="badge">Items: {items.length}</span>
        </div>
        <div className="row">
          <button className="primary" onClick={()=>{
            const n = prompt("Přejmenovat seznam:", title);
            if(n !== null) setTitle(n);
          }}>Přejmenovat</button>
          <button className="danger" onClick={()=>alert("")}>Smazat</button>
        </div>
      </div>

      <hr />

      <div className="space-between">
        <AddItemForm onAdd={addItem} />
        <div className="row">
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">Vše</option>
            <option value="open">Otevřené</option>
            <option value="done">Vyřešené</option>
          </select>
          <select value={sort} onChange={e=>setSort(e.target.value)}>
            <option value="recent">Řazení: Nejnovější</option>
            <option value="alpha">Řazení: A→Z</option>
          </select>
        </div>
      </div>

      <ItemList items={filtered} onToggle={toggleDone} onRemove={removeItem} onEdit={editItem} />

      <hr />
      <h3>Členové</h3>
      <MemberList members={INITIAL_DATA.members} />
    </div>
  );
}
