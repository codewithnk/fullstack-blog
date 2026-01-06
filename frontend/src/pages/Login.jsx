import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { loginSchema } from "../features/auth/authSchema";
// import { useEffect } from "react";
// import { useSelector } from "react-redux";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  // const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data).unwrap();
      dispatch(setCredentials(res.accessToken));
      toast.success("Login successful");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };
  // useEffect(() => {
  //   if (user) {
  //     navigate("/");
  //   }
  // }, [user, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <form
        className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

        <div className="mb-5">
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Email"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1.5">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="mb-8">
          <input
            type="password"
            {...register("password")}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Password"
            autoComplete="current-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1.5">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white font-medium py-3.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center mt-6 text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register here
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
