import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
  mode: 'login' | 'signup';
  onSubmit: (data: any) => Promise<any>;
};

const AuthForm: React.FC<Props> = ({ mode, onSubmit }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await onSubmit(form);

    // ✅ Store JWT after login/signup
    if (res?.data?.access_token) {
      localStorage.setItem('token', res.data.access_token);
      navigate('/homePage'); // redirect after login
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {mode === 'login' ? 'Welcome Back 👋' : 'Create Account 🚀'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <input
              name="name"
              placeholder="Name"
              onChange={handleChange}
              required
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          )}

          <input
            name="email"
            placeholder="Email"
            type="email"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            name="password"
            placeholder="Password"
            type="password"
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            {mode === 'login' ? 'Login' : 'Signup'}
          </button>
        </form>

        {/* ✅ Switch between login/signup */}
        <p className="text-center mt-4 text-sm">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
          <button
            onClick={() =>
              navigate(mode === 'login' ? '/signup' : '/')
            }
            className="ml-2 text-blue-500 hover:underline"
          >
            {mode === 'login' ? 'Signup' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;