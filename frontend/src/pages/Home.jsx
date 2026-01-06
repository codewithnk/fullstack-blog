import { useState } from "react";
import { useGetPostsQuery } from "../features/posts/postsApi";
import PostCard from "../components/PostCard";
import Pagination from "../components/Pagination";

const Home = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useGetPostsQuery({ page });
  if (isLoading)
    return <div className="text-center mt-20">Loading posts...</div>;
  if (isError)
    return (
      <div className="text-center mt-10 text-red-600">
        Error: {error?.data?.message || "Could not load posts"}
      </div>
    );

  const posts = data?.posts ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>
      {posts.length === 0 ? (
        <p className="text-center py-16 text-gray-500">No posts found.</p>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      )}
    </div>
  );
};

export default Home;
