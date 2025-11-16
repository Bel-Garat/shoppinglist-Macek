export const INITIAL_LISTS = [
  {
    id: "list-1",
    name: "Sobota nákup",
    owner: "Karel",
    members: ["Karel", "Jan", "Marek"],
    items: [
      { id: "i1", name: "Mléko", qty: 2, done: false, ts: Date.now() - 60000 },
      { id: "i2", name: "Chléb", qty: 1, done: true, ts: Date.now() - 50000 },
      { id: "i3", name: "Jablka", qty: 6, done: false, ts: Date.now() - 40000 }
    ]
  },
  {
    id: "list-2",
    name: "Víkendový nákup",
    owner: "Eva",
    members: ["Eva", "Petr"],
    items: [
      { id: "i4", name: "Pivo", qty: 6, done: false, ts: Date.now() - 30000 },
      { id: "i5", name: "Brambůrky", qty: 3, done: false, ts: Date.now() - 20000 }
    ]
  },
  {
    id: "list-3",
    name: "Party nákup",
    owner: "Lucie",
    members: ["Lucie"],
    items: [
      { id: "i6", name: "Cola", qty: 4, done: false, ts: Date.now() - 10000 }
    ]
  }
];
