import React, { useState , useContext } from 'react';
import { useForm } from 'react-hook-form';
import * as zod from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './../context/AuthContext';


const schema = zod.object({
    email: zod.string().email('Invalid email address'),

    
password: zod.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#?!@$%^&*-]).+$/, "Must include Uppercase, Lowercase, Number and Symbol"),});

export default function Login() {


    const { token, setToken } = useContext(AuthContext);






    const [apiResponse, setApiResponse] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const { handleSubmit, register, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            email: "",
            password: "",
        }
    });

    async function myHandelSubmit(data) {
        setIsLoading(true);
        setApiResponse(null);
        try {
            const res = await axios.post('https://route-posts.routemisr.com/users/signin', data);
            setApiResponse("Login Successful");
            setIsSuccess(true);
             

               console.log(res);
               

            localStorage.setItem('tkn', res.data.data.token); // تأكد من مسار التوكن في الـ API الخاص بك

            setToken(res.data.data.token);
            navigate('/home');



            
        } catch (err) {

            console.log(err.response);
            
            
            setApiResponse(err.response?.data?.message || 'Login Failed');
            setIsSuccess(false);
            setTimeout(() => setApiResponse(null), 5000);


            
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-blue-700">
            <h1 className='text-center text-5xl animate-pulse text-amber-50 mb-10'>Login Now</h1>

            <div className="w-full lg:w-1/2 p-4 rounded-2xl shadow-2xl backdrop-blur-sm">
                
                {apiResponse && (
                    <div className={`p-4 mb-6 text-2xl font-bold text-center rounded-xl shadow-lg
                        ${isSuccess ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                        {isSuccess ? '✅' : '❌'} {apiResponse}
                    </div>
                )}

                <form onSubmit={handleSubmit(myHandelSubmit)}>
                    {/* Email */}
                    <div className="mb-4">
                        <label htmlFor="email" className="block mb-1 text-2xl text-white cursor-pointer font-medium">Email</label>
                        <input 
                            id="email" 
                            type="email" 
                            /* التعديل هنا: إضافة حدود حمراء في حالة وجود خطأ */
                            className={`w-full px-4 py-2 text-xl rounded-xl border bg-white/10 text-white focus:ring-2 outline-none transition-colors
                                ${errors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} 
                            {...register('email')} 
                        />
                        {errors.email && <p className='text-red-400 mt-2 text-xl'>⚠ {errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2 text-2xl mt-4 text-white cursor-pointer font-medium">Password</label>
                        <input 
                            id="password" 
                            type="password" 
                            /* التعديل هنا: إضافة حدود حمراء في حالة وجود خطأ */
                            className={`w-full px-4 py-2 text-xl rounded-xl border bg-white/10 text-white focus:ring-2 outline-none transition-colors
                                ${errors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}`} 
                            {...register('password')} 
                        />
                        {errors.password && <p className='text-red-400 mt-2 text-xl'>⚠ {errors.password.message}</p>}
                    </div>

                    <button 
                        disabled={isLoading} 
                        type='submit' 
                        className="w-full mt-8 flex justify-center items-center gap-3 cursor-pointer bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white py-3 rounded-xl text-2xl transition duration-200 shadow-lg"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Loading...</span>
                            </>
                        ) : "Login"}
                    </button>

                    <div className="mt-6 text-center">
                        <p className="text-white text-xl">
                            Don't have an account?  
                            <Link to="/register" className="text-green-400 hover:text-green-300 font-bold ml-2 underline transition-colors">
                                Register Now
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}



// tesdsadasstsa123456789@gmail.com