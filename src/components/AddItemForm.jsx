import React, { useState } from "react";

function AddItemForm({ onAddItem }) {
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
        placeholder="Název položky"
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
        + Přidat
      </button>
    </form>
  );
}

export default AddItemForm;
