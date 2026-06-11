import React, { createContext, useState } from 'react';






// ده اللي بنستخدمه مع الـ useContext في المكونات التانية
export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {

    // تأكد من وضع اسم الكي بين علامات تنصيص 'tkn'
    const [token, setToken] = useState(    function(){

        return localStorage.getItem('tkn')
    }     );
    
    return (
        // لازم القوسين {{ }} عشان تبعت Object فيه القيمتين
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
}