import { useState } from "react"
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoginCard(){
   const [formData, setFormData]=useState({
    email:"",
    faPassport:""
   });
   const [showPassword ,setShowPassword]=useState('false');
 function handleChange(event){
   const {name ,value}=event.target;
   setFormData((prevData)=>({
    ...prevData ,
    [name]:value,
   }));
}
async function  handleSubmit(event){
 event.preventDefault();
 try {
    
    
 } catch (error) {
    
 }

}

    return (
    <div className="w-[420px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
    <p className="text-[#67696e] mt-1 mb-1.5">WELCOME BACK</p>
    <h1 className="font-extrabold text-3xl">Sign in to Roll Base</h1>
    <p className="text-[#67696e] mt-1 mb-1.5">Pick up where you left off.</p>
    <form action={handleSubmit}>
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
    
    </form>
    </div>
    )
}