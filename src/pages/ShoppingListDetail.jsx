import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddItemForm from "../components/AddItemForm";
import ItemList from "../components/ItemList";
import MemberList from "../components/MemberList";

export default function ShoppingListDetail({ lists, onUpdateList, onDeleteList }){
  const { id } = useParams();
  const navigate = useNavigate();

  const list = useMemo(
    () => lists.find(l => l.id === id) || lists[0],
    [lists, id]
  );

  const [title, setTitle] = useState(list.name);
  const [items, setItems] = useState(list.items);
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

  const syncUpdate = (patch) => {
    onUpdateList(list.id, { ...patch });
  };

  const handleRename = () => {
    const n = window.prompt("Přejmenovat nákupní seznam:", title);
    if(n !== null && n.trim()){
      setTitle(n.trim());
      syncUpdate({ name: n.trim(), items });
    }
  };

  const addItem = (name, qty) => {
    const newItem = {
      id: Math.random().toString(36).slice(2),
      name: name.trim(),
      qty: Number(qty) || 1,
      done: false,
      ts: Date.now()
    };
    const next = [newItem, ...items];
    setItems(next);
    syncUpdate({ name: title, items: next });
  };

  const toggleDone = (itemId) => {
    const next = items.map(i => i.id === itemId ? { ...i, done: !i.done, ts: Date.now() } : i);
    setItems(next);
    syncUpdate({ name: title, items: next });
  };

  const removeItem = (itemId) => {
    const next = items.filter(i => i.id !== itemId);
    setItems(next);
    syncUpdate({ name: title, items: next });
  };

  const editItem = (itemId, patch) => {
    const next = items.map(i => i.id === itemId ? { ...i, ...patch, ts: Date.now() } : i);
    setItems(next);
    syncUpdate({ name: title, items: next });
  };

  const handleDeleteList = () => {
    const ok = window.confirm(`Opravdu chcete smazat celý seznam "${title}"?`);
    if(ok){
      onDeleteList(list.id);
      navigate("/");
    }
  };

  return (
    <div className="app-shell">
      <button onClick={() => navigate("/")} style={{marginBottom:12}}>
        ← Zpět na přehled
      </button>

      <div className="list-card">
        <div className="app-header">
          <div className="row">
            <h1 style={{marginRight:12}}>{title}</h1>
            <span className="badge">Položek: {items.length}</span>
          </div>
          <div className="row">
            <button className="primary" onClick={handleRename}>Přejmenovat</button>
            <button className="danger" onClick={handleDeleteList}>Smazat seznam</button>
          </div>
        </div>

        <hr />

        <div className="row" style={{justifyContent:"space-between"}}>
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

        <ItemList
          items={filtered}
          onToggle={toggleDone}
          onRemove={removeItem}
          onEdit={editItem}
        />

        <hr />
        <h3>Členové</h3>
        <MemberList members={list.members} />
      </div>
    </div>
  );
}
