import { Link } from "react-router-dom";

const PostCard = ({ post, children }) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col justify-between">
      <div>
        <h2 className="text-lg font-semibold mb-2">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          By {post.author?.name} · {new Date(post.createdAt).toDateString()}
        </p>
        <p className="text-gray-700 line-clamp-3">
          {post.content.replace(/<[^>]+>/g, "")}
        </p>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
};

export default PostCard;
