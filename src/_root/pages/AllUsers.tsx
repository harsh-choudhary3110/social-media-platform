import Loader from "@/components/shared/Loader";
import UserCard from "@/components/shared/UserCard";
import UserSearchResults from "@/components/shared/UserSearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetCurrentUser,
  useGetUsersInfinite,
  useSearchUser,
} from "@/lib/react-query/quires&mutation";
import { Models } from "appwrite";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const { ref, inView } = useInView();
  const { data: currentUser } = useGetCurrentUser();
  const {
    data: users,
    fetchNextPage,
    hasNextPage,
  } = useGetUsersInfinite(currentUser?.$id || "");

  const [isUserAvailable, setIsUserAvailable] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const deBouncedValue = useDebounce(searchValue, 500);
  const { data: searchedUsers, isFetching: isSearchFeatching } = useSearchUser(
    currentUser?.$id || "",
    deBouncedValue.length >= 2 ? deBouncedValue : ""
  );

  useEffect(() => {
    if (inView && !searchValue && hasNextPage) fetchNextPage();
  }, [inView, searchValue]);

  useEffect(() => {
    if (!users || !users.pages || !users.pages[0]) return;

    const isPost = users.pages[0].total === 0;

    console.log(!isPost);

    setIsUserAvailable(!isPost);
  }, [users]);

  if (!users) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResult = searchValue !== "";

  return (
    <div className="common-container">
      <div className="user-container">
        <div className="explore-inner_container">
          <div className="flex gap-2 w-full max-w-5xl">
            <img
              src="/assets/icons/people.svg"
              width={36}
              height={36}
              alt="edit"
              className="invert-white"
            />
            <h2 className="h3-bold md:h2-bold text-left w-full">
              Explore Creators
            </h2>
          </div>

          <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
            <img
              src="/assets/icons/search.svg"
              alt="search"
              width={24}
              height={24}
            />
            <Input
              type="text"
              placeholder="Search"
              className="explore-search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        {shouldShowSearchResult ? (
          <UserSearchResults
            isSearchFeatching={isSearchFeatching}
            searchedUsers={searchedUsers?.documents}
          />
        ) : (
          <ul className="user-grid">
            {!isUserAvailable ? (
              <p className="text-light-4 w-full">No available creators</p>
            ) : (
              users.pages.map((page) =>
                page?.documents.map((user: Models.Document) => (
                  <li key={user.$id} className="flex-1 min-w-[200px] w-full">
                    <UserCard user={user} />
                  </li>
                ))
              )
            )}
          </ul>
        )}

        {!shouldShowSearchResult && hasNextPage ? (
          <div ref={ref} className="w-full">
            <Loader />
          </div>
        ) : (
          isUserAvailable && (
            <p className="text-light-4 text-center w-full">End of users</p>
          )
        )}
      </div>
    </div>
  );
};

export default AllUsers;
