import { useState, useEffect } from "react";
import RichEditor from "../editor/RichEditor";

const PostForm = ({ initialData, onSubmit, submitText }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("DRAFT");
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setContent(initialData.content || "");
      setStatus(initialData.status || "DRAFT");
    }
  }, [initialData]);

  const submitHandler = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("status", status);
    if (image) formData.append("image", image);

    onSubmit(formData);
  };

  return (
    <form onSubmit={submitHandler} className="space-y-4">
      <input
        type="text"
        placeholder="Post title"
        className="w-full border p-3 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED">Published</option>
      </select>

      <RichEditor value={content} onChange={setContent} />

      <input type="file" onChange={(e) => setImage(e.target.files[0])} />

      <button className="bg-black text-white px-6 py-2 rounded">
        {submitText}
      </button>
    </form>
  );
};

export default PostForm;
