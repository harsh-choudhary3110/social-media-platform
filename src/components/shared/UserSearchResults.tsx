import { Models } from "appwrite";
import Loader from "./Loader";
import UserCard from "./UserCard";

type SearchResultsProps = {
  isSearchFeatching: boolean;
  searchedUsers: Models.Document[] | undefined;
};
const UserSearchResults = ({
  isSearchFeatching,
  searchedUsers,
}: SearchResultsProps) => {
  if (isSearchFeatching) return <Loader />;

  if (searchedUsers && searchedUsers.length > 0) {
    return (
      <ul className="user-grid">
        {searchedUsers.map((user) => (
          <UserCard key={user.$id} user={user} />
        ))}
      </ul>
    );
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default UserSearchResults;
