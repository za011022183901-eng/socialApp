import React, { useState, useContext } from 'react'; // 1. ضفنا useContext هنا
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './../context/AuthContext';

export default function NavPar() {
    const [isOpen, setIsOpen] = useState(false);
    
    // 3. استخراج الـ token والـ setToken من الـ Context
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const closeMenu = () => setIsOpen(false);

    // 4. دالة تسجيل الخروج
    function logOut() {
        setToken(null); // مسح التوكن من الـ State
        localStorage.removeItem('tkn'); // مسحه من التخزين
        navigate('/login'); // توجيه المستخدم لصفحة اللوجين
    }

    return (
        <nav className="bg-slate-950 fixed w-full z-50 top-0 start-0 border-b border-slate-800 shadow-xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                
                {/* Logo */}
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-3xl font-extrabold whitespace-nowrap text-blue-600 tracking-tighter">
                        facebook
                    </span>
                </Link>

                {/* Mobile Menu Button */}
                <button 
                    onClick={() => setIsOpen(!isOpen)} 
                    type="button" 
                    className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-400 rounded-lg md:hidden hover:bg-slate-800 focus:outline-none"
                >
                    <span className="sr-only">Open main menu</span>
                    {isOpen ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/></svg>
                    )}
                </button>

                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:flex md:items-center md:justify-end md:flex-1 transition-all duration-300`}>
                    
                    <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 rtl:space-x-reverse mt-4 md:mt-0 border-t border-slate-800 md:border-0 pt-4 md:pt-0">
                        
                        {/* لو مفيش توكن اظهر Login و Register */}
                        {token === null ? (
                            <>
                                <Link 
                                    to="/login" 
                                    onClick={closeMenu}
                                    className="text-gray-300 hover:text-white px-4 py-2 transition-all"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    onClick={closeMenu}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition-all"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            /* لو فيه توكن اظهر Profile و Logout */
                            <>
                                <Link 
                                    to="/profile" 
                                    onClick={closeMenu}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 px-4 py-2 border border-slate-700 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                                    <span>Profile</span>
                                </Link>

                                <button 
                                    onClick={() => { logOut(); closeMenu(); }}
                                    className="text-red-500 cursor-pointer hover:text-red-400 font-bold px-4 py-2 transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        )}
                        
                    </div>
                </div>
            </div>
        </nav>
    );
}