import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoginMutation } from "../features/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../features/auth/authSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { loginSchema } from "../features/auth/authSchema";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input {...register("email")} className="input" placeholder="Email" />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input
          type="password"
          {...register("password")}
          className="input mt-3"
          placeholder="Password"
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <button disabled={isLoading} className="btn-primary mt-4 w-full">
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
