import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('user@gmail.com');
  const [password, setPassword] = useState<string>('test123');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch('https://ecommerce-backend-fawn-eight.vercel.app/api/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      const token = await response.text();
      localStorage.setItem('token', token);
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'An error occurred during login');
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="bgimg min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#B88E2F]">Login</h2>
        </div>
        <form className="bgg py-8 rounded-md flex flex-col justify-center items-center"  onSubmit={handleSubmit}>
          <input type="hidden" name="remember" value="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className=" relative block w-[300px] px-3 py-2  placeholder-[#B88E2F] rounded-md focus:outline-none focus:ring-[#B88E2F] focus:border-[#B88E2F] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={handleEmailChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className=" relative block w-[300px] mt-10 mb-10 px-3 py-2  placeholder-[#B88E2F] rounded-md focus:outline-none focus:ring-[#B88E2F] focus:border-[#B88E2F] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
          </div>


          <div>
            <button
              type="submit"
              className="group relative w-[300px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#B88E2F] hover:bg-[#B88E2F] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B88E2F]"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
