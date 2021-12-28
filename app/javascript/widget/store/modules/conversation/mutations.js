import Vue from 'vue';
import { MESSAGE_TYPE } from 'widget/helpers/constants';
import { findUndeliveredMessage } from './helpers';

export const mutations = {
  clearConversations($state) {
    Vue.set($state, 'conversations', {});
    // introduce conversationId as param
    // Clear state for conversations key
    // Clear messages in state for conversation by id
    // Reset meta in state for conversation by id
  },
  pushMessageToConversation($state, message) {
    // introduce conversationId as param
    const { id, status, message_type: type } = message;

    const messagesInbox = $state.conversations;
    const isMessageIncoming = type === MESSAGE_TYPE.INCOMING;
    const isTemporaryMessage = status === 'in_progress';

    if (!isMessageIncoming || isTemporaryMessage) {
      Vue.set(messagesInbox, id, message);

      // Set id with message in conversations byIds
      // Append id to message allIds
      return;
    }

    const [messageInConversation] = findUndeliveredMessage(
      messagesInbox,
      message
    );

    if (!messageInConversation) {
      // Set id with message in conversations byIds
      // Append id to message allIds
      Vue.set(messagesInbox, id, message);
    } else {
      // delete by id in message -> conversations byIds
      // delete by id in message -> conversations allIds
      // Set id with message in conversations byIds
      // Append id to message allIds
      Vue.delete(messagesInbox, messageInConversation.id);
      Vue.set(messagesInbox, id, message);
    }
  },

  updateAttachmentMessageStatus($state, { message, tempId }) {
    // introduce conversationId as param
    const { id } = message;
    const messagesInbox = $state.conversations;

    const messageInConversation = messagesInbox[tempId];

    if (messageInConversation) {
      // delete by id in message -> conversations byIds
      // delete by id in message -> conversations allIds
      // Set id with message in conversations byIds
      // Append id to message allI
      Vue.delete(messagesInbox, tempId);
      Vue.set(messagesInbox, id, {
        ...message,
      });
    }
  },

  setConversationUIFlag($state, uiFlags) {
    // introduce conversationId as param
    // Update uiFlags by Id
    $state.uiFlags = {
      ...$state.uiFlags,
      ...uiFlags,
    };
  },

  setConversationListLoading($state, status) {
    // introduce conversationId as param
    // Update uiFlags by Id
    $state.uiFlags.isFetchingList = status;
  },

  setMessagesInConversation($state, payload) {
    if (!payload.length) {
      $state.uiFlags.allMessagesLoaded = true;
      return;
    }

    payload.map(message => Vue.set($state.conversations, message.id, message));
  },

  updateMessage($state, { id, content_attributes }) {
    $state.conversations[id] = {
      ...$state.conversations[id],
      content_attributes: {
        ...($state.conversations[id].content_attributes || {}),
        ...content_attributes,
      },
    };
  },

  updateMessageMeta($state, { id, meta }) {
    const message = $state.conversations[id];
    if (!message) return;

    const newMeta = message.meta ? { ...message.meta, ...meta } : { ...meta };
    Vue.set(message, 'meta', {
      ...newMeta,
    });
  },

  deleteMessage($state, id) {
    const messagesInbox = $state.conversations;
    Vue.delete(messagesInbox, id);
  },

  toggleAgentTypingStatus($state, { status }) {
    const isTyping = status === 'on';
    $state.uiFlags.isAgentTyping = isTyping;
  },

  setMetaUserLastSeenAt($state, lastSeen) {
    $state.meta.userLastSeenAt = lastSeen;
  },
};
