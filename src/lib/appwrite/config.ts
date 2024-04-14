import { Client, Account, Databases, Storage, Avatars } from "appwrite";

export const appwriteConfig = {
  ulr: import.meta.env.VITE_APPWRITE_URL,
  projctId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE_ID,
  usersCollectionId: import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID,
  savesCollectionId: import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID,
  postsCollectionId: import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID,
};

export const client = new Client();

client.setProject(appwriteConfig.projctId);
client.setEndpoint(appwriteConfig.ulr);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
