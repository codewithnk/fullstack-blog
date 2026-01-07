import { useState } from "react";
import { useCreatePostMutation } from "../features/posts/postsApi";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import RichEditor from "../components/editor/RichEditor";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT"); // only admin can set PUBLISHED
  const [createPost] = useCreatePostMutation();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title || !content)
      return toast.error("Title and content are required");

    try {
      await createPost({ title, content, status }).unwrap();
      toast.success("Post created successfully");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create post");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Create Post</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <input
          type="text"
          placeholder="Post title"
          className="w-full border p-3 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <RichEditor value={content} onChange={setContent} />

        {/* Only admin can select status */}
        {user.role === "ADMIN" && (
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border px-2 py-1 rounded"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        )}

        <button className="bg-black text-white px-6 py-2 rounded">
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
