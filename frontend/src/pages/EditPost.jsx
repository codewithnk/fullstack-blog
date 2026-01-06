import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useGetMyPostsQuery,
  useUpdatePostMutation,
} from "../features/posts/postsApi";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: posts } = useGetMyPostsQuery();
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const postToEdit = posts?.find((p) => p._id === id);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setStatus(postToEdit.status);
    }
  }, [postToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updatePost({ id, postData: { title, content, status } }).unwrap();
      toast.success("Post updated");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.data?.message || "Update failed");
    }
  };

  if (!postToEdit) return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
        <ReactQuill theme="snow" value={content} onChange={setContent} />
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
          disabled={isLoading}
          className="bg-black text-white px-4 py-2 rounded"
        >
          {isLoading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
};

export default EditPost;
