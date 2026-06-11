import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const schema = zod.object({
    name: zod.string().min(3, 'It must not be less than 3 letter').max(15, 'It should not be more than 15 characters'),
    username: zod.string().min(3, 'It must not be less than 3 letter').max(15, 'It should not be more than 15 characters'),
    email: zod.string().email('Invalid email address'),
    dateOfBirth: zod.coerce.date().refine((value) => {
        return new Date().getFullYear() - value.getFullYear() >= 18;
    }, 'age must be 18 or above'),
    gender: zod.enum(['male', 'female'], { errorMap: () => ({ message: 'gender invalid' }) }),
    password: zod.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).+$/, "Must include Uppercase, Lowercase, Number and Symbol"),
    rePassword: zod.string()
}).refine((data) => data.password === data.rePassword, {
    message: "passwords don't match",
    path: ["rePassword"],
});

export default function Register() {
    const [apiResponse, setApiResponse] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            name: "", username: "", email: "", dateOfBirth: "", gender: "", password: "", rePassword: ""
        }
    });

    async function myHandelSubmit(data) {
        setIsLoading(true);
        setApiResponse(null);
        try {
            await axios.post('https://route-posts.routemisr.com/users/signup', data);
            setApiResponse("Registration Successful! Redirecting...");
            setIsSuccess(true);
            setTimeout(() => { navigate('/login'); }, 3000);
        } catch (err) {
            setApiResponse(err.response?.data?.message || 'Registration Failed');
            setIsSuccess(false);
        } finally {
            setIsLoading(false);
        }
    }

    // Function to handle dynamic error classes
    const getInputClass = (errorName) => {
        return `w-full px-4 py-2 text-xl rounded-xl border outline-none transition-all duration-300 ${
            errorName 
            ? 'bg-red-900/40 border-red-500 text-red-100 placeholder-red-300 focus:ring-red-500' 
            : 'bg-white/10 border-white/20 text-white focus:ring-blue-500 focus:border-blue-500'
        } focus:ring-2`;
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center py-10 bg-blue-600">
            <h1 className='text-center text-5xl animate-pulse text-amber-50 mb-10 font-bold drop-shadow-lg'>Register Now</h1>

            <div className="w-full lg:w-1/2 mx-auto p-8 bg-white/5 backdrop-blur-sm rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10">

                
                {apiResponse && (
                    <div className={`p-4 mb-6 text-2xl font-bold text-center rounded-xl shadow-inner animate-bounce
                        ${isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {isSuccess ? '✅' : '❌'} {apiResponse}
                    </div>
                )}

                <form onSubmit={handleSubmit(myHandelSubmit)}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Name */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block mb-1 text-xl text-white cursor-pointer font-medium">Name</label>
                            <input id="name" type="text" className={getInputClass(errors.name)} {...register('name')} />
                            {errors.name && <p className='text-red-400 mt-1 text-lg font-semibold'>⚠ {errors.name.message}</p>}
                        </div>

                        {/* Username */}
                        <div className="mb-4">
                            <label htmlFor="username" className="block mb-1 text-xl text-white cursor-pointer font-medium">Username</label>
                            <input id="username" type="text" className={getInputClass(errors.username)} {...register('username')} />
                            {errors.username && <p className='text-red-400 mt-1 text-lg font-semibold'>⚠ {errors.username.message}</p>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-xl text-white cursor-pointer font-medium">Email</label>
                        <input id="email" type="email" className={getInputClass(errors.email)} {...register('email')} />
                        {errors.email && <p className='text-red-400 mt-1 text-lg font-semibold'>⚠ {errors.email.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Password */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block mb-1 text-xl text-white cursor-pointer font-medium">Password</label>
                            <input id="password" type="password" className={getInputClass(errors.password)} {...register('password')} />
                            {errors.password && <p className='text-red-400 mt-1 text-lg font-semibold'>⚠ {errors.password.message}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-4">
                            <label htmlFor="rePassword" className="block mb-1 text-xl text-white cursor-pointer font-medium">Confirm Password</label>
                            <input id="rePassword" type="password" className={getInputClass(errors.rePassword)} {...register('rePassword')} />
                            {errors.rePassword && <p className='text-red-400 mt-1 text-lg font-semibold'>⚠ {errors.rePassword.message}</p>}
                        </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="mb-4">
                        <label htmlFor="dateOfBirth" className="block mb-1 text-xl text-white cursor-pointer font-medium">Date of Birth</label>
                        <input id="dateOfBirth" type="date" className={getInputClass(errors.dateOfBirth)} {...register('dateOfBirth')} />
                        {errors.dateOfBirth && <p className='text-red-400 mt-1 text-lg font-semibold'>⚠ {errors.dateOfBirth.message}</p>}
                    </div>

                    {/* Gender */}
                    <div className="mb-6">
                        <label className="block mb-2 text-2xl text-white font-medium">Gender</label>
                        <div className="flex gap-8">
                            <label className="flex items-center gap-3 cursor-pointer text-xl text-white hover:text-blue-400 transition">
                                <input type="radio" value="male" className="w-5 h-5" {...register("gender")} /> Male
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer text-xl text-white hover:text-pink-400 transition">
                                <input type="radio" value="female" className="w-5 h-5" {...register("gender")} /> Female
                            </label>
                        </div>
                        {errors.gender && <p className='text-red-400 mt-1 text-lg font-semibold'>⚠ {errors.gender.message}</p>}
                    </div>

                    <button 
                        disabled={isLoading} 
                        type='submit' 
                        className="w-full cursor-pointer mt-4 flex justify-center items-center gap-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white py-4 rounded-2xl text-2xl font-bold transition duration-300 shadow-xl"
                    >
                        {isLoading ? <div className="w-7 h-7 border-4 border-white border-t-transparent rounded-full animate-spin"></div> : "Register "}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-white text-xl">
                            Have an account?  
                            <Link to="/login" className="text-green-400 hover:text-green-300 font-bold ml-2 underline transition-colors">
                                Login Now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}