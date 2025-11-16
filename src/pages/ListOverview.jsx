import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ListOverview({ lists, onCreateList, onDeleteList }){
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newOwner, setNewOwner] = useState("");

  const handleCreate = (e) => {
    e.preventDefault();
    if(!newName.trim()) return;
    onCreateList({
      name: newName.trim(),
      owner: newOwner.trim() || "Neurčeno"
    });
    setNewName("");
    setNewOwner("");
    setIsModalOpen(false);
  };

  const handleDelete = (list) => {
    const ok = window.confirm(`Opravdu chcete smazat nákupní seznam "${list.name}"?`);
    if(ok){
      onDeleteList(list.id);
    }
  };

  return (
    <div className="app-shell">
      <div className="app-header">
        <div>
          <div className="app-title">Nákupní seznamy</div>
          <div className="app-subtitle">
            Přehled všech nákupních seznamů:
          </div>
        </div>
        <button className="success" onClick={() => setIsModalOpen(true)}>+ Nový seznam</button>
      </div>

      <div className="card">
        {lists.length === 0 ? (
          <div className="app-subtitle">Zatím nemáte žádné seznamy. Vytvořte první pomocí tlačítka „Nový seznam“.</div>
        ) : (
          <div className="grid">
            {lists.map(list => (
              <div key={list.id} className="tile">
                <div className="tile-title">{list.name}</div>
                <div className="badge-row">
                  <span className="badge">Vlastník: {list.owner}</span>
                  <span className="badge">Členové: {list.members.length}</span>
                  <span className="badge">Položky: {list.items.length}</span>
                </div>
                <div className="row" style={{marginTop:8}}>
                  <button className="primary" onClick={() => navigate(`/list/${list.id}`)}>Otevřít detail</button>
                  <div className="row-right">
                    <button className="danger" onClick={() => handleDelete(list)}>Smazat</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Nový nákupní seznam</h2>
            <p className="app-subtitle">Vyplňte název a případně jméno vlastníka.</p>
            <form className="list-layout" onSubmit={handleCreate}>
              <div className="list-layout">
                <label>
                  Název seznamu
                  <input
                    value={newName}
                    onChange={e=>setNewName(e.target.value)}
                    placeholder="Např. Týdenní nákup"
                  />
                </label>
                <label>
                  Vlastník (volitelné)
                  <input
                    value={newOwner}
                    onChange={e=>setNewOwner(e.target.value)}
                    placeholder="Např. Václav"
                  />
                </label>
              </div>
              <div className="row" style={{justifyContent:"flex-end", marginTop:8}}>
                <button type="button" onClick={() => setIsModalOpen(false)}>Zrušit</button>
                <button type="submit" className="success">Vytvořit</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
