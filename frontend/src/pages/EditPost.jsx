import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetPostByIdQuery,
  useUpdatePostMutation,
} from "../features/posts/postsApi";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: post, isLoading } = useGetPostByIdQuery(id);
  const [updatePost, { isLoading: updating }] = useUpdatePostMutation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      setContent(post.content || "");
      setStatus(post.status || "DRAFT");
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePost({
        id,
        body: { title, content, status },
      }).unwrap();

      toast.success("Post updated successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  if (isLoading) {
    return <p className="mt-10 text-center">Loading post...</p>;
  }

  if (!post) {
    return (
      <p className="mt-10 text-center text-red-500">
        Post not found or access denied
      </p>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows="6"
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded px-3 py-2"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={updating}
          className="bg-black text-white px-6 py-2 rounded disabled:opacity-60"
        >
          {updating ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
