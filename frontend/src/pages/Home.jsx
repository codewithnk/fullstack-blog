import { useState } from "react";
import { useGetPostsQuery } from "../features/posts/postsApi";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading } = useGetPostsQuery({ page: 1 });

  if (isLoading) return <p className="text-center mt-10">Loading...</p>;

  const posts = data?.posts ?? [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Latest Posts</h1>

      {posts.map((post) => (
        <div key={post._id} className="border p-4 mb-4 rounded">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-sm text-gray-500">
            By {post.author.name} ·{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p className="mt-2">
            {post.content.slice(0, 100)}...
            <Link
              to={`/posts/${post._id}`}
              className="text-blue-600 hover:underline ml-2"
            >
              Read More
            </Link>
          </p>
        </div>
      ))}
    </div>
  );
};

export default Home;
