import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import LikedPosts from "../../components/shared/LikedPosts";
import { useUserContext } from "@/context/AuthContext";
import GridPostItem from "@/components/shared/GridPostItem";
import Loader from "@/components/shared/Loader";
import { Models } from "appwrite";
import { useGetUserById } from "@/lib/react-query/quires&mutation";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserById(id || "");

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container bg-dark-3 p-6 rounded-xl">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
          />
          <div className="flex flex-col flex-1">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold capitalize w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.userName}
              </p>
              {currentUser.bio && (
                <p className="small-medium md:base-medium text-center xl:text-left mt-3 max-w-screen-sm first-letter:capitalize">
                  {currentUser.bio}
                </p>
              )}
            </div>

            <div className="flex gap-8 items-center mt-4 justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
            </div>
          </div>

          {user.id === currentUser.$id && (
            <div className="flex justify-center gap-4">
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="flex max-w-5xl w-full">
        <Link
          to={`/profile/${id}`}
          className={`profile-tab rounded-l-lg ${
            currentUser.$id !== user.id && "profile-tab-single rounded-lg"
          } ${pathname === `/profile/${id}` && "!bg-dark-3"}`}
        >
          <img
            src={"/assets/icons/posts.svg"}
            alt="posts"
            width={20}
            height={20}
          />
          Posts
        </Link>
        {currentUser.$id === user.id && (
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        )}
      </div>

      <Routes>
        <Route
          index
          element={
            <ul className="grid-container">
              {currentUser.posts.length === 0 ? (
                <p className="text-light-4 first-letter:capitalize">
                  {user.id === currentUser.$id
                    ? "You do not have any post"
                    : `${currentUser.name} do not have any post`}
                </p>
              ) : (
                currentUser.posts.map((post: Models.Document) => (
                  <GridPostItem key={post.$id} post={post} showUser={false} />
                ))
              )}
            </ul>
          }
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
