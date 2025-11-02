import React from "react";
import ShoppingListDetail from "./pages/ShoppingListDetail";

export default function App(){
  // Pro účely Úkolu 2 držíme pouze jedinou route (detail).
  return (
    <div className="container">
      <ShoppingListDetail />
    </div>
  );
}
