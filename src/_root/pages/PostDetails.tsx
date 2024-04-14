import ConfirmModal from "@/components/shared/ConfirmModal";
import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { toast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
} from "@/lib/react-query/quires&mutation";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useNavigate, useParams } from "react-router-dom";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: post } = useGetPostById(id || "");
  const { user } = useUserContext();
  const { mutateAsync: deletePost, isPending: isDeletingPost } =
    useDeletePost();

  const handleDeletePost = async () => {
    if (!post) return;

    const deleted = await deletePost({
      postId: post.$id || "",
      imageId: post.imageId || "",
    });

    if (!deleted) return toast({ title: "Please try again" });

    navigate("/");
  };

  if (!post) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  return (
    <div className="post_details-container">
      <div className="post_details-card">
        <img src={post.imageUrl} alt="post" className="post_details-img" />

        <div className="post_details-info">
          <div className="flex-between w-full">
            <Link
              to={`/profile/${post.creater.$id}`}
              className="flex items-center gap-3"
            >
              <img
                src={
                  post.creater?.imageUrl ||
                  "assets/icons/profile-placeholder.svg"
                }
                alt="creater"
                className="min-w-8 min-h-8 w-8 h-8 lg:w-12 lg:h-12 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {post.creater?.name}
                </p>
                <p className="subtle-semibold lg:small-regular text-light-3 ">
                  {multiFormatDateString(post.$createdAt)} - {post.location}
                </p>
              </div>
            </Link>

            <div className="flex-center gap-5">
              {user.id === post.creater?.$id && (
                <>
                  <Link to={`/update-post/${post.$id}`}>
                    <img
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      className="min-w-6 min-h-6 w-6 h-6"
                    />
                  </Link>

                  {isDeletingPost ? (
                    <Loader />
                  ) : (
                    <ConfirmModal
                      triggerComponent={
                        <img
                          src="/assets/icons/delete.svg"
                          alt="delete"
                          width={24}
                          height={24}
                        />
                      }
                      description="Are you sure you want to delete this post?"
                      onConfirm={handleDeletePost}
                    />
                  )}
                </>
              )}
            </div>
          </div>
          <hr className="border w-full border-dark-4/80" />
          <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
            <p>{post.caption}</p>
            <ul className="flex gap-1 mt-2">
              {post.tags.map((tag: string) => (
                <li key={tag} className="text-light-3">
                  #{tag}
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full">
            <PostStats post={post} userId={user.id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
