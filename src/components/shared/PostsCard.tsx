import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

type PostCardProps = {
  post: Models.Document;
};

const PostsCard = ({ post }: PostCardProps) => {
  const { user } = useUserContext();

  if (!post?.creater) return;

  return (
    <li className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${post?.creater?.$id}`}>
            <img
              src={
                post.creater.imageUrl || "assets/icons/profile-placeholder.svg"
              }
              alt="creater"
              className="min-w-12 min-h-12 w-12 h-12 rounded-full object-cover"
            />
          </Link>

          <div className="flex flex-col">
            <p className="base-medium lg:body-bold text-light-1">
              {post.creater.name}
            </p>
            <p className="subtle-semibold lg:small-regular text-light-3 ">
              {multiFormatDateString(post.$createdAt)} - {post.location}
            </p>
          </div>
        </div>
        {user?.id === post?.creater?.$id && (
          <Link to={`update-post/${post.$id}`}>
            <img
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
        )}
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.caption}</p>
          <ul className="flex gap-1 mt-2">
            {post?.tags.map((tag: string) => (
              <li key={tag} className="text-light-3">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img src={post?.imageUrl} alt="post" className="post-card_img" />
      </Link>

      <PostStats post={post} userId={user?.id} />
    </li>
  );
};

export default PostsCard;
