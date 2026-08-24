import { dbPromise } from "./db";

const normalizeChatId = (chatId) => chatId ?? "new";

export const draftStore = {
  async get(chatId) {
    const db = await dbPromise;

    return db.get(
      "drafts",
      normalizeChatId(chatId),
    );
  },

  async save(chatId, content) {
    const db = await dbPromise;

    await db.put("drafts", {
      chatId: normalizeChatId(chatId),
      content,
      updatedAt: Date.now(),
    });
  },

  async remove(chatId) {
    const db = await dbPromise;

    await db.delete(
      "drafts",
      normalizeChatId(chatId),
    );
  },

  async getAll() {
    const db = await dbPromise;

    return db.getAll("drafts");
  },
};