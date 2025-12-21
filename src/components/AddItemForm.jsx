import React, { useState } from "react";
import { useI18n } from "../i18n/I18nContext";

function AddItemForm({ onAddItem }) {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState(1);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onAddItem({ name: name.trim(), quantity: quantity || 1 });
    setName("");
    setQuantity(1);
  }

  return (
    <form className="add-item-form" onSubmit={handleSubmit}>
      <input
        className="text-input"
        type="text"
        placeholder={t("itemNamePlaceholder")}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="number-input"
        type="number"
        min="1"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
      />
      <button type="submit" className="primary">
        {t("add")}
      </button>
    </form>
  );
}

export default AddItemForm;
