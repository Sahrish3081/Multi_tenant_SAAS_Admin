import { useState } from "react";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
export default function LoginCard() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message , setMessage]=useState("");
  const navigate = useNavigate();
  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  async function handleSubmit(event) {
    event.preventDefault();
      if (!formData.email || !formData.password) {
      setMessage("All fields are required.");
      return;
    }
      
    try {
         const response= await fetch("http://localhost:3000/api/v1/auth/login",
           {
             method:"POST",
             headers:{
                "Content-Type":"application/json",
             },
             body:JSON.stringify(formData),
           });
           const data=await response.json();
        
   if (!response.ok) {
  if (data.errors) {
    const errorMessages = Object.values(data.errors).flat();

    setMessage(errorMessages.join(" "));
  } else if (data.message) {
    setMessage(data.message);
  } else {
    setMessage("Login failed. Please try again.");
  }

  return;
   }
   /* Save JWT token for valid user */
     localStorage.setItem("token", data.token);
    setMessage("Login successful!");
    navigate("/dashboard");
         // Optional: clear form after successful signup
      setFormData({
       email: "",
       password: ""});
    } catch (error) {

     setMessage("Login error:", error);
    }
  }

  return (
    <div className="w-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
      <p className="text-[#7d7f82] mt-1 mb-1.5">WELCOME BACK</p>
      <h1 className="font-extrabold text-3xl">Sign in to Roll Base</h1>
      <p className="text-[#7d7f82] mt-1 mb-1.5">Pick up where you left off.</p>
      <form onSubmit={handleSubmit}>
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
        {/* Button */}
        <button type="submit" className="btn-primary mt-2 mb-4 w-full">
         Login
        </button>
         {/* Message */}
        <div className="mb-4 text-center text-sm text-[var(--color-text-secondary)]">
          <p>{message}</p>
        </div>
 {/* Signup */}
        <p className="text-center text-[var(--color-text-secondary)]">
          Don't have a account?{" "}
          <a
            href="/signup"
            className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] hover:underline"
          >
            Signup
          </a>
        </p>
      </form>
    </div>
  );
}
