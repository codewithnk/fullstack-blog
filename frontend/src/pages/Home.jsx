import { useGetPostsQuery } from "../features/posts/postsApi";
import { Link } from "react-router-dom";

const Home = () => {
  const { data, isLoading } = useGetPostsQuery({ page: 1 });
  const posts = data?.posts ?? [];

  if (isLoading) {
    return (
      <div className="flex justify-center mt-24 text-gray-500">
        Loading posts...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">
          Discover Stories
        </h1>
        <p className="text-gray-500 max-w-xl mx-auto">
          Thoughtful articles written by our community
        </p>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500">No published posts yet.</p>
      ) : (
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const previewText = post.content
              .replace(/<[^>]+>/g, "")
              .slice(0, 140);

            return (
              <article
                key={post._id}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition duration-300"
              >
                <div className="p-6 flex flex-col h-full">
                  {/* Author */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
                      {post.author?.name?.[0]}
                    </div>
                    <div className="text-sm">
                      <p className="font-medium text-gray-800">
                        {post.author?.name}
                      </p>
                      <p className="text-gray-400">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-blue-600 transition">
                    {post.title}
                  </h2>

                  {/* Content Preview */}
                  <p className="text-gray-600 text-sm leading-relaxed flex-grow">
                    {previewText}...
                  </p>

                  {/* Footer */}
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      ~ {Math.max(1, Math.ceil(previewText.length / 300))} min
                      read
                    </span>

                    <Link
                      to={`/posts/${post._id}`}
                      className="inline-flex items-center text-blue-600 font-semibold text-sm hover:underline"
                    >
                      Read more
                      <span className="ml-1 transition group-hover:translate-x-1">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;
