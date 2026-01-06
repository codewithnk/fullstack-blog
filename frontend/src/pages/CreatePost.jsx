import { useState } from "react";
import { useCreatePostMutation } from "../features/posts/postsApi";
import { useNavigate } from "react-router-dom";
import RichEditor from "../components/editor/RichEditor";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [createPost] = useCreatePostMutation();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) formData.append("image", image);

    await createPost(formData).unwrap();
    navigate("/dashboard");
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

        <input type="file" onChange={(e) => setImage(e.target.files[0])} />

        <button className="bg-black text-white px-6 py-2 rounded">
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
