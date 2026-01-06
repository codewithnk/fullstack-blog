import { useState } from "react";
import { toast } from "react-toastify";
import {
  useGetAllUsersQuery,
  useUpdateUserRoleMutation,
  useToggleBlockUserMutation,
  useGetAllPostsAdminQuery,
} from "../features/admin/adminApi";
import { useUpdatePostMutation } from "../features/posts/postsApi";

const AdminPanel = () => {
  // Users
  const { data: users, isLoading: loadingUsers } = useGetAllUsersQuery();
  const [updateRole] = useUpdateUserRoleMutation();
  const [toggleBlock] = useToggleBlockUserMutation();

  // Posts
  const { data: posts, isLoading: loadingPosts } = useGetAllPostsAdminQuery();
  const [updatePost] = useUpdatePostMutation();

  const handleRoleChange = async (userId, role) => {
    try {
      await updateRole({ id: userId, role }).unwrap();
      toast.success("Role updated");
    } catch {
      toast.error("Failed to update role");
    }
  };

  const handleBlockToggle = async (userId) => {
    try {
      await toggleBlock(userId).unwrap();
      toast.success("User status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const togglePostStatus = async (post) => {
    try {
      await updatePost({
        id: post._id,
        formData: {
          status: post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED",
        },
      }).unwrap();
      toast.success("Post status updated");
    } catch {
      toast.error("Failed to update post status");
    }
  };

  if (loadingUsers || loadingPosts)
    return <p className="mt-10 text-center">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4 space-y-12">
      {/* USERS TABLE */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Role</th>
                <th className="px-4 py-2 text-left">Blocked</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t">
                  <td className="px-4 py-2">{user.name}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user._id, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="USER">User</option>
                      <option value="AUTHOR">Author</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleBlockToggle(user._id)}
                      className={`px-2 py-1 rounded ${
                        user.isBlocked
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.isBlocked ? "Blocked" : "Active"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* POSTS TABLE */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Author</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post._id} className="border-t">
                  <td className="px-4 py-2">{post.title}</td>
                  <td className="px-4 py-2">{post.author.name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded ${
                        post.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => togglePostStatus(post)}
                      className="text-purple-600 hover:underline text-sm"
                    >
                      {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
