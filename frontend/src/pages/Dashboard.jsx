import { Link } from "react-router-dom";
import {
  useGetMyPostsQuery,
  useDeletePostMutation,
  useUpdatePostMutation,
} from "../features/posts/postsApi";
import { toast } from "react-toastify";

const Dashboard = () => {
  const { data, isLoading } = useGetMyPostsQuery();
  const [deletePost] = useDeletePostMutation();
  const [updatePost] = useUpdatePostMutation();

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;
    try {
      await deletePost(id).unwrap();
      toast.success("Post deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const toggleStatus = async (post) => {
    try {
      await updatePost({
        id: post._id,
        data: { status: post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" },
      }).unwrap();
      toast.success(
        post.status === "PUBLISHED" ? "Moved to Draft" : "Post Published"
      );
    } catch {
      toast.error("Status update failed");
    }
  };

  if (isLoading) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">My Posts</h1>
        <Link
          to="/create-post"
          className="bg-black text-white px-4 py-2 rounded"
        >
          New Post
        </Link>
      </div>

      {data.posts.length === 0 ? (
        <p>No posts yet</p>
      ) : (
        <div className="space-y-4">
          {data.posts.map((post) => (
            <div
              key={post._id}
              className="border p-4 flex justify-between items-center"
            >
              <div>
                <h2>{post.title}</h2>
                <span>{post.status}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toggleStatus(post)}>
                  Toggle Status
                </button>
                <Link to={`/edit-post/${post._id}`}>Edit</Link>
                <button onClick={() => handleDelete(post._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
