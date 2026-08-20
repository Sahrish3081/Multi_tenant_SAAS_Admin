import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setMessage("Verification token is required.");
      return;
    }

    async function verifyEmail() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/auth/verify-email?token=${encodeURIComponent(token)}`
        );

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || "Email verification failed.");
          return;
        }

        setMessage("Email verified successfully!");

        // After successful verification
        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } catch (error) {
        console.error("Verification error:", error);
        setMessage("Something went wrong. Please try again.");
      }
    }

    verifyEmail();
  }, [searchParams, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="rounded-xl border p-8 text-center">
        <h1 className="mb-4 text-2xl font-bold">
          Email Verification
        </h1>

        <p>{message}</p>
      </div>
    </div>
  );
}