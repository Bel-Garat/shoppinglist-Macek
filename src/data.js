export const INITIAL_LISTS = [
  {
    id: 1,
    name: "Pátek nákup",
    ownerId: 1,
    members: [
      { id: 1, name: "Karel" },
      { id: 2, name: "Jan" },
      { id: 3, name: "Marek" }
    ],
    items: [
      { id: 1, name: "Jablka", quantity: 3, done: false },
      { id: 2, name: "Chléb", quantity: 1, done: true },
      { id: 3, name: "Mléko", quantity: 2, done: false }
    ]
  },
  {
    id: 2,
    name: "Vánoční nákup",
    ownerId: 4,
    members: [
      { id: 4, name: "Lucie" },
      { id: 5, name: "Petr" }
    ],
    items: [
      { id: 4, name: "Cukr", quantity: 2, done: false },
      { id: 5, name: "Máslo", quantity: 1, done: false },
      { id: 6, name: "Mouka", quantity: 5, done: true },
      { id: 7, name: "Rum", quantity: 1, done: false }
    ]
  },
  {
    id: 3,
    name: "Oslava",
    ownerId: 6,
    members: [
      { id: 6, name: "Ondřej" }
    ],
    items: []
  }
];
