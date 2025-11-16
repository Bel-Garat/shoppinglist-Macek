import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { INITIAL_LISTS } from "./data";
import ListOverview from "./pages/ListOverview";
import ShoppingListDetail from "./pages/ShoppingListDetail";

export default function App(){
  const [lists, setLists] = useState(INITIAL_LISTS);

  const createList = ({ name, owner }) => {
    const id = "list-" + Math.random().toString(36).slice(2, 7);
    const newList = {
      id,
      name,
      owner,
      members: [owner],
      items: []
    };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = (id) => {
    setLists(prev => prev.filter(l => l.id !== id));
  };

  const updateList = (id, patch) => {
    setLists(prev =>
      prev.map(l =>
        l.id === id ? { ...l, ...patch } : l
      )
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ListOverview
            lists={lists}
            onCreateList={createList}
            onDeleteList={deleteList}
          />
        }
      />
      <Route
        path="/list/:id"
        element={
          <ShoppingListDetail
            lists={lists}
            onUpdateList={updateList}
            onDeleteList={deleteList}
          />
        }
      />
    </Routes>
  );
}
