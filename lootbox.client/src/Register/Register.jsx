import React, { useState } from "react";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword || !userName) {
      setError("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/account/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          confirmPassword,
          userName,
        }),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      alert("User registered successfully!");
      window.location.reload();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-white text-gray-800 hover:text-gray-900 hover:shadow-md px-4 py-2 rounded"
        >
          Register
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-red-500">{error}</div>}
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={{ "--foreground": "hsl(0, 0%, 10%)", color: "var(--foreground)" }}

              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          style={{ "--foreground": "hsl(0, 0%, 10%)", color: "var(--foreground)" }}

              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ "--foreground": "hsl(0, 0%, 10%)", color: "var(--foreground)" }}

              className="border p-2 rounded"
              required
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          style={{ "--foreground": "hsl(0, 0%, 10%)", color: "var(--foreground)" }}

              className="border p-2 rounded"
              required
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
