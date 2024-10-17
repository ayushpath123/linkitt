"use client";
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import signup from '@/assets/homepages/signup.png';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/LoadingSpinner'; // Import the LoadingSpinner

function Page() {
  const nameref = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null); // Reference for email input
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [inputotp, setInputotp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleSignup = async () => {
    setLoading(true);
    try {
      // Check if the user already exists by email
      const getUser = await axios.post('/api/checkuser', { email, name });
      if (getUser.data.exists) {
        toast.error(getUser.data.msg); // Show error message
        setTimeout(() => {
          router.push('/pages/verify/signup'); // Redirect after error
        }, 800);
        return;
      }

      // Check if the username is available
      const checkName = await axios.post('/api/checkname', { name });
      if (checkName.data.exists) {
        toast.error("Username not available!");
        nameref.current?.focus(); // Focus on the username input
        return;
      }

      // Send OTP
      const response = await axios.post('/api/otp/send', { email, password });
      localStorage.setItem("otp", response.data.otp);
      setShowOtp(true);
      toast.success('OTP sent successfully! Check your email.');
    } catch (error) {
      console.error('Error sending OTP:', error);
      toast.error('Error sending OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtp = async () => {
    try {
      if (localStorage.getItem("otp") === inputotp) {
        toast.success('OTP verified successfully!');
        localStorage.clear();
        
        // Attempt to create a new user
        const response = await axios.post('http://localhost:3000/api/newuser', { name, email, password });
        
        if (response.status === 201) {
          toast.success('Signup successful!');
          router.push('/pages/verify/signin');
        } else {
          const errorMessage = response.data.msg || 'An error occurred. Please try again.';
          toast.error(errorMessage);
        }
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      //@ts-ignore
      if (error.response) {
          //@ts-ignore
        const errorMessage = error.response.data?.msg || 'Server error. Please try again.';
        toast.error(errorMessage);
          //@ts-ignore
      } else if (error.request) {
        toast.error('No response received from the server. Please check your connection.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    }
  };
  
  return (
    <div className="grid grid-cols-1 justify-center md:grid-cols-2 min-h-screen bg-black">
      <Toaster position="top-right" reverseOrder={false} />
      {/* Left Side: Form Section */}
      <div className="flex flex-col m-4 md:m-16 gap-8">
        <div className='flex flex-row items-center gap-2 mt-4'>
          <h1 className='font-mono font-semibold text-xl text-custom-yellow'>LinkIt</h1>
        </div>
        <div className='flex flex-col gap-4 mt-32 justify-center items-center'>
          <h1 className='text-4xl text-custom-yellow md:text-6xl font-extrabold'>Join LinkIt</h1>
          <h2 className='text-lg text-custom-yellow'>Sign up for free!</h2>
        </div>
        <div className='flex flex-col gap-2 justify-center items-center'>
          <div className="flex flex-col space-y-4 w-full max-w-md">
            <input
              type="text"
              ref={nameref}
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out hover:border-gray-400"
              placeholder="Username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              ref={emailRef} // Add ref for email input
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out hover:border-gray-400"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out hover:border-gray-400"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={`bg-custom-yellow text-white p-3 rounded-lg hover:outline-gray-500 transition duration-300 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              onClick={handleSignup}
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : 'Sign Up'}
            </button>
          </div>

          {/* OTP Section */}
          {showOtp && (
            <div className="flex flex-col gap-2 w-full max-w-md mt-4">
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 ease-in-out hover:border-gray-400"
                placeholder="Enter OTP"
                value={inputotp}
                onChange={(e) => setInputotp(e.target.value)}
              />
              <button
                className="bg-custom-yellow text-white p-3 rounded-lg hover:outline-gray-400 transition duration-300 ease-in-out"
                onClick={handleOtp}
              >
                Verify OTP
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Right Side: Image Section */}
      <div className="hidden md:flex items-center justify-center h-full">
        <div className="relative w-full h-full">
          <Image
            src={signup}
            alt="Signup"
            className="object-cover w-full h-full"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
