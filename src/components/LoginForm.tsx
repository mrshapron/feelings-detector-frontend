import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

/**
 * LoginForm component allows users to log in with their email and password.
 * It handles form state, validation, and authentication using Supabase.
 */
const LoginForm = () => {
  // State for email and password input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State to indicate if the login request is in progress
  const [isLoading, setIsLoading] = useState(false);
  // React Router navigation hook
  const navigate = useNavigate();

  /**
   * Handles form submission for login.
   * Validates input fields and authenticates with Supabase.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if both fields are filled
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Success",
          description: "You have successfully logged in",
        });
        // Redirect to dashboard on success
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 mx-auto glass-card rounded-lg animate-scale-in">
      {/* Logo or icon */}
      <div className="flex justify-center mb-6">
        <div className="h-12 w-12 bg-black dark:bg-white rounded-full"></div>
      </div>
      {/* Title */}
      <h1 className="text-2xl font-semibold text-center mb-8">EmotionAI</h1>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email input */}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Password input */}
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Submit button */}
        <Button
          type="submit"
          className="w-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
      </form>

      {/* Link to sign up */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Don&#39;t have an account?{" "}
        </span>
        <Link to="/signup" className="text-sm font-medium text-black dark:text-white hover:underline">
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;