import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useParams } from "react-router-dom";
import {
  getLists,
  getListById,
  createList,
  deleteList,
  renameList,
  addItem,
  toggleItemDone,
  removeItem,
  addMember,
  removeMember,
  setOwner
} from "./api";
import ListTile from "./components/ListTile";
import ItemList from "./components/ItemList";
import AddItemForm from "./components/AddItemForm";
import MemberList from "./components/MemberList";
import ItemsPie from "./components/ItemsPie";
import { useI18n } from "./i18n/I18nContext";
import { useTheme } from "./theme/ThemeContext";

function TopControls() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="top-controls">
      <div className="control">
        <span className="control-label">{t("language")}</span>
        <select value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="cs">CZ</option>
          <option value="en">EN</option>
        </select>
      </div>
      <div className="control">
        <span className="control-label">{t("theme")}</span>
        <button onClick={toggleTheme}>
          {theme === "dark" ? t("light") : t("dark")}
        </button>
      </div>
    </div>
  );
}

function OverviewPage() {
  const { t } = useI18n();
  const [lists, setLists] = useState([]);
  const [state, setState] = useState("pending"); 
  const [error, setError] = useState(null);
  const [filterOwned, setFilterOwned] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState("pending");
      setError(null);
      try {
        const data = await getLists();
        if (!cancelled) {
          setLists(data);
          setState("ready");
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError(e.message || "Error");
          setState("error");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const myUserId = 1;

  const filteredAndSorted = useMemo(() => {
    let result = [...lists];
    if (filterOwned === "mine") {
      result = result.filter((l) => l.ownerId === myUserId);
    }
    if (sortBy === "az") {
      result.sort((a, b) => a.name.localeCompare(b.name, "cs"));
    } else if (sortBy === "za") {
      result.sort((a, b) => b.name.localeCompare(a.name, "cs"));
    } else if (sortBy === "items") {
      result.sort((a, b) => b.items.length - a.items.length);
    }
    return result;
  }, [lists, filterOwned, sortBy, myUserId]);

  async function handleCreateList() {
    const name = window.prompt(t("promptNewListName"));
    if (!name) return;
    const ownerName = window.prompt(t("promptOwnerName"), "Karel");
    if (!ownerName) return;
    try {
      const created = await createList({ name, ownerName });
      setLists((prev) => [...prev, created]);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleDeleteList(id) {
    if (!window.confirm(t("confirmDeleteList"))) return;
    try {
      await deleteList(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  if (state === "pending") {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>{t("appTitle")}</h1>
            <p className="subtitle">{t("loadingData")}</p>
          </div>
          <TopControls />
        </header>
        <div className="loading">{t("loadingLists")}</div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{t("appTitle")}</h1>
          <p className="subtitle">{t("overviewSubtitle")}</p>
        </div>
        <div className="header-actions">
          <button className="primary" onClick={handleCreateList}>
            {t("newList")}
          </button>
          <TopControls />
        </div>
      </header>

      {state === "error" && error && <div className="error">{error}</div>}

      <section className="panel">
        <div className="panel-header">
          <h2>{t("filtersTitle")}</h2>
          <div className="filters">
            <select value={filterOwned} onChange={(e) => setFilterOwned(e.target.value)}>
              <option value="all">{t("filterAll")}</option>
              <option value="mine">{t("filterMine")}</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">{t("sortNewest")}</option>
              <option value="az">{t("sortAZ")}</option>
              <option value="za">{t("sortZA")}</option>
              <option value="items">{t("sortItems")}</option>
            </select>
          </div>
        </div>
      </section>

      <section className="list-cards">
        {filteredAndSorted.map((list) => (
          <ListTile
            key={list.id}
            list={list}
            onOpen={() => navigate(`/list/${list.id}`)}
            onDelete={() => handleDeleteList(list.id)}
          />
        ))}
        {filteredAndSorted.length === 0 && <div className="empty">{t("noLists")}</div>}
      </section>
    </div>
  );
}

function DetailPage() {
  const { t } = useI18n();
  const { id } = useParams();
  const listId = Number(id);
  const [list, setList] = useState(null);
  const [state, setState] = useState("pending");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setState("pending");
      setError(null);
      try {
        const data = await getListById(listId);
        if (!cancelled) {
          setList(data);
          setState("ready");
        }
      } catch (e) {
        if (!cancelled) {
          console.error(e);
          setError(e.message || "Error");
          setState("error");
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [listId]);

  async function refreshFromServer() {
    try {
      const data = await getListById(listId);
      setList(data);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleRename() {
    const name = window.prompt(t("promptRenameList"), list?.name || "");
    if (!name || !list) return;
    try {
      const updated = await renameList(list.id, name);
      setList(updated);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleAddItem(payload) {
    if (!list) return;
    try {
      const updated = await addItem(list.id, payload);
      setList(updated);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleToggleItem(itemId) {
    if (!list) return;
    try {
      const updated = await toggleItemDone(list.id, itemId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleRemoveItem(itemId) {
    if (!list) return;
    try {
      const updated = await removeItem(list.id, itemId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleAddMember(name) {
    if (!list) return;
    try {
      const updated = await addMember(list.id, name);
      setList(updated);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleRemoveMember(memberId) {
    if (!list) return;
    try {
      const updated = await removeMember(list.id, memberId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

  async function handleSetOwner(memberId) {
    if (!list) return;
    try {
      const updated = await setOwner(list.id, memberId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Error");
    }
  }

 
  const totalItems = list?.items?.length || 0;
  const doneItems = list?.items ? list.items.filter((it) => it.done).length : 0;
  const todoItems = Math.max(0, totalItems - doneItems);

  if (state === "pending") {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>{t("detailTitle")}</h1>
            <p className="subtitle">{t("loadingData")}</p>
          </div>
          <TopControls />
        </header>
        <div className="loading">{t("loadingList")}</div>
      </div>
    );
  }

  if (state === "error" || !list) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>{t("detailTitle")}</h1>
          </div>
          <TopControls />
        </header>
        {error && <div className="error">{error}</div>}
        <button onClick={() => navigate("/")}>{t("backToOverview")}</button>
      </div>
    );
  }

  const owner = list.members.find((m) => m.id === list.ownerId);

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>{list.name}</h1>
          <p className="subtitle">
            {t("items")}: {totalItems} • {t("members")}: {list.members.length}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate("/")}>{t("back")}</button>
          <button onClick={handleRename}>{t("rename")}</button>
          <button onClick={refreshFromServer}>{t("refresh")}</button>
          <TopControls />
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>{t("stats")}</h2>
          <div className="subtitle">
            {t("done")}: {doneItems} • {t("todo")}: {todoItems}
          </div>
        </div>
        <ItemsPie
          done={doneItems}
          todo={todoItems}
          doneLabel={t("done")}
          todoLabel={t("todo")}
        />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>{t("items")}</h2>
        </div>
        <AddItemForm onAddItem={handleAddItem} />
        <ItemList items={list.items} onToggleItem={handleToggleItem} onRemoveItem={handleRemoveItem} />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>{t("members")}</h2>
          <div className="subtitle">
            {t("owner")}: {owner ? owner.name : "—"}
          </div>
        </div>
        <MemberList
          members={list.members}
          ownerId={list.ownerId}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onSetOwner={handleSetOwner}
        />
      </section>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/list/:id" element={<DetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
