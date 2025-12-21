import React from "react";
import { useI18n } from "../i18n/I18nContext";

function ItemRow({ item, onToggleItem, onRemoveItem }) {
  const { t } = useI18n();
  return (
    <div className={`item-row ${item.done ? "item-row--done" : ""}`}>
      <label className="item-main">
        <input type="checkbox" checked={item.done} onChange={() => onToggleItem(item.id)} />
        <span className="item-name">{item.name}</span>
      </label>
      <span className="item-qty">
        {t("quantity")}: {item.quantity}
      </span>
      <button className="danger" onClick={() => onRemoveItem(item.id)}>
        {t("delete")}
      </button>
    </div>
  );
}

export default ItemRow;
