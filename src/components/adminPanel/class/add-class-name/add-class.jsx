'use client';

import React, { useContext, useEffect, useState } from 'react';
import './add-class.scss';
import { AccessContext } from '@/contexts/contexts';
import { updateData } from '@/services/update';

const AddClassName = ({ isStatus, setIsStatus, initialData = null }) => {
    const [formData, setFormData] = useState({
        class_number: '',
        class_name: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [detailsError, setDetailsError] = useState({});
    const { showNewNotification } = useContext(AccessContext);

    const [classNumbers, setClassNumbers] = useState([]);

    useEffect(() => {
        const fetchClassNumbers = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/all-classes-number/`);
                const data = await res.json();
                setClassNumbers(data.data || []);
            } catch (err) {
                console.error("Sinf raqamlarini yuklashda xatolik:", err);
            }
        };
        fetchClassNumbers();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                class_number: initialData.class_number,
                class_name: initialData.class_name,
            });
        } else {
            setFormData({ class_number: '', class_name: '' });
        }
    }, [initialData]);

    const validateForm = () => {
        let errors = {};
        if (!formData.class_number) errors.class_number = "Sinf raqami tanlanishi kerak!";
        if (!formData.class_name.trim()) errors.class_name = "Sinf harfi kiritilishi kerak!";
        setDetailsError(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            if (initialData) {
                await updateData(
                    `${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/update/${initialData.id}/`,
                    formData
                );
                showNewNotification("Sinf muvaffaqiyatli tahrirlandi!", "success");
            } else {
                const response = await fetch(`${process.env.NEXT_PUBLIC_CLASSESS_API}/classes/create/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                if (!response.ok) throw new Error("Yaratishda xatolik!");
                showNewNotification("Sinf qo'shish muvaffaqiyatli amalga oshirildi!", "success");
            }

            setFormData({ class_number: '', class_name: '' });
            setIsStatus(false);
            window.location.reload();
        } catch (error) {
            setError(error.message);
            showNewNotification("Jarayon davomida xatolik yuz berdi", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <>
            <div className={`add-class-name-shape ${isStatus ? "active" : ""}`}></div>
            <div className={`add-class-content ${isStatus ? "active" : ""}`}>
                <h2>{initialData ? "Sinfni tahrirlash" : "Yangi sinf qo'shish"}</h2>
                <div className="add-class-details">
                    <form onSubmit={handleSubmit}>
                        <div className="input-row">
                            <select
                                name="class_number"
                                value={formData.class_number}
                                onChange={handleChange}
                                className={!formData.class_number ? "disabled" : ""}
                            >
                                <option value="">Sinf raqamini tanlang</option>
                                {classNumbers.map(item => (
                                    <option key={item.id} value={item.class_number}>
                                        {item.class_number}
                                    </option>
                                ))}
                            </select>
                            {detailsError.class_number && <span>{detailsError.class_number}</span>}
                        </div>
                        <div className="input-row">
                            <input
                                type="text"
                                name="class_name"
                                value={formData.class_name}
                                onChange={handleChange}
                                placeholder="Sinf harfini kiriting (masalan: A, B)"
                            />
                            {detailsError.class_name && <span>{detailsError.class_name}</span>}
                        </div>
                        <div className="input-row submit-button">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsStatus(false);
                                    setError(false);
                                    setDetailsError({});
                                    if (initialData) {
                                        setFormData({
                                            class_number: initialData.class_number,
                                            class_name: initialData.class_name,
                                        });
                                    } else {
                                        setFormData({ class_number: '', class_name: '' });
                                    }
                                }}
                            >
                                Bekor qilish
                            </button>
                            <button type="submit" disabled={loading}>
                                {loading
                                    ? initialData
                                        ? "Saqlanmoqda..."
                                        : "Qo'shilmoqda..."
                                    : initialData
                                    ? "Saqlash"
                                    : "Qo'shish"}
                            </button>
                        </div>
                    </form>
                </div>

                {error && <p style={{ color: 'red' }}>Xatolik: {error}</p>}
            </div>
        </>
    );
};

export default AddClassName;
