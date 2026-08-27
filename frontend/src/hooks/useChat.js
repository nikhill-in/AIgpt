import { useCallback, useRef, useState } from "react";

import {
  getChatMessages,
  sendMessageStream,
  editMessageStream,
} from "../api/chat";

const createMessage = (role, content = "") => ({
  role,
  content,
  createdAt: new Date().toISOString(),
});

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  // Used to prevent conflicting chat operations.
  const isSendingRef = useRef(false);

  // Controller for the currently active stream.
  const abortControllerRef = useRef(null);

  // --------------------------------------------------
  // Update the currently streaming assistant message
  // --------------------------------------------------

  const updateLastMessage = useCallback((content) => {
    setMessages((prev) => {
      if (!prev.length) {
        return prev;
      }

      const updated = [...prev];

      const lastMessage = updated[updated.length - 1];

      updated[updated.length - 1] = {
        ...lastMessage,
        content,
      };

      return updated;
    });
  }, []);

  // --------------------------------------------------
  // Stream response
  // --------------------------------------------------

  const streamResponse = useCallback(
    async (streamFn, onNewChatId) => {
      let assistantText = "";

      await streamFn(
        (token) => {
          // IMPORTANT:
          // No artificial delay.
          //
          // Gemini/SSE already provides chunks.
          // Render each received chunk immediately.
          assistantText += token;

          updateLastMessage(assistantText);
        },
        onNewChatId,
      );
    },
    [updateLastMessage],
  );

  // --------------------------------------------------
  // Stream error handling
  // --------------------------------------------------

  const handleStreamError = useCallback((err) => {
    // Abort is an intentional user action.
    if (err?.name === "AbortError") {
      return;
    }

    if (
      err?.status === 401 ||
      err?.response?.status === 401
    ) {
      return;
    }

    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Something went wrong. Please try again.";

    console.error("Stream error:", message);

    setMessages((prev) => {
      if (!prev.length) {
        return prev;
      }

      return [
        ...prev.slice(0, -1),
        createMessage("assistant", message),
      ];
    });
  }, []);

  // --------------------------------------------------
  // Run streaming request
  // --------------------------------------------------

  const runStreamingAction = useCallback(
    async (streamFn, onNewChatId) => {
      // Cancel an existing request first.
      abortControllerRef.current?.abort();

      const controller = new AbortController();

      abortControllerRef.current = controller;

      setIsLoading(true);
      isSendingRef.current = true;

      try {
        await streamResponse(
          (onToken, chatIdCallback) =>
            streamFn(
              onToken,
              chatIdCallback,
              controller.signal,
            ),
          onNewChatId,
        );
      } catch (err) {
        // Ignore intentional cancellation.
        if (err?.name !== "AbortError") {
          handleStreamError(err);
        }
      } finally {
        // Only clear the controller if it still belongs to
        // this request.
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }

        setIsLoading(false);
        isSendingRef.current = false;
      }
    },
    [streamResponse, handleStreamError],
  );

  // --------------------------------------------------
  // Stop current generation
  // --------------------------------------------------

  const stopGeneration = useCallback(() => {
    if (!abortControllerRef.current) {
      return;
    }

    abortControllerRef.current.abort();

    abortControllerRef.current = null;

    setIsLoading(false);
    isSendingRef.current = false;
  }, []);

  // --------------------------------------------------
  // New chat
  // --------------------------------------------------

  const newChat = useCallback(() => {
    // Don't allow creating a new chat while generation is
    // running unless the current generation is explicitly stopped.
    if (isSendingRef.current) {
      return;
    }

    setCurrentChatId(null);
    setMessages([]);
  }, []);

  // --------------------------------------------------
  // Select existing chat
  // --------------------------------------------------

  const selectChat = useCallback(
    async (chatId) => {
      if (isSendingRef.current) {
        return;
      }

      setCurrentChatId(chatId);
      setIsLoading(true);

      try {
        const msgs = await getChatMessages(chatId);

        setMessages(
          Array.isArray(msgs) ? msgs : [],
        );
      } catch (err) {
        console.error(
          "Error fetching messages:",
          err?.response?.data?.message ||
            err?.message,
        );
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  // --------------------------------------------------
  // Send new message
  // --------------------------------------------------

  const sendMessage = useCallback(
    async (text, size) => {
      const trimmedText = text?.trim();

      if (!trimmedText) {
        return;
      }

      /*
       * If another generation is running, stop it first.
       *
       * This allows:
       *
       * current stream
       *      ↓
       * user sends another prompt
       *      ↓
       * abort current stream
       *      ↓
       * start new stream
       */

      if (isSendingRef.current) {
        abortControllerRef.current?.abort();
      }

      setMessages((prev) => [
        ...prev,
        createMessage("user", trimmedText),
        createMessage("assistant"),
      ]);

      await runStreamingAction(
        (
          onToken,
          onNewChatId,
          signal,
        ) =>
          sendMessageStream(
            currentChatId,
            trimmedText,
            onToken,
            onNewChatId,
            size,
            signal,
          ),
        (newChatId) => {
          if (!currentChatId && newChatId) {
            setCurrentChatId(newChatId);
          }
        },
      );
    },
    [currentChatId, runStreamingAction],
  );

  // --------------------------------------------------
  // Edit message
  // --------------------------------------------------

  const editMessage = useCallback(
    async (
      messageId,
      newContent,
      tokenSize,
    ) => {
      if (isSendingRef.current) {
        return;
      }

      const trimmedContent = newContent?.trim();

      if (!trimmedContent) {
        return;
      }

      const editIndex = messages.findIndex(
        (message) =>
          message._id === messageId,
      );

      if (editIndex === -1) {
        return;
      }

      setMessages((prev) => [
        ...prev.slice(0, editIndex),
        createMessage("user", trimmedContent),
        createMessage("assistant"),
      ]);

      await runStreamingAction(
        (
          onToken,
          onNewChatId,
          signal,
        ) =>
          editMessageStream(
            messageId,
            trimmedContent,
            onToken,
            onNewChatId,
            tokenSize,
            signal,
          ),
        () => {},
      );
    },
    [messages, runStreamingAction],
  );

  return {
    messages,
    isLoading,
    currentChatId,
    isSendingRef,

    newChat,
    selectChat,

    sendMessage,
    editMessage,

    stopGeneration,
  };
}

