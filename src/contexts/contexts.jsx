"use client";

import Notification from "@/components/notification/layout";
import { api } from "@/config";
import { createContext, useEffect, useState } from "react";

const AccessContext = createContext();

const AccessProvider = ({ children }) => {
    const [loginStat, setLoginStat] = useState(false);
    const [registerStat, setRegisterStat] = useState(false);

    useEffect(() => {
        if (loginStat === true || registerStat === true) {
            document.body.classList.add("over");
        } else {
            document.body.classList.remove("over");
        }
    }, [loginStat, registerStat]);

    const [profileLoading, setProfileLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            setProfileLoading(true);
            try {
                const token = localStorage.getItem("sapfirAccess");
                const userTypeLocalStorage = localStorage.getItem("sapfirType");
                const studentId = localStorage.getItem("sapfirUser");

                let response;

                if (userTypeLocalStorage === "user") {
                    // Agar oddiy user bo‘lsa: POST so‘rov
                    response = await fetch(`${process.env.NEXT_PUBLIC_STUDENT_CREATE}/students/get-student-data/`, {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ student_id: Number(studentId) }),
                    });
                } else {
                    // Agar admin bo‘lsa: GET so‘rov
                    response = await fetch(`${process.env.NEXT_PUBLIC_ADMIN_API}/supper_users/get-superuser-data/`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    });
                }

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Tarmoq xatosi: ${response.status} - ${errorText}`);
                }

                const data = await response.json();
                setProfileData(data.data);
            } catch (error) {
                console.error("Failed to fetch profile data:", error.message);
            } finally {
                setProfileLoading(false);
            }
        };

        fetchProfile();
    }, []);



    const [notification, setNotification] = useState(null);
    const [showNotification, setShowNotification] = useState(false);

    // ✅ Bildirishnomani ko‘rsatish funksiyasi
    const showNewNotification = (text, type, options = {}) => {
        const { persist = false, reloadAfter = false } = options;
        const newNotification = {
            text,
            type,
            timestamp: Date.now(),
            extendedLifetime: reloadAfter,
            shown: false // ⬅️ faqat bir marta ko‘rsatish uchun
        };

        setNotification(newNotification);
        setShowNotification(true);

        if (persist) {
            localStorage.setItem('pendingNotification', JSON.stringify(newNotification));
        }

        const timer = setTimeout(() => {
            setShowNotification(false);
            setTimeout(() => {
                setNotification(null);
                if (!reloadAfter) {
                    localStorage.removeItem('pendingNotification');
                }
            }, 300);
        }, 5000);

        if (reloadAfter) {
            setTimeout(() => {
                window.location.reload();
            }, 100);
        }

        return () => clearTimeout(timer);
    };

    // ✅ Faqat bir marta bildirishnoma chiqarish uchun
    useEffect(() => {
        const checkForNotifications = () => {
            const storedNotification = localStorage.getItem('pendingNotification');
            if (storedNotification) {
                const parsedNotification = JSON.parse(storedNotification);

                // Agar allaqachon ko‘rsatilgan bo‘lsa – chiqmasin
                if (parsedNotification.shown) return;

                const maxAge = parsedNotification.extendedLifetime ? 30000 : 10000;

                if (Date.now() - parsedNotification.timestamp < maxAge) {
                    setNotification(parsedNotification);
                    setShowNotification(true);

                    // Belgilaymiz: endi ko‘rsatilgan
                    parsedNotification.shown = true;
                    localStorage.setItem('pendingNotification', JSON.stringify(parsedNotification));

                    const remainingTime = Math.max(
                        1000,
                        maxAge - (Date.now() - parsedNotification.timestamp)
                    );

                    setTimeout(() => {
                        setShowNotification(false);
                        setTimeout(() => {
                            setNotification(null);
                            localStorage.removeItem('pendingNotification');
                        }, 300);
                    }, remainingTime);
                } else {
                    localStorage.removeItem('pendingNotification');
                }
            }
        };

        checkForNotifications();
        window.addEventListener('popstate', checkForNotifications);
        return () => window.removeEventListener('popstate', checkForNotifications);
    }, []);

    return (
        <AccessContext.Provider
            value={{
                loginStat,
                setLoginStat,
                registerStat,
                setRegisterStat,
                profileData,
                setProfileData,
                profileLoading,
                setProfileLoading,
                notification,
                showNewNotification
            }}
        >
            {children}
            <Notification
                isActive={showNotification}
                text={notification?.text}
                type={notification?.type}
                onClose={() => {
                    setShowNotification(false);
                    setNotification(null);
                }}
            />
        </AccessContext.Provider>
    );
};

export { AccessContext, AccessProvider };
