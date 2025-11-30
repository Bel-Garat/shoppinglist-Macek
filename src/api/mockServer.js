import { INITIAL_LISTS } from "../data";

let lists = INITIAL_LISTS.map((l) => ({
  ...l,
  members: l.members.map((m) => ({ ...m })),
  items: l.items.map((i) => ({ ...i }))
}));

let nextListId = lists.length > 0 ? Math.max(...lists.map((l) => l.id)) + 1 : 1;
let nextItemId =
  lists.flatMap((l) => l.items).length > 0
    ? Math.max(...lists.flatMap((l) => l.items.map((i) => i.id))) + 1
    : 1;
let nextMemberId =
  lists.flatMap((l) => l.members).length > 0
    ? Math.max(...lists.flatMap((l) => l.members.map((m) => m.id))) + 1
    : 1;

const delay = (result, ms = 250) =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(JSON.parse(JSON.stringify(result))),
      ms
    )
  );

export async function getLists() {
  return delay(lists);
}

export async function getListById(id) {
  const list = lists.find((l) => l.id === Number(id));
  if (!list) throw new Error("Seznam nenalezen");
  return delay(list);
}

export async function createList({ name, ownerName }) {
  const owner = { id: nextMemberId++, name: ownerName };
  const newList = {
    id: nextListId++,
    name,
    ownerId: owner.id,
    members: [owner],
    items: []
  };
  lists.push(newList);
  return delay(newList);
}

export async function deleteList(id) {
  lists = lists.filter((l) => l.id !== Number(id));
  return delay(true);
}

export async function renameList(id, name) {
  const list = lists.find((l) => l.id === Number(id));
  if (!list) throw new Error("Seznam nenalezen");
  list.name = name;
  return delay(list);
}

export async function addItem(listId, { name, quantity }) {
  const list = lists.find((l) => l.id === Number(listId));
  if (!list) throw new Error("Seznam nenalezen");
  const item = {
    id: nextItemId++,
    name,
    quantity: Number(quantity) || 1,
    done: false
  };
  list.items.push(item);
  return delay(list);
}

export async function toggleItemDone(listId, itemId) {
  const list = lists.find((l) => l.id === Number(listId));
  if (!list) throw new Error("Seznam nenalezen");
  const item = list.items.find((i) => i.id === Number(itemId));
  if (!item) throw new Error("Položka nenalezena");
  item.done = !item.done;
  return delay(list);
}

export async function removeItem(listId, itemId) {
  const list = lists.find((l) => l.id === Number(listId));
  if (!list) throw new Error("Seznam nenalezen");
  list.items = list.items.filter((i) => i.id !== Number(itemId));
  return delay(list);
}

export async function addMember(listId, name) {
  const list = lists.find((l) => l.id === Number(listId));
  if (!list) throw new Error("Seznam nenalezen");
  const member = { id: nextMemberId++, name };
  list.members.push(member);
  return delay(list);
}

export async function removeMember(listId, memberId) {
  const list = lists.find((l) => l.id === Number(listId));
  if (!list) throw new Error("Seznam nenalezen");
  if (list.members.length <= 1) {
    throw new Error("Seznam musí mít alespoň jednoho člena.");
  }
  list.members = list.members.filter((m) => m.id !== Number(memberId));
  if (list.ownerId === Number(memberId)) {
    list.ownerId = list.members[0].id;
  }
  return delay(list);
}

export async function setOwner(listId, memberId) {
  const list = lists.find((l) => l.id === Number(listId));
  if (!list) throw new Error("Seznam nenalezen");
  const member = list.members.find((m) => m.id === Number(memberId));
  if (!member) throw new Error("Člen nenalezen");
  list.ownerId = member.id;
  return delay(list);
}
