<template>
  <div class="chat-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Chat List -->
      <div class="chat-list">
        <div class="row align-items-center chat-header">
          <div class="col-5">
            <router-link :to="{ name: 'Collaborate' }" class="back-btn">
              <span>&lt;</span>
            </router-link>
          </div>
          <div class="col">
            <h3>Chats</h3>
          </div>
        </div>
        <br />

        <!-- Search Bar -->
        <div class="search-bar">
          <input
            type="text"
            placeholder="Search"
            v-model="searchQuery"
            @keyup="filterChats"
          />
        </div>
        <div class="tabs-container">
          <div class="tabs">
            <span
              v-for="(category, index) in categories"
              :key="category"
              :class="['tab', { active: selectedCategory === category }]"
              @click="selectCategory(category, index)"
            >
              {{ category }}
            </span>
          </div>
          <!-- Slider Indicator -->
          <div class="slider" :style="sliderStyle"></div>
        </div>
        <ul>
          <li
            v-for="chat in filteredUserChats"
            :key="chat.id"
            :class="{ active: chat.id === chatId }"
            @click="selectChat(chat.id)"
            class="chat-item"
          >
            <img
              :src="`${getChatPartnerProfileImage(chat)}`"
              alt="Chat Profile"
              class="chat-pic"
            />
            <div class="chat-info">
              <p class="chat-name">{{ getChatPartnerName(chat) }}</p>
              <p class="chat-preview">
                {{ chat.lastMessage || "No message yet" }}
              </p>
            </div>
            <span class="chat-time">{{
              formatDate(chat.lastMessageTimeStamp) || " "
            }}</span>
          </li>
        </ul>
        <p v-if="filteredUserChats.length === 0" class="no-results-message">
          No Chats found
        </p>
      </div>
    </div>

    <!-- Main Chat Area -->
    <section class="chat-area">
      <div v-if="selectedChat" class="chatmsg-header">
        <h2>Chat with {{ getChatPartnerName(selectedChat) }}</h2>
        <button @click="deleteChat" class="delete-chat-button">End Chat</button>
      </div>
      <!-- Messages -->
      <div class="messages" ref="messagesContainer">
        <div
          v-for="message in messages"
          :key="message.id"
          :class="{
            'message message-outgoing ': message.senderId === currentUserId,
            'message message-incoming ': message.senderId !== currentUserId,
          }"
        >
          <p class="message-text">{{ message.text }}</p>
          <small class="message-time">{{
            formatDate(message.timestamp)
          }}</small>
        </div>
      </div>
      <div v-if="!chatId" class="no-chat-selected">
        <img src="../images//chat.png" />
        <p>Please select a chat to start messaging</p>
      </div>

      <!-- Message Input -->
      <footer v-else class="message-input">
        <div class="input-wrapper">
          <input
            type="text"
            placeholder="Write your message..."
            v-model="newMessage"
            class="message-input-field"
          />
          <button @click="sendMessage" class="send-button">
            <fa :icon="['fas', 'paper-plane']"></fa>
          </button>
        </div>
      </footer>
    </section>
  </div>
</template>

<script>
import { db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { mapGetters } from "vuex";

export default {
  props: ["id"],
  data() {
    return {
      currentUser: {
        username: "Loading...",
        profile_image: "",
      },
      messages: [],
      newMessage: "",
      chatId: null,
      currentUserId: "",
      selectedUserId: this.id,
      userChats: [], // Stores all chats for the current user
      unsubscribeMessagesListener: null,
      searchQuery: "",
      selectedCategory: "All Chats",
      categories: ["All Chats", "Bookmark"],
      activeIndex: 0,
      selectedChat: null,
    };
  },
  created() {
    // this.fetchUserChats()
    //   .then(() => {
    //     this.listenForChatUpdates(); // Start listening for updates after data retrieval
    //   })
    //   .catch((error) => {
    //     console.error("Error initializing chat data:", error);
    //   });
  },
  computed: {
    ...mapGetters(["user", "isLoggedIn", "userId"]),
    filteredUserChats() {
      return this.userChats.filter((chat) => {
        // Check if chat matches the selected category
        const matchesCategory =
          (this.selectedCategory === "All Chats" &&
            chat.category === "All Chats") ||
          (this.selectedCategory === "Bookmark" &&
            chat.category === "Bookmark");

        // Check if chat matches the search query
        const matchesSearchQuery = this.getChatPartnerName(chat)
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

        // Return true only if both conditions are met
        return matchesCategory && matchesSearchQuery;
      });
    },
    sliderStyle() {
      return {
        width: `${100 / this.categories.length}%`, // Width is based on the number of categories
        transform: `translateX(${this.activeIndex * 100}%)`, // Move to the selected tab
      };
    },
  },
  methods: {
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    listenForChatUpdates() {
      const chatsRef = collection(db, "chat");
      const q = query(
        chatsRef,
        where("users", "array-contains", this.currentUserId)
      );

      onSnapshot(q, async (snapshot) => {
        const updatedChats = await Promise.all(
          snapshot.docs.map(async (chatDoc) => {
            const chatData = { id: chatDoc.id, ...chatDoc.data() };

            // Initialize userInfo for real-time updates
            const userInfo = {};
            for (const userId of chatData.users) {
              const userDocRef = doc(db, "user", userId);
              const userDocSnapshot = await getDoc(userDocRef);

              if (userDocSnapshot.exists()) {
                const { username, profile_image } = userDocSnapshot.data();
                userInfo[userId] = { username, profile_image };
              }
            }

            // Determine if this chat is a bookmarked chat
            const existingChat = this.userChats.find(
              (chat) => chat.id === chatDoc.id
            );
            const isBookmarkedChat = existingChat
              ? existingChat.category === "Bookmark"
              : false;

            // Return the chat data including userInfo and category
            return {
              id: chatDoc.id,
              lastMessage: chatData.lastMessage || "",
              lastMessageTimeStamp: chatData.lastMessageTimeStamp || null,
              users: chatData.users || [],
              userInfo,
              category: isBookmarkedChat ? "Bookmark" : "All Chats", // Preserve category if it's a bookmarked chat
            };
          })
        );

        // Update userChats with the latest real-time updates, keeping categories intact
        updatedChats.forEach((chat) => this.updateOrAddChat(chat));
      });
    },

    updateOrAddChat(newChat) {
      const index = this.userChats.findIndex((chat) => chat.id === newChat.id);

      if (index !== -1) {
        // Update existing chat if it's already in userChats
        this.userChats.splice(index, 1, newChat);
      } else {
        // Add new chat if it doesn't exist in userChats
        this.userChats.push(newChat);
      }
    },

    async fetchUserChats() {
      try {
        // Step 1: Fetch all chats where the current user is a participant
        const chatsRef = collection(db, "chat"); // Use collection for chats
        const q = query(
          chatsRef,
          where("users", "array-contains", this.currentUserId)
        );
        const querySnapshot = await getDocs(q); // Fetch documents matching the query

        // Step 2: For each chat, populate userInfo with display names and profile pictures
        const chatsWithUserInfo = await Promise.all(
          querySnapshot.docs.map(async (chatDoc) => {
            const chatData = {
              id: chatDoc.id,
              category: "All Chats",
              ...chatDoc.data(),
            };

            // Step 3: Retrieve only displayName and profilePic for each user in the chat
            const userInfo = {};
            for (const userId of chatData.users) {
              const userDocRef = doc(db, "user", userId); // Correct usage of doc() with db and collection name
              const userDocSnapshot = await getDoc(userDocRef);

              if (userDocSnapshot.exists()) {
                const { username, profile_image } = userDocSnapshot.data(); // Destructure only the fields we need
                userInfo[userId] = { username, profile_image };
              }
            }

            chatData.userInfo = userInfo; // Add userInfo to chat data
            return chatData;
          })
        );

        // Update userChats with populated userInfo
        this.userChats = chatsWithUserInfo;

        // Step 4: Open existing chat or create a new one with the selected user
        if (this.$route.params.id) {
          await this.openOrCreateChatWithSelectedUser();
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    },

    async openOrCreateChatWithSelectedUser() {
      try {
        // Check for an existing chat
        const existingChat = this.userChats.find((chat) =>
          chat.users.includes(this.selectedUserId)
        );
        if (existingChat) {
          this.selectChat(existingChat.id);
        } else {
          await this.createNewChatWithSelectedUser();
        }
      } catch (error) {
        console.error("Error opening or creating chat:", error);
      }
    },

    async createNewChatWithSelectedUser() {
      try {
        // Fetch current user info and selected user info
        const currentUserDocRef = doc(db, "user", this.currentUserId);
        const selectedUserDocRef = doc(db, "user", this.selectedUserId);

        const currentUserSnapshot = await getDoc(currentUserDocRef);
        const selectedUserSnapshot = await getDoc(selectedUserDocRef);

        if (!currentUserSnapshot.exists() || !selectedUserSnapshot.exists()) {
          throw new Error("User profile data missing for one of the users.");
        }

        const defaultProfileImage = "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"; // Replace with your default image URL

        const {
          username: currentDisplayName,
          profile_image: currentProfilePic,
        } = currentUserSnapshot.data();

        const {
          username: selectedDisplayName,
          profile_image: selectedProfilePic,
        } = selectedUserSnapshot.data();

        // Use default image if profile image is missing
        const userInfo = {
          [this.currentUserId]: {
            username: currentDisplayName,
            profile_image: currentProfilePic || defaultProfileImage,
          },
          [this.selectedUserId]: {
            username: selectedDisplayName,
            profile_image: selectedProfilePic || defaultProfileImage,
          },
        };

        // Create a new chat document with user IDs and userInfo
        const newChatDoc = await addDoc(collection(db, "chat"), {
          users: [this.currentUserId, this.selectedUserId],
          userInfo,
          createdAt: serverTimestamp(),
        });

        // Add new chat to userChats and select it
        const newChat = {
          id: newChatDoc.id,
          users: [this.currentUserId, this.selectedUserId],
          userInfo,
          lastMessage: "",
          lastMessageTime: null,
        };
        this.userChats.push(newChat);
        this.selectChat(newChatDoc.id);
      } catch (error) {
        console.error("Error creating new chat:", error);
      }
    },
    async fetchBookmarkedUsers() {
      try {
        // Step 1: Query the `bookmark` collection to get all bookmarks by the current user
        const bookmarksRef = collection(db, "bookmark");
        const q = query(bookmarksRef, where("userId", "==", this.userId));
        const bookmarkDocs = await getDocs(q);

        // Step 2: For each bookmarked user, retrieve chat and user data
        const chatPromises = bookmarkDocs.docs.map(async (bookmarkDoc) => {
          const { bookmarkedUserId } = bookmarkDoc.data();

          // Step 2.1: Check if a chat already exists between the current user and the bookmarked user
          let chatData = await this.findExistingChat(
            this.userId,
            bookmarkedUserId
          );

          if (chatData) {
            // Step 2.2: If the chat exists, add the category property
            chatData.category = "Bookmark";
          } else {
            // Step 2.3: If no chat exists, create a new chat and set category
            chatData = await this.createChatWithBookmarkedUser(
              bookmarkedUserId
            );
            chatData.category = "Bookmark"; // Set category for new chat
          }

          // Step 3: Retrieve user data from the `user` collection for the bookmarked user
          const userDocRef = doc(db, "user", bookmarkedUserId);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = {
              username: userDoc.data().username,
              profile_image: userDoc.data().profile_image,
            };

            // Add the bookmarked user's data to `userInfo` in the chat data
            chatData.userInfo[bookmarkedUserId] = userData;
            return chatData;
          }
        });

        // Step 4: Resolve all promises and update `userChats` with the combined data
        const chatsWithBookmarkedUsers = (
          await Promise.all(chatPromises)
        ).filter(Boolean);
        this.userChats = [...this.userChats, ...chatsWithBookmarkedUsers];
        console.log("Updated userChats with bookmarked users:", this.userChats);
      } catch (error) {
        console.error("Error fetching bookmarked users:", error);
      }
    },

    // Helper method to find an existing chat between two users
    async findExistingChat(userId, bookmarkedUserId) {
      const chatsRef = collection(db, "chat");
      const chatQuery = query(
        chatsRef,
        where("users", "array-contains", userId)
      );
      const chatSnapshot = await getDocs(chatQuery);

      // Check each chat document to see if it includes both the current user and bookmarked user
      for (const doc of chatSnapshot.docs) {
        const chatData = doc.data();
        if (
          chatData.users.includes(userId) &&
          chatData.users.includes(bookmarkedUserId)
        ) {
          return { id: doc.id, ...chatData }; // Return the existing chat data
        }
      }
      return null; // Return null if no chat exists
    },

    // Helper method to create a new chat with a bookmarked user if no existing chat is found
    async createChatWithBookmarkedUser(bookmarkedUserId) {
      try {
        // Step 1: Fetch current user info and bookmarked user info
        const currentUserDocRef = doc(db, "user", this.userId);
        const bookmarkedUserDocRef = doc(db, "user", bookmarkedUserId);

        const [currentUserSnapshot, bookmarkedUserSnapshot] = await Promise.all(
          [getDoc(currentUserDocRef), getDoc(bookmarkedUserDocRef)]
        );

        if (!currentUserSnapshot.exists() || !bookmarkedUserSnapshot.exists()) {
          throw new Error("User profile data missing for one of the users.");
        }

        const currentUserData = currentUserSnapshot.data();
        const bookmarkedUserData = bookmarkedUserSnapshot.data();

        // Step 2: Create userInfo object with required fields for both users
        const userInfo = {
          [this.userId]: {
            username: currentUserData.username,
            profile_image: currentUserData.profile_image,
          },
          [bookmarkedUserId]: {
            username: bookmarkedUserData.username,
            profile_image: bookmarkedUserData.profile_image,
          },
        };

        // Step 3: Create a new chat document with user IDs and userInfo
        const newChatDoc = await addDoc(collection(db, "chat"), {
          users: [this.userId, bookmarkedUserId],
          userInfo,
          createdAt: serverTimestamp(),
        });

        // Step 4: Return the newly created chat data
        return {
          id: newChatDoc.id,
          users: [this.userId, bookmarkedUserId],
          userInfo,
          lastMessage: "",
          lastMessageTime: null,
          category: "Bookmark", // Label it as a bookmarked chat
        };
      } catch (error) {
        console.error("Error creating new chat with bookmarked user:", error);
      }
    },

    selectCategory(category, index) {
      this.selectedCategory = category;
      this.activeIndex = index;
    },

    listenForMessages() {
      // Clean up previous listener if it exists
      if (this.unsubscribeMessagesListener) {
        this.unsubscribeMessagesListener(); // Unsubscribe from previous listener
      }

      // Set up a new listener for the current chat's messages
      const messagesRef = collection(db, "chat", this.chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      this.unsubscribeMessagesListener = onSnapshot(q, (querySnapshot) => {
        this.messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },

    async loadMessages() {
      if (!this.chatId) return;

      const messagesRef = collection(db, "chat", this.chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      // Set up real-time listener for messages
      onSnapshot(q, (querySnapshot) => {
        this.messages = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      });
    },

    async sendMessage() {
      if (!this.newMessage.trim()) return;

      try {
        const messagesRef = collection(db, "chat", this.chatId, "messages");
        await addDoc(messagesRef, {
          text: this.newMessage,
          senderId: this.currentUserId,
          timestamp: serverTimestamp(),
        });
        // Reference to the chat document (parent document of messages collection)
        const chatDocRef = doc(db, "chat", this.chatId);

        // Update the chat document with the latest message details
        await updateDoc(chatDocRef, {
          lastMessage: this.newMessage, // Store the latest message text
          lastMessageTimeStamp: serverTimestamp(), // Store the timestamp of the latest message
        });

        this.newMessage = "";
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      } catch (error) {
        console.error("Error sending message:", error);
      }
    },

    selectChat(chatId) {
      this.chatId = chatId;
      this.selectedChat = this.userChats.find((chat) => chat.id === chatId);
      //   this.loadMessages(); // Load messages for the selected chat
      this.listenForMessages();
    },

    getChatPartnerProfileImage(chat) {
      // Check if chat, chat.users, and chat.userInfo are defined
      if (
        !chat ||
        !chat.users ||
        !Array.isArray(chat.users) ||
        !chat.userInfo
      ) {
        console.warn("Chat data is missing or improperly formatted:", chat);
        return "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"; // Return a default image if data is missing
      }

      // Find the partner ID
      const partnerId = chat.users.find(
        (userId) => userId !== this.currentUserId
      );

      // Return the partner's profile picture, or default if missing
      return (
        chat.userInfo[partnerId]?.profile_image ||
        "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"
      );
    },

    getChatPartnerName(chat) {
      // Check if chat, chat.users, and chat.userInfo are defined
      if (
        !chat ||
        !chat.users ||
        !Array.isArray(chat.users) ||
        !chat.userInfo
      ) {
        console.warn("Chat data is missing or improperly formatted:", chat);
        return "Unknown User"; // Return a default name if data is missing
      }

      // Find the partner ID
      const partnerId = chat.users.find(
        (userId) => userId !== this.currentUserId
      );

      // Return the partner's display name, or default if missing
      return chat.userInfo[partnerId]?.username || "Unknown User";
    },

    formatDate(timestamp) {
      return timestamp?.toDate().toLocaleTimeString() || "";
    },
    deleteChat() {
      if (this.selectedChat) {
        // Confirm deletion before proceeding
        if (
          confirm(
            `Are you sure you want to delete the chat with ${this.getChatPartnerName(
              this.selectedChat
            )}?`
          )
        ) {
          const chatRef = doc(db, "chat", this.selectedChat.id);

          deleteDoc(chatRef)
            .then(() => {
              // Remove the chat from the local `userChats` array
              this.userChats = this.userChats.filter(
                (chat) => chat.id !== this.selectedChat.id
              );
              // Clear selected chat data
              this.chatId = null;
              this.selectedChat = null;
            })
            .catch((error) => {
              console.error("Error deleting chat:", error);
            });
        }
      }
    },
  },
  mounted: async function () {
    // Scroll to the bottom of the chat window (if applicable)
    this.scrollToBottom();

    // Check if the user is logged in
    if (this.isLoggedIn) {
      console.log("Logged-in User ID:", this.userId);
      this.currentUserId = this.userId;

      try {
        // Fetch user chats
        await this.fetchUserChats();

        // Fetch bookmarked users and add them to userChats
        await this.fetchBookmarkedUsers();

        // Start listening for chat updates after initial data retrieval
        this.listenForChatUpdates();
      } catch (error) {
        console.error("Error initializing chat data:", error);
      }
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Alkatra:wght@400..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
* {
  font-family: "Poppins", sans-serif;
}

.chat-container {
  display: flex;
  height: 92vh;
}
.col {
  flex: 1 0 0%;
  padding: 0;
}
/* Sidebar styling */
.sidebar {
  width: 450px; /* Fixed width for the sidebar */
  min-width: 250px; /* Minimum width for better responsiveness */
  max-width: 450px;
  background-color: white;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}
.chat-list {
  padding: 1rem;
}

.search-bar input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
}

.chat-list h3 {
  font-size: 25px;
}

.back-btn {
  display: inline-flex;
  border: none;
  color: rgba(0, 0, 0, 0.6);
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 25%;
  text-align: center;
  padding: 7px 13px;
  text-decoration: none;
}

ul,
ol {
  padding: 0;
  margin: 0;
}

.chat-item {
  display: flex;
  align-items: center;
  padding: 0.5rem;
  cursor: pointer;
}

.chat-pic {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  margin-right: 0.3rem;
}
.chat-info {
  flex-grow: 1;
  margin-left: 10px;
}
.chat-name {
  font-weight: bold;
  margin: 0;
}
.chat-preview {
  font-size: 0.9rem;
  color: #888;
  max-width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.chat-time {
  font-size: 0.8rem;
  color: #aaa;
}
.active {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 5%;
}
/* Main chat area styling */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: rgb(242, 245, 249);
  overflow: hidden;
}

.no-chat-selected {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center horizontally */
  justify-content: center;
  height: 100%;
}

.chat-area img {
  width: 170px;
  height: auto;
  object-fit: contain;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ddd;
}

.chat-header h3 {
  margin-right: 0.5rem;
}

.messages {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
}

/* Message input */
.message-input {
  padding: 1.2rem;
  border-top: 1px solid #ddd;
}

.input-wrapper {
  display: flex;
}
.message-input-field {
  flex: 1;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 20px;
}

.send-button {
  background-color: transparent;
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1.2rem;
  color: rgb(54, 181, 152);
}

.message {
  max-width: 70%;
  width: fit-content;
  margin: 0.5rem 0;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  position: relative;
}
.message-incoming {
  background-color: rgb(54, 181, 152, 0.2);
  border: 1px solid transparent;
  text-align: left;
}
.message-incoming:before {
  content: "";
  position: absolute;
  left: -8px; /* Adjust this to position the tail */
  bottom: 6px; /* Adjust to move tail vertically */
  width: 0;
  height: 0;
  border-right: 8px solid rgb(54, 181, 152, 0.2); /* Matches background color */
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.message-outgoing {
  background-color: #fff;
  color: black;
  margin-left: auto;
  text-align: right;
}
.message-outgoing:after {
  content: "";
  position: absolute;
  right: -8px; /* Adjust this to position the tail */
  bottom: 6px; /* Adjust to move tail vertically */
  width: 0;
  height: 0;
  border-left: 8px solid #fff; /* Matches background color */
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
}

.message-time {
  display: block;
  font-size: 0.75rem;
  color: #888;
  margin-top: 0.25rem;
}

.no-results-message {
  text-align: center;
  color: #888;
  margin-top: 1rem;
  font-size: 1rem;
}

.tabs-container {
  position: relative;
  border-bottom: 2px solid #ddd;
  margin-bottom: 10px;
}

/* Tabs styling */
.tabs {
  display: flex;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px 0;
  color: #555;
  cursor: pointer;
  transition: color 0.3s ease;
}

.tab.active {
  color: black;
  background-color: transparent;
}

.tab:hover {
  color: black;
}

.slider {
  position: absolute;
  bottom: -1;
  height: 2px;
  background-color: rgb(54, 181, 152);
  transition: transform 0.3s ease, width 0.3s ease;
}

.chatmsg-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.8); /* Translucent white */
  padding: 1rem 1.5rem;
  font-weight: 600;
  min-height: 87px;
  color: #333;
  border-bottom: 1px solid #ddd;
  border-radius: 10px 10px 0 0; /* Rounded top edges to match the design */
  backdrop-filter: blur(
    10px
  ); /* Optional: Adds a blur effect for extra depth */
  position: sticky; /* Makes the header stick to the top */
  top: 0; /* Sticks to the top of the chat area */
  z-index: 10; /* Ensures the header stays above the messages */
}

.chatmsg-header h2 {
  font-size: 1.2em;
  margin: 0;
}

.delete-chat-button {
  background-color: #f28b82; /* Red for emphasis */
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 5px;
}
/* Responsive adjustments */
@media (max-width: 768px) {
  .sidebar {
    width: 200px; /* Reduce sidebar width for smaller screens */
  }
  .chat-time {
    display: none;
  }
}

@media (max-width: 576px) {
  .chat-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
    max-width: none; /* Sidebar takes full width on small screens */
    max-height: 50%; /* Adjust the height as needed */
    overflow-y: auto; /* Enable scrolling if content overflows */
  }
  .chat-area {
    flex: 1;
    overflow: auto;
  }
  .chat-time {
    display: block;
  }
}
</style>
