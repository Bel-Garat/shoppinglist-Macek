import React, { useState } from "react";

function MemberList({ members, ownerId, onAddMember, onRemoveMember, onSetOwner }) {
  const [name, setName] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAddMember(name.trim());
    setName("");
  }

  return (
    <div className="member-section">
      <div className="member-list">
        {members.map((m) => (
          <div key={m.id} className="member-row">
            <span className="member-name">
              {m.name}{" "}
              {m.id === ownerId && <span className="tag tag-owner">(vlastník)</span>}
            </span>
            <div className="member-actions">
              {m.id !== ownerId && (
                <button onClick={() => onSetOwner(m.id)}>Role</button>
              )}
              <button className="danger" onClick={() => onRemoveMember(m.id)}>
                Odebrat
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && <div className="empty">Žádní členové.</div>}
      </div>

      <form className="add-member-form" onSubmit={handleSubmit}>
        <input
          className="text-input"
          type="text"
          placeholder="Jméno člena"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="primary" type="submit">
          + Přidat člena
        </button>
      </form>
    </div>
  );
}

export default MemberList;
