import React, { useEffect, useState, useMemo } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams
} from "react-router-dom";
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

function OverviewPage() {
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
          setError(e.message || "Nepodařilo se načíst seznamy.");
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
    const name = window.prompt("Název nového seznamu:");
    if (!name) return;
    const ownerName = window.prompt("Jméno vlastníka seznamu:", "Karel");
    if (!ownerName) return;
    try {
      const created = await createList({ name, ownerName });
      setLists((prev) => [...prev, created]);
    } catch (e) {
      alert(e.message || "Nepodařilo se vytvořit seznam.");
    }
  }

  async function handleDeleteList(id) {
    if (!window.confirm("Opravdu smazat tento nákupní seznam?")) return;
    try {
      await deleteList(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
    } catch (e) {
      alert(e.message || "Nepodařilo se smazat seznam.");
    }
  }

  if (state === "pending") {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>Nákupní seznamy</h1>
            <p className="subtitle">Načítám data…</p>
          </div>
        </header>
        <div className="loading">Načítám seznamy…</div>
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-header">
        <div>
          <h1>Nákupní seznamy</h1>
          <p className="subtitle">
            Přehled všech seznamů, které jsou dostupné v aplikaci.
          </p>
        </div>
        <div className="header-actions">
          <button className="primary" onClick={handleCreateList}>
            + Nový seznam
          </button>
        </div>
      </header>

      {state === "error" && error && <div className="error">{error}</div>}

      <section className="panel">
        <div className="panel-header">
          <h2>Filtry a řazení</h2>
          <div className="filters">
            <select
              value={filterOwned}
              onChange={(e) => setFilterOwned(e.target.value)}
            >
              <option value="all">Všechny</option>
              <option value="mine">Pouze moje (vlastním)</option>
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="recent">Nejnovější</option>
              <option value="az">A → Z</option>
              <option value="za">Z → A</option>
              <option value="items">Podle počtu položek</option>
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
        {filteredAndSorted.length === 0 && (
          <div className="empty">Žádné seznamy neodpovídají filtru.</div>
        )}
      </section>
    </div>
  );
}

function DetailPage() {
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
          setError(e.message || "Nepodařilo se načíst seznam.");
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
      alert(e.message || "Nepodařilo se obnovit data.");
    }
  }

  async function handleRename() {
    const name = window.prompt("Nový název seznamu:", list?.name || "");
    if (!name || !list) return;
    try {
      const updated = await renameList(list.id, name);
      setList(updated);
    } catch (e) {
      alert(e.message || "Nepodařilo se přejmenovat seznam.");
    }
  }

  async function handleAddItem(payload) {
    if (!list) return;
    try {
      const updated = await addItem(list.id, payload);
      setList(updated);
    } catch (e) {
      alert(e.message || "Nepodařilo se přidat položku.");
    }
  }

  async function handleToggleItem(itemId) {
    if (!list) return;
    try {
      const updated = await toggleItemDone(list.id, itemId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Nepodařilo se upravit položku.");
    }
  }

  async function handleRemoveItem(itemId) {
    if (!list) return;
    try {
      const updated = await removeItem(list.id, itemId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Nepodařilo se smazat položku.");
    }
  }

  async function handleAddMember(name) {
    if (!list) return;
    try {
      const updated = await addMember(list.id, name);
      setList(updated);
    } catch (e) {
      alert(e.message || "Nepodařilo se přidat člena.");
    }
  }

  async function handleRemoveMember(memberId) {
    if (!list) return;
    try {
      const updated = await removeMember(list.id, memberId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Nepodařilo se odebrat člena.");
    }
  }

  async function handleSetOwner(memberId) {
    if (!list) return;
    try {
      const updated = await setOwner(list.id, memberId);
      setList(updated);
    } catch (e) {
      alert(e.message || "Nepodařilo se změnit vlastníka.");
    }
  }

  if (state === "pending") {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>Detail seznamu</h1>
            <p className="subtitle">Načítám data…</p>
          </div>
        </header>
        <div className="loading">Načítám seznam…</div>
      </div>
    );
  }

  if (state === "error" || !list) {
    return (
      <div className="page">
        <header className="page-header">
          <div>
            <h1>Detail seznamu</h1>
          </div>
        </header>
        {error && <div className="error">{error}</div>}
        <button onClick={() => navigate("/")}>← Zpět na přehled</button>
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
            Items: {list.items.length} • Členové: {list.members.length}
          </p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate("/")}>← Zpět</button>
          <button onClick={handleRename}>Přejmenovat</button>
          <button onClick={refreshFromServer}>Obnovit</button>
        </div>
      </header>

      <section className="panel">
        <div className="panel-header">
          <h2>Položky</h2>
        </div>
        <AddItemForm onAddItem={handleAddItem} />
        <ItemList
          items={list.items}
          onToggleItem={handleToggleItem}
          onRemoveItem={handleRemoveItem}
        />
      </section>

      <section className="panel">
        <div className="panel-header">
          <h2>Členové</h2>
          <div className="subtitle">
            Vlastník: {owner ? owner.name : "—"}
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
