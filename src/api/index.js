import * as mockApi from "./mockServer";

const USE_MOCKS = true;

const realApi = {
  async getLists() {
    throw new Error("Real API není implementováno.");
  },
  async getListById() {
    throw new Error("Real API není implementováno.");
  },
  async createList() {
    throw new Error("Real API není implementováno.");
  },
  async deleteList() {
    throw new Error("Real API není implementováno.");
  },
  async renameList() {
    throw new Error("Real API není implementováno.");
  },
  async addItem() {
    throw new Error("Real API není implementováno.");
  },
  async toggleItemDone() {
    throw new Error("Real API není implementováno.");
  },
  async removeItem() {
    throw new Error("Real API není implementováno.");
  },
  async addMember() {
    throw new Error("Real API není implementováno.");
  },
  async removeMember() {
    throw new Error("Real API není implementováno.");
  },
  async setOwner() {
    throw new Error("Real API není implementováno.");
  }
};

const api = USE_MOCKS ? mockApi : realApi;

export const getLists = api.getLists;
export const getListById = api.getListById;
export const createList = api.createList;
export const deleteList = api.deleteList;
export const renameList = api.renameList;
export const addItem = api.addItem;
export const toggleItemDone = api.toggleItemDone;
export const removeItem = api.removeItem;
export const addMember = api.addMember;
export const removeMember = api.removeMember;
export const setOwner = api.setOwner;
