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
      await logoutApi().unwrap(); // backend
      dispatch(logout()); // frontend
      toast.success("Logged out");
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 border-b">
      <Link to="/" className="font-bold">
        Blog
      </Link>

      {user ? (
        <div className="flex gap-4 items-center">
          <span>{user.email}</span>
          <button onClick={handleLogout} className="text-red-600 font-medium">
            Logout
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
