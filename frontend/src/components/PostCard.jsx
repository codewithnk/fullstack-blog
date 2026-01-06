import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow transition">
      <h2 className="text-xl font-semibold mb-2">{post.title}</h2>

      <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>

      <div className="flex justify-between text-sm text-gray-500">
        <span>By {post.author?.name}</span>
        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>

      <Link
        to={`/posts/${post._id}`}
        className="inline-block mt-4 text-blue-600 font-medium"
      >
        Read more →
      </Link>
    </div>
  );
};

export default PostCard;
