import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegisterMutation } from "../features/auth/authApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h2 className="text-2xl font-bold mb-4">Create Account</h2>

        <input {...register("name")} placeholder="Name" className="input" />
        <p className="text-red-500 text-sm">{errors.name?.message}</p>

        <input
          {...register("email")}
          placeholder="Email"
          className="input mt-3"
        />
        <p className="text-red-500 text-sm">{errors.email?.message}</p>

        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="input mt-3"
        />
        <p className="text-red-500 text-sm">{errors.password?.message}</p>

        <button disabled={isLoading} className="btn-primary mt-4 w-full">
          {isLoading ? "Creating..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
