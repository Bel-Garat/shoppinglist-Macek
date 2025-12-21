import React, { useState } from "react";
import { useI18n } from "../i18n/I18nContext";

function MemberList({ members, ownerId, onAddMember, onRemoveMember, onSetOwner }) {
  const { t } = useI18n();
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
              {m.name} {m.id === ownerId && <span className="tag tag-owner">{t("ownerTag")}</span>}
            </span>
            <div className="member-actions">
              {m.id !== ownerId && <button onClick={() => onSetOwner(m.id)}>{t("role")}</button>}
              <button className="danger" onClick={() => onRemoveMember(m.id)}>
                {t("removeMember")}
              </button>
            </div>
          </div>
        ))}
        {members.length === 0 && <div className="empty">{t("noMembers")}</div>}
      </div>

      <form className="add-member-form" onSubmit={handleSubmit}>
        <input
          className="text-input"
          type="text"
          placeholder={t("memberNamePlaceholder")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="primary" type="submit">
          {t("addMember")}
        </button>
      </form>
    </div>
  );
}

export default MemberList;
