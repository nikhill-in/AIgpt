import { openDB } from "idb";

export const dbPromise = openDB("aigpt-db", 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains("drafts")) {
      const drafts = db.createObjectStore("drafts", {
        keyPath: "chatId",
      });

      drafts.createIndex("updatedAt", "updatedAt");
    }
  },
});