import { Models } from "appwrite";
import Loader from "@/components/shared/Loader";
import GridPostItem from "@/components/shared/GridPostItem";
import {
  useGetCurrentUser,
  useGetUsersSavedPosts,
} from "@/lib/react-query/quires&mutation";

const Saved = () => {
  const { data: currentUser } = useGetCurrentUser();
  const { data: saves } = useGetUsersSavedPosts(currentUser?.$id || "");

  if (!saves) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>
      <ul className="grid-container">
        {saves?.documents.length === 0 ? (
          <p className="text-light-4">No available posts</p>
        ) : (
          saves?.documents.map((post: Models.Document) => (
            <GridPostItem post={post.post} key={post.$id} />
          ))
        )}
      </ul>
    </div>
  );
};

export default Saved;
