import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { account, appwriteConfig, avatars, databases, storage } from "./config";
import { ID, Query } from "appwrite";

export const createUserAccount = async (user: INewUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = await avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      imageUrl: avatarUrl,
      userName: user.userName,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const saveUserToDB = async (user: {
  accountId: string;
  name: string;
  email: string;
  imageUrl: URL;
  userName?: string;
}) => {
  try {
    const newUser = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
};

export const signInAccount = async (user: {
  email: string;
  password: string;
}) => {
  try {
    const createSession = await account.createEmailSession(
      user.email,
      user.password
    );
    return createSession;
  } catch (error) {
    console.log(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
};

export const signOutAccount = async () => {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
};

// posts
export const createPost = async (post: INewPost) => {
  try {
    // upload image to stroage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // get file url
    const fileUrl = getFilePreviw(uploadedFile.$id);

    if (!fileUrl) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    // conver tags in array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // save post to db
    const newPost = await savePostToDB({
      creater: post.userId,
      caption: post.caption,
      imageUrl: fileUrl,
      imageId: uploadedFile.$id,
      location: post.location,
      tags,
    });

    if (!newPost) {
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
};

export const uploadFile = async (file: File) => {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
};

export const getFilePreviw = (fileId: string) => {
  try {
    const fileUrl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileUrl;
  } catch (error) {
    console.log(error);
  }
};

export const savePostToDB = async (post: {
  creater: string;
  caption: string;
  imageUrl: URL;
  imageId: string;
  location?: string | undefined;
  tags?: string[] | undefined;
}) => {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      post
    );
    return newPost;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFile = async (fileId: string) => {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (post: IUpdatePost) => {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // upload image to stroage
      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      // get file url
      const fileUrl = getFilePreviw(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      // delete previous image of post
      deleteFile(post.imageId);

      image = {
        ...image,
        imageUrl: fileUrl,
        imageId: uploadedFile.$id,
      };
    }

    // conver tags in array
    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // update post in db
    const updatedPost = await updatePostToDB(
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
        location: post.location,
        tags,
      },
      post.postId
    );

    if (!updatedPost) {
      if (hasFileToUpdate) deleteFile(post.imageId);
      throw Error;
    }

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const updatePostToDB = async (
  post: {
    caption: string;
    imageUrl: URL;
    imageId: string;
    location?: string | undefined;
    tags?: string[] | undefined;
  },
  postId: string
) => {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      post
    );
    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const getRecentPosts = async () => {
  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    [Query.orderDesc("$createdAt"), Query.limit(20)]
  );

  if (!posts) throw Error;

  return posts;
};

export const getPostById = async (postId: string) => {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!post) throw Error;

    return post;
  } catch (error) {
    console.log(error);
  }
};

export const getInfinitePosts = async (pageParam: string | null) => {
  const queries: string[] = [Query.orderDesc("$createdAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const searchPosts = async (searchTerm: string) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const likePost = async (postId: string, likesArray: string[]) => {
  try {
    const updatedPost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const savePost = async (postId: string, userId: string) => {
  try {
    const updatedPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        post: postId,
        user: userId,
      }
    );

    if (!updatedPost) throw Error;

    return updatedPost;
  } catch (error) {
    console.log(error);
  }
};

export const deleteSavedPost = async ({
  savedRecordId,
  postId,
}: {
  savedRecordId: string;
  postId: string;
}) => {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    console.log(statusCode);

    if (!statusCode) throw Error;

    return { ...statusCode, postId };
  } catch (error) {
    console.log(error);
  }
};

export const deletePost = async (postId: string, imageId: string) => {
  if (!postId || !imageId) throw Error;

  try {
    const deletedAllSaves = await deleteAllSavesByPostId(postId);

    if (!deletedAllSaves) throw Error;

    const deletedPost = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    if (!deletedPost) throw Error;

    await deleteFile(imageId);

    return { ...deletedPost, postId };
  } catch (error) {
    console.log(error);
  }
};

export const deleteAllSavesByPostId = async (postId: string) => {
  try {
    const savesToDelete = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("post", postId)]
    );

    if (!savesToDelete) throw Error;

    const deletedSaves = await Promise.all(
      savesToDelete.documents.map(
        async (save) =>
          await deleteSavedPost({ savedRecordId: save.$id, postId })
      )
    );

    if (!deletedSaves) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
};

// users
export const getUsersSavedPosts = async (currentUserId: string) => {
  try {
    const saves = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      [Query.equal("user", [currentUserId]), Query.orderDesc("$createdAt")]
    );

    if (!saves) throw Error;

    return saves;
  } catch (error) {
    console.log(error);
  }
};

export const getUsersInfinite = async (
  currentUserId: string,
  pageParam: string | null
) => {
  const queries: string[] = [
    Query.notEqual("$id", [currentUserId]),
    Query.orderDesc("$createdAt"),
    Query.limit(10),
  ];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      queries
    );

    if (!users) throw Error;

    return users;
  } catch (error) {
    console.log(error);
  }
};

export const searchUsers = async (
  currentUserId: string,
  searchTerm: string
) => {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.notEqual("$id", [currentUserId]), Query.search("name", searchTerm)]
    );

    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
};

export const getUserById = async (userId: string) => {
  try {
    const user = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      userId
    );

    if (!user) throw Error;

    return user;
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (user: IUpdateUser) => {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      // Upload new file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw Error;

      // Get new file url
      const fileUrl = getFilePreviw(uploadedFile.$id);
      if (!fileUrl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };
    }

    //  Update user
    const updatedUser = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageUrl: image.imageUrl,
        imageId: image.imageId,
      }
    );

    // Failed to update user
    if (!updatedUser) {
      // Delete new file that has been recently uploaded
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }
      throw Error;
    }

    // delete old profile image
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }

    return updatedUser;
  } catch (error) {
    console.log(error);
  }
};
