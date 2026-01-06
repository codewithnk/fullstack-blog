import { useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../features/posts/postsApi";

const PostDetail = () => {
  const { id } = useParams();
  const { data: post, isLoading, isError } = useGetPostByIdQuery(id);

  if (isLoading) return <p className="text-center mt-10">Loading post...</p>;
  if (isError || !post)
    return <p className="text-center mt-10">Post not found</p>;

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
