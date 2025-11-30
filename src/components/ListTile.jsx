import React from "react";

function getOwnerName(list) {
  const owner = list.members.find((m) => m.id === list.ownerId);
  return owner ? owner.name : "—";
}

function ListTile({ list, onOpen, onDelete }) {
  return (
    <div className="list-card">
      <h2>{list.name}</h2>
      <div className="list-meta">
        <span>Vlastník: {getOwnerName(list)}</span>
        <span>Členové: {list.members.length}</span>
        <span>Položky: {list.items.length}</span>
      </div>
      <div className="list-card-actions">
        <button onClick={onOpen}>Otevřít detail</button>
        <button className="danger" onClick={onDelete}>
          Smazat
        </button>
      </div>
    </div>
  );
}

export default ListTile;
