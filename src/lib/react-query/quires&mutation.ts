import {
  useMutation,
  useInfiniteQuery,
  useQueryClient,
  useQuery,
} from "@tanstack/react-query";
import {
  createPost,
  createUserAccount,
  deletePost,
  deleteSavedPost,
  getCurrentUser,
  getInfinitePosts,
  getPostById,
  getRecentPosts,
  getUserById,
  getUsersInfinite,
  getUsersSavedPosts,
  likePost,
  savePost,
  searchPosts,
  searchUsers,
  signInAccount,
  signOutAccount,
  updatePost,
  updateUser,
} from "../appwrite/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "@/types";
import { QUERY_KEYS } from "./queryKeys";

// auth
export const useCreateUserAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: INewUser) => createUserAccount(user),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useSignInAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      signInAccount(user),
    onSuccess: () => {
      queryClient.invalidateQueries();
    },
  });
};

export const useGetCurrentUser = (enabled = true) => {
  const queryClient = useQueryClient();
  queryClient.setQueryDefaults([QUERY_KEYS.GET_CURRENT_USER], {
    staleTime: 0,
  });

  return useQuery({
    queryKey: [QUERY_KEYS.GET_CURRENT_USER],
    queryFn: getCurrentUser,
    enabled,
  });
};

export const useSignOutAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: signOutAccount,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.invalidateQueries();
      }, 500);
    },
  });
};

// posts
export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: INewPost) => createPost(post),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
    },
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (post: IUpdatePost) => updatePost(post),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS_SAVED_POSTS],
      });
    },
  });
};

export const useGetRecentPosts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
    queryFn: getRecentPosts,
  });
};

export const useGetPostById = (postId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
    queryFn: () => getPostById(postId),
    enabled: !!postId,
  });
};

export const useGetInfinitePosts = () => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getInfinitePosts(pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;
      if (lastPage.documents.length === 0) return null;

      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
  });
};

export const useSearchPost = (searchTerm: string) => {
  const queryClient = useQueryClient();
  queryClient.setQueryDefaults([QUERY_KEYS.SEARCH_POSTS], {
    staleTime: 0,
  });

  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
    queryFn: () => searchPosts(searchTerm),
    enabled: !!searchTerm,
  });
};

export const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      likesArray,
    }: {
      postId: string;
      likesArray: string[];
    }) => likePost(postId, likesArray),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS_SAVED_POSTS],
      });
    },
  });
};

export const useSavePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, userId }: { postId: string; userId: string }) =>
      savePost(postId, userId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.post.$id],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS_SAVED_POSTS],
      });
    },
  });
};

export const useDeleteSavedPost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      savedRecordId,
      postId,
    }: {
      savedRecordId: string;
      postId: string;
    }) => deleteSavedPost({ savedRecordId, postId }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS_SAVED_POSTS],
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ postId, imageId }: { postId: string; imageId: string }) =>
      deletePost(postId, imageId),
    onSuccess: (data) => {
      console.log(data);
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
      });
      queryClient.removeQueries({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.postId],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USERS_SAVED_POSTS],
      });
    },
  });
};

// users
export const useGetUsersSavedPosts = (currentUserId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USERS_SAVED_POSTS],
    queryFn: () => getUsersSavedPosts(currentUserId),
    enabled: !!currentUserId,
  });
};

export const useGetUsersInfinite = (currentUserId: string) => {
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.GET_USERS],
    queryFn: ({ pageParam }: { pageParam: string | null }) =>
      getUsersInfinite(currentUserId, pageParam),
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return null;
      if (lastPage.documents.length === 0) return null;

      const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
      return lastId;
    },
    enabled: !!currentUserId,
  });
};

export const useSearchUser = (currentUserId: string, searchTerm: string) => {
  const queryClient = useQueryClient();
  queryClient.setQueryDefaults([QUERY_KEYS.SEARCH_USERS], {
    staleTime: 0,
  });

  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_USERS, searchTerm],
    queryFn: () => searchUsers(currentUserId, searchTerm),
    enabled: !!currentUserId && !!searchTerm,
  });
};

export const useGetUserById = (userId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: IUpdateUser) => updateUser(user),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
      });
    },
  });
};
