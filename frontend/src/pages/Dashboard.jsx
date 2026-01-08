import { Link } from "react-router-dom";
import {
  useGetMyPostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../features/posts/postsApi";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { data, isLoading } = useGetMyPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const { user } = useSelector((state) => state.auth);

  const posts = data?.posts || [];

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    await deletePost(id).unwrap();
    toast.success("Post deleted");
  };

  const toggleStatus = async (post) => {
    await updatePost({
      id: post._id,
      body: {
        status: post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
      },
    }).unwrap();

    toast.success("Status updated");
  };

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>

        {user?.role !== "USER" && (
          <Link
            to="/create-post"
            className="bg-black text-white px-4 py-2 rounded"
          >
            New Post
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border p-4 mb-4 rounded">
            <h2 className="font-semibold">{post.title}</h2>

            <p className="text-sm text-gray-500">{post.status}</p>

            <div className="flex gap-4 mt-3">
              {user.role === "ADMIN" && (
                <button
                  onClick={() => toggleStatus(post)}
                  className="text-purple-600"
                >
                  {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                </button>
              )}

              <Link to={`/edit-post/${post._id}`}>Edit</Link>

              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Dashboard;
