import { useUserContext } from "@/context/AuthContext";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type GridPostListProps = {
  post: Models.Document;
  showUser?: boolean;
  showStats?: boolean;
};
const GridPostItem = ({
  post,
  showUser = true,
  showStats = true,
}: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <li className="relative  h-80">
      <Link to={`/posts/${post.$id}`} className="grid-post_link">
        <img
          src={post.imageUrl}
          alt="post"
          className="w-full h-full object-cover"
        />
      </Link>

      <div className="grid-post_user">
        {showUser && (
          <div className="flex items-center justify-start gap-2">
            <img
              src={post.creater.imageUrl}
              alt="creator"
              className="h-8 w-8 rounded-full object-cover"
            />
            <p className="line-clamp-1">{post.creater.name}</p>
          </div>
        )}

        {showStats && <PostStats post={post} userId={user.id} />}
      </div>
    </li>
  );
};

export default GridPostItem;
