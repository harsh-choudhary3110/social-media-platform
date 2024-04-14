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

  const likesList = post.likes.map((user: Models.Document) => user.$id);

  const [likes, setLikes] = useState<string[]>(likesList);
  const [isSaved, setIsSaved] = useState(false);

  const { mutate: likePost, isPending: isLikePending } = useLikePost();
  const { mutate: savePost, isPending: isSavePending } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletePending } =
    useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const savedPostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === post.$id
  );

  useEffect(() => {
    setIsSaved(!!savedPostRecord);
  }, [currentUser]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    e.stopPropagation();

    let likesArray = [...likes];

    let hasLiked = checkIsLiked(likesArray, userId);

    if (hasLiked) {
      likesArray = likesArray.filter((id) => id !== userId);
    } else {
      likesArray.push(userId);
    }

    setLikes(likesArray);
    likePost({ postId: post.$id, likesArray });
  };

  const handleSavePost = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (savedPostRecord) {
      setIsSaved(false);
      deleteSavedPost(savedPostRecord.$id);
    } else {
      savePost({ postId: post.$id, userId: userId });
      setIsSaved(true);
    }
  };

  return (
    <div className={`flex justify-between items-center z-20`}>
      <div className="flex gap-2 mr-5">
        {isLikePending ? (
          <Loader />
        ) : (
          <>
            <img
              src={`${
                checkIsLiked(likes, userId)
                  ? "/assets/icons/liked.svg"
                  : "/assets/icons/like.svg"
              }`}
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
        {isSavePending || isDeletePending ? (
          <Loader />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
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
