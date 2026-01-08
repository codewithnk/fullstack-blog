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
      setTitle(post.title);
      setContent(post.content);
      setStatus(post.status);
    }
  }, [post]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updatePost({
        id,
        body: { title, content, status }, // ✅ FIXED
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
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />

        {/* Rich editor can be plugged back later */}
        {/* <ReactQuill value={content} onChange={setContent} /> */}

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Published</option>
        </select>

        <button
          type="submit"
          disabled={updating}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {updating ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
