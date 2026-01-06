import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../features/auth/authApi";
import { logout } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const [logoutApi] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b bg-white">
      <Link to="/" className="text-2xl font-bold text-black">
        Blog
      </Link>
      {user ? (
        <div className="flex items-center gap-6">
          <Link
            to="/dashboard"
            className="font-medium hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
          {(user.role === "AUTHOR" || user.role === "ADMIN") && (
            <Link
              to="/create-post"
              className="font-medium hover:text-blue-600 transition"
            >
              Write
            </Link>
          )}
          <span className="text-gray-600 text-sm hidden md:block">
            {user.email}
          </span>

          <button
            onClick={handleLogout}
            className="text-red-600 font-medium hover:text-red-700 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-6">
          <Link
            to="/login"
            className="font-medium hover:text-blue-600 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="font-medium hover:text-blue-600 transition"
          >
            Register
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
