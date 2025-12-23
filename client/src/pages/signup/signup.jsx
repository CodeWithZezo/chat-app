import { useState } from "react";
import { useAuthStore } from "../../zustand/auth";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { signup, isLoading } = useAuthStore();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    gender: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    // simple validation
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      await signup(formData);
      toast.success("Account created successfully 🎉");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">
            Create Account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="input input-bordered w-full"
              onChange={handleChange}
              required
            />

            {/* Gender */}
            <div className="flex gap-4">
              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  className="radio radio-primary"
                  onChange={handleChange}
                />
                Male
              </label>

              <label className="flex gap-2 items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  className="radio radio-primary"
                  onChange={handleChange}
                />
                Female
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign Up"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
