// 




import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export default function NavPar() {
    const [isOpen, setIsOpen] = useState(false); // منيو الموبايل
    const [isNotifOpen, setIsNotifOpen] = useState(false); // منيو الإشعارات
    
    const { token, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const closeMenu = () => {
        setIsOpen(false);
        setIsNotifOpen(false);
    };

    // دالة تسجيل الخروج
    function logOut() {
        setToken(null);
        localStorage.removeItem('tkn');
        navigate('/login');
    }

    // 1. جلب عدد الإشعارات غير المقروءة للـ Badge الاحمر
    const { data: unreadData } = useQuery({
        queryKey: ['unreadNotificationsCount'],
        queryFn: () => axios.get('https://route-posts.routemisr.com/notifications/unread-count', {
            headers: { token: localStorage.getItem('tkn') }
        }),
        enabled: !!token,
        refetchInterval: 15000 // فحص كل 15 ثانية
    });

    // 2. جلب قائمة الإشعارات الفعلية (تعمل فقط عندما يفتح المستخدم المنيو)
    const { data: notificationsData, isLoading: isLoadingNotifs } = useQuery({
        queryKey: ['allNotifications'],
        queryFn: () => axios.get('https://route-posts.routemisr.com/notifications', {
            headers: { token: localStorage.getItem('tkn') }
        }),
        enabled: !!token && isNotifOpen, // تشتغل فقط والمنيو مفتوح لتوفير الباقات والأداء
    });

    // 3. عملية "تعيين الكل كمقروء" عند الضغط على الزر السحري
    const markAllAsReadMutation = useMutation({
        mutationFn: () => axios.patch('https://route-posts.routemisr.com/notifications/mark-all-read', {}, {
            headers: { token: localStorage.getItem('tkn') }
        }),
        onSuccess: () => {
            // تحديث العداد والقائمة فوراً في الشاشة بدون ريفريش
            queryClient.invalidateQueries(['unreadNotificationsCount']);
            queryClient.invalidateQueries(['allNotifications']);
        }
    });

    const unreadCount = unreadData?.data?.unreadCount || 0;
    const notificationsList = notificationsData?.data?.notifications || [];

    return (
        <nav className="bg-slate-950 fixed w-full z-50 top-0 start-0 border-b border-slate-800 shadow-xl">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                
                {/* أيقونة Home */}
                <Link to="/" onClick={closeMenu} className="text-gray-300 hover:text-blue-500 transition-all">
                    <i className="fa-solid fa-house text-2xl"></i>
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
                    
                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 rtl:space-x-reverse mt-4 md:mt-0 border-t border-slate-800 md:border-0 pt-4 md:pt-0">
                        
                        {token === null ? (
                            <>
                                <Link to="/login" onClick={closeMenu} className="text-gray-300 hover:text-white px-4 py-2 transition-all">Login</Link>
                                <Link to="/register" onClick={closeMenu} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold transition-all">Register</Link>
                            </>
                        ) : (
                            <>
                                {/* 🔔 منطقة الجرس والمنيو المنسدل */}
                                <div className="relative">
                                    <button 
                                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                                        className="relative text-gray-300 hover:text-blue-400 p-2 transition-all focus:outline-none"
                                    >
                                        <i className="fa-solid fa-bell text-xl"></i>
                                        {unreadCount > 0 && (
                                            <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/3 -translate-y-1/3 bg-red-600 rounded-full min-w-[20px] h-[20px]">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {/* 📜 قائمة الإشعارات المنسدلة (Dropdown) */}
                                    {isNotifOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                                            {/* هيدر المنيو */}
                                            <div className="p-3 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                                                <span className="font-bold text-white text-sm">Notifications</span>
                                                {unreadCount > 0 && (
                                                    <button 
                                                        onClick={() => markAllAsReadMutation.mutate()}
                                                        className="text-xs text-blue-500 hover:text-blue-400 font-medium transition-all"
                                                    >
                                                        Mark all as read
                                                    </button>
                                                )}
                                            </div>

                                            {/* محتوى الإشعارات */}
                                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                                {isLoadingNotifs ? (
                                                    <div className="p-4 text-center text-gray-500 text-xs"><i className="fa-solid fa-spinner fa-spin mr-2"></i>Loading...</div>
                                                ) : notificationsList.length > 0 ? (
                                                    notificationsList.map((notif) => (
                                                        <div 
                                                            key={notif._id} 
                                                            className={`p-3 text-xs border-b border-slate-800/50 transition-all flex items-start space-x-3 ${notif.isRead ? 'text-gray-400 bg-transparent' : 'text-white bg-blue-600/10 font-semibold'}`}
                                                        >
                                                            {/* صورة مصغرة للشخص صاحب الإشعار إن وجدت */}
                                                            <img 
                                                                src={notif.creator?.photo || 'https://via.placeholder.com/40'} 
                                                                className="w-8 h-8 rounded-full object-cover border border-slate-700"
                                                                alt="" 
                                                            />
                                                            <div className="flex-1">
                                                                <p className="line-clamp-2">{notif.message || "New activity on your post"}</p>
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="p-6 text-center text-gray-500 text-xs">No notifications yet 🔔</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* بقية عناصر الناف بار */}
                                <Link 
                                    to="/profile" 
                                    onClick={closeMenu}
                                    className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 px-4 py-2 border border-slate-700 rounded-xl transition-all"
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