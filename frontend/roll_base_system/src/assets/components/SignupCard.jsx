// Import the core React component
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useState } from "react";

export default function SignupCard() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState("");

  /* save the change values */
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
async function handleSubmit(event) {
  event.preventDefault();



  if (formData.password !== formData.confirmPassword) {
       setMessage("Password doesn't match.  ");
           return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/api/v1/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      }
    );

    const data = await response.json();

    console.log("Status:", response.status);
    console.log("Data:", data);

   if (!response.ok) {
  if (data.errors) {
    const errorMessages = Object.values(data.errors).flat();

    setMessage(errorMessages.join(" "));
  } else if (data.message) {
    setMessage(data.message);
  } else {
    setMessage("Signup failed. Please try again.");
  }

  return;
}

    setMessage("Account created successfully!");

    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  } catch (error) {
    console.log("Signup error:", error);
    setMessage("Something went wrong. Please try again.");
  }
}
  return (
    <div className="w-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <p className="mb-1 text-sm font-medium text-[var(--color-primary)]">
        Get started
      </p>

      <h1 className="mb-6 text-2xl font-bold text-[var(--color-text-primary)]">
        Create Account
      </h1>

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="mb-2 block font-medium text-[var(--color-text-primary)]">
            Name
          </label>

          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="mb-2 block font-medium text-[var(--color-text-primary)]">
            Email
          </label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4 relative">
          <label className="mb-2 block font-medium text-[var(--color-text-primary)]">
            Password
          </label>

          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-large mt-4 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          >
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {/* Confirm Password */}
        <div className="mb-4 relative">
          <label className="mb-2 block  text-[var(--color-text-primary)]">
            Confirm Password
          </label>

          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm your password"
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text-primary)] outline-none placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)]"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-large mt-4 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]"
          >
            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
          </button>
        </div>

        {/* Button */}
        <button type="submit" className="btn-primary mt-2 mb-4 w-full">
          Create Account
        </button>
        {/* Message */}
        <div className="mb-4 text-center text-sm text-[var(--color-text-secondary)]">
          <p>{message}</p>
        </div>

        {/* Login */}
        <p className="text-center text-[var(--color-text-secondary)]">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline"
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}
