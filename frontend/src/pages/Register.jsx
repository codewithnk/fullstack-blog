import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterMutation } from "../features/auth/authApi";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { registerSchema } from "../features/auth/authSchema";

const Register = () => {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data).unwrap();
      toast.success("Registration successful");
      navigate("/login");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white p-12 rounded-lg shadow"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>

        <div className="mb-5">
          <input
            type="name"
            {...register("name")}
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            placeholder="Name"
            autoComplete="name"
          />

          <p className="text-red-500 text-sm mt-1.5">{errors.name?.message}</p>
        </div>

        <div className="mb-5">
          <input
            type="email"
            {...register("email")}
            placeholder="Email"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <p className="text-red-500 text-sm">{errors.email?.message}</p>
        </div>
        <div className="mb-5">
          <input
            type="password"
            {...register("password")}
            placeholder="Password"
            className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition "
          />
          <p className="text-red-500 text-sm">{errors.password?.message}</p>
        </div>

        <button
          disabled={isLoading}
          className="w-full bg-black text-white font-medium py-3.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {isLoading ? "Creating..." : "Register"}
        </button>
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
