import Loader from "@/components/shared/Loader";
import { useGetRecentPosts } from "@/lib/react-query/quires&mutation";
import { Models } from "appwrite";
import PostsCard from "@/components/shared/PostsCard";
import { Fragment } from "react";

const Home = () => {
  const { data: posts, isPending: isPostLoading } = useGetRecentPosts();

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {posts.documents.length === 0 ? (
              <p className="text-light-4">No available posts</p>
            ) : (
              posts.documents.map((post: Models.Document) => (
                <Fragment key={post.$id}>
                  <PostsCard post={post} />
                </Fragment>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
