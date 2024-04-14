import React, { useEffect, useState } from "react";
import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/quires&mutation";
import { Models } from "appwrite";
import { checkIsLiked } from "@/lib/utils";
import Loader from "./Loader";

type PostStatsProps = {
  post?: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
  if (!post || !userId) return null;

  const { data: currentUser, isFetching: isFetchingCurrentUser } =
    useGetCurrentUser();

  const [likes, setLikes] = useState<string[]>([]);

  const [saves, setSaves] = useState<{
    isSaved: boolean;
    savedRecord: Models.Document | null;
  }>({
    isSaved: false,
    savedRecord: null,
  });
  const [isSaveInProcess, setisSaveInProcess] = useState(false);

  useEffect(() => {
    if (isFetchingCurrentUser) return;
    setisSaveInProcess(false);
  }, [isFetchingCurrentUser]);

  const { mutate: likePost, isPending: isLikePending } = useLikePost();
  const { mutate: savePost } = useSavePost();
  const { mutate: deleteSavedPost } = useDeleteSavedPost();

  // like functionality
  useEffect(() => {
    const likesList = post.likes.map((user: Models.Document) => user.$id);
    setLikes(likesList);
  }, [post]);

  const handleLikePost = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    let hasLiked = checkIsLiked(likesArray, userId);

    if (hasLiked) {
      likesArray = likesArray.filter((user_id) => user_id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    // like/unlike in backend
    likePost({ postId: post.$id, likesArray });
  };

  // save functionality
  useEffect(() => {
    if (!currentUser) return;

    const savedPostRecord = currentUser.save.find(
      (record: Models.Document) => record.post.$id === post.$id
    );
    const isPostSaved = !!savedPostRecord;

    setSaves({
      isSaved: isPostSaved,
      savedRecord: savedPostRecord,
    });
  }, [currentUser, post]);

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    setisSaveInProcess(true);

    let toSave: boolean;

    if (saves.isSaved) {
      if (!saves.savedRecord) return;

      toSave = false;
      deleteSavedPost({
        savedRecordId: saves.savedRecord.$id,
        postId: post.$id,
      });
    } else {
      toSave = true;
      savePost({ postId: post.$id, userId: userId });
    }

    setSaves((prev) => ({
      ...prev,
      isSaved: toSave,
    }));
  };

  return (
    <div
      className={`post-stats-section flex justify-between items-center z-20`}
    >
      <div className="flex gap-2 mr-5">
        {isLikePending ? (
          <Loader />
        ) : (
          <>
            <img
              src={
                checkIsLiked(likes, userId)
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
              }
              alt="like"
              width={20}
              height={20}
              onClick={(e) => handleLikePost(e)}
              className="cursor-pointer"
            />
            <p className="small-medium lg:base-medium">{likes.length}</p>
          </>
        )}
      </div>

      <div className="flex gap-2">
        {isSaveInProcess ? (
          <Loader />
        ) : (
          <img
            src={
              saves.isSaved
                ? "/assets/icons/saved.svg"
                : "/assets/icons/save.svg"
            }
            alt="share"
            width={20}
            height={20}
            className="cursor-pointer"
            onClick={(e) => handleSavePost(e)}
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;
