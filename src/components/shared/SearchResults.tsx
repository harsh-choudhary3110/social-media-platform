import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostLists from "./GridPostItem";

type SearchResultsProps = {
  isSearchFeatching: boolean;
  searchedPosts: Models.Document[] | undefined;
};
const SearchResults = ({
  isSearchFeatching,
  searchedPosts,
}: SearchResultsProps) => {
  if (isSearchFeatching) return <Loader />;

  if (searchedPosts && searchedPosts.length > 0) {
    return (
      <ul className="grid-container">
        {searchedPosts.map((post) => (
          <GridPostLists key={post.$id} post={post} />
        ))}
      </ul>
    );
  }

  return (
    <p className="text-light-4 mt-10 text-center w-full">No results found</p>
  );
};

export default SearchResults;
