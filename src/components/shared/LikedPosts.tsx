import { Models } from "appwrite";
import Loader from "@/components/shared/Loader";
import GridPostItem from "@/components/shared/GridPostItem";
import { useGetCurrentUser } from "@/lib/react-query/quires&mutation";
import { useEffect, useState } from "react";

const LikedPosts = () => {
  const [likedList, setLikedList] = useState<Models.Document[]>([]);
  const { data: currentUser } = useGetCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    let liked = [...currentUser.liked];
    liked = liked.reverse();
    setLikedList(liked);
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <ul className="grid-container">
      {likedList.length === 0 ? (
        <p className="text-light-4">You did not like any post</p>
      ) : (
        likedList.map((post: Models.Document) => (
          <GridPostItem post={post} key={post.$id} showStats={false} />
        ))
      )}
    </ul>
  );
};

export default LikedPosts;
