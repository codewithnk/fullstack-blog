import { useParams, useNavigate } from "react-router-dom";
import { useGetPostByIdQuery } from "../features/posts/postsApi";
import { useSelector } from "react-redux";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  // Pass token if user is logged in
  const {
    data: post,
    isLoading,
    isError,
    error,
  } = useGetPostByIdQuery(id, {
    skip: false,
  });

  if (isLoading) {
    return <p className="text-center mt-10">Loading post...</p>;
  }

  if (isError) {
    if (error?.status === 401) {
      return (
        <p className="text-center mt-10">
          You must{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            login
          </span>{" "}
          to view this post.
        </p>
      );
    }

    if (error?.status === 403) {
      return (
        <p className="text-center mt-10">
          You are not allowed to view this post.
        </p>
      );
    }

    return <p className="text-center mt-10 text-red-600">Post not found</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
      <div className="text-sm text-gray-500 mb-6">
        <span>By {post.author?.name}</span> ·{" "}
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <article
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      <div className="mt-12 border-t pt-6 text-gray-500">
        Comments coming soon...
      </div>
    </div>
  );
};

export default PostDetail;
