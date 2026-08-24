import { useCallback, useEffect, useRef, useState } from "react";
import { draftStore } from "../storage/draftStore";

const DEBOUNCE_MS = 500;

export function useDraft(chatId) {
  const [draft, setDraft] = useState("");
  const [draftLoading, setDraftLoading] = useState(true);
  const [draftStatus, setDraftStatus] = useState("saved");

  const timerRef = useRef(null);

  const loadDraft = useCallback(async () => {
    setDraftLoading(true);

    try {
      const saved = await draftStore.get(chatId);

      setDraft(saved?.content || "");
    } catch (err) {
      console.error("Failed to load draft:", err);
      setDraft("");
    } finally {
      setDraftLoading(false);
    }
  }, [chatId]);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const saveDraft = useCallback(
    (content) => {
      clearTimeout(timerRef.current);

      setDraft(content);

      if (!content.trim()) {
        draftStore.remove(chatId);
        setDraftStatus("saved");
        return;
      }

      setDraftStatus("saving");

      timerRef.current = setTimeout(async () => {
        try {
          await draftStore.save(chatId, content);
          setDraftStatus("saved");
        } catch (err) {
          console.error("Failed to save draft:", err);
          setDraftStatus("error");
        }
      }, DEBOUNCE_MS);
    },
    [chatId],
  );

  const saveImmediate = useCallback(
    async (content) => {
      clearTimeout(timerRef.current);

      if (!content.trim()) {
        await draftStore.remove(chatId);
        setDraftStatus("saved");
        return;
      }

      try {
        await draftStore.save(chatId, content);
        setDraftStatus("saved");
      } catch (err) {
        console.error("Failed to save draft:", err);
        setDraftStatus("error");
      }
    },
    [chatId],
  );

  const clearDraft = useCallback(async () => {
    clearTimeout(timerRef.current);

    await draftStore.remove(chatId);
    setDraft("");
    setDraftStatus("saved");
  }, [chatId]);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return {
    draft,
    draftLoading,
    draftStatus,
    saveDraft,
    saveImmediate,
    clearDraft,
  };
}