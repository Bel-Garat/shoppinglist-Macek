import React from "react";
import { useI18n } from "../i18n/I18nContext";

function getOwnerName(list) {
  const owner = list.members.find((m) => m.id === list.ownerId);
  return owner ? owner.name : "—";
}

function ListTile({ list, onOpen, onDelete }) {
  const { t } = useI18n();

  const total = list.items.length;
  const done = list.items.filter((it) => it.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="list-card">
      <h2>{list.name}</h2>

      <div className="list-meta">
        <span>
          {t("owner")}: {getOwnerName(list)}
        </span>
        <span>
          {t("members")}: {list.members.length}
        </span>
        <span>
          {t("items")}: {total}
        </span>
      </div>

      <div className="mini-stats">
        <div className="mini-stats-row">
          <span>
            {t("done")}: {done}/{total}
          </span>
          <span>{pct}%</span>
        </div>
        <div className="progress">
          <div className="progress__fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="list-card-actions">
        <button onClick={onOpen}>{t("openDetail")}</button>
        <button className="danger" onClick={onDelete}>
          {t("delete")}
        </button>
      </div>
    </div>
  );
}

export default ListTile;
