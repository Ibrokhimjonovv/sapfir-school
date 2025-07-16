"use client"

import { AccessContext } from '@/contexts/contexts';
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'

const Logout = () => {
    const { setProfileData, setProfileLoading } = useContext(AccessContext)
    const nav = useRouter()
    const handleLogout = () => {
        localStorage.removeItem("sapfirAccess");
        localStorage.removeItem("sapfirRefresh");
        localStorage.removeItem("sapfirType");

        setProfileData(null);
        setProfileLoading(false);

        window.location.href = "/";
        // try {
        //     nav.push("/");
        // } catch (e) {
        //     // Fallback to hard navigation if router fails
        // }
    };
    return (
        <button
            onClick={handleLogout}
        >
            Tizimdan chiqish
        </button>
    )
}

export default Logout