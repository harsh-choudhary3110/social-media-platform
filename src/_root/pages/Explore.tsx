import GridPostItem from "@/components/shared/GridPostItem";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetInfinitePosts,
  useSearchPost,
} from "@/lib/react-query/quires&mutation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const { ref, inView } = useInView();
  const { data: posts, fetchNextPage, hasNextPage } = useGetInfinitePosts();

  const [isPostAvailable, setIsPostAvailable] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const deBouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFeatching } = useSearchPost(
    deBouncedValue.length >= 2 ? deBouncedValue : ""
  );

  useEffect(() => {
    if (inView && !searchValue && hasNextPage) fetchNextPage();
  }, [inView, searchValue]);

  useEffect(() => {
    if (!posts || !posts.pages || !posts.pages[0]) return;

    const isPost = posts.pages[0].total === 0;

    console.log(!isPost);

    setIsPostAvailable(!isPost);
  }, [posts]);

  if (!posts) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const shouldShowSearchResult = searchValue !== "";

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <div className="flex gap-2 w-full max-w-5xl">
          <img
            src="/assets/icons/wallpaper.svg"
            width={36}
            height={36}
            alt="edit"
            className="invert-white"
          />
          <h2 className="h3-bold md:h2-bold w-full">Explore</h2>
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

      <div className="flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold md:h3-bold w-full">Papular Today</h3>

        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filteer"
            width={20}
            height={20}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {shouldShowSearchResult ? (
          <SearchResults
            isSearchFeatching={isSearchFeatching}
            searchedPosts={searchedPosts?.documents}
          />
        ) : (
          <ul className="grid-container">
            {!isPostAvailable ? (
              <p className="text-light-4 w-full">No available posts</p>
            ) : (
              posts.pages.map((page) =>
                page?.documents.map((post) => (
                  <GridPostItem key={post.$id} post={post} />
                ))
              )
            )}
          </ul>
        )}
      </div>

      {!shouldShowSearchResult && hasNextPage ? (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      ) : (
        isPostAvailable && (
          <p className="text-light-4 mt-10 text-center w-full">End of posts</p>
        )
      )}
    </div>
  );
};

export default Explore;
