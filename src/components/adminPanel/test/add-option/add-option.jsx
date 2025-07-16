'use client';

import React, { useEffect, useState, useContext } from "react";
import { AccessContext } from "@/contexts/contexts";
import { updateData } from "@/services/update";
import "./add-option.scss";

const AddOption = ({ isStatus, setIsStatus, initialData = null }) => {
  const [questions, setQuestions] = useState([]);
  const [formData, setFormData] = useState({
    question_id: "",
    text: "",
    is_correct: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detailsError, setDetailsError] = useState({});
  const { showNewNotification } = useContext(AccessContext);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/questions/`);
        const data = await res.json();
        setQuestions(data);
      } catch (error) {
        console.error("Savollarni olishda xatolik:", error);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        text: initialData.text || "",
        is_correct: initialData.is_correct || false,
        question_id: initialData.question?.id || "",
      });
    } else {
      setFormData({ question_id: "", text: "", is_correct: false });
    }
  }, [initialData]);

  const validateForm = () => {
    const errors = {};
    if (!formData.question_id) errors.question_id = "Savol tanlanishi kerak!";
    if (!formData.text.trim()) errors.text = "Variant matni kiritilishi kerak!";
    setDetailsError(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      if (initialData) {
        await updateData(
          `${process.env.NEXT_PUBLIC_TESTS_API}/test/options/${initialData.id}/`,
          formData
        );
        showNewNotification("Variant muvaffaqiyatli yangilandi!", "success");
      } else {
        const response = await fetch(`${process.env.NEXT_PUBLIC_TESTS_API}/test/options/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!response.ok) throw new Error("Variantni yaratishda xatolik!");
        showNewNotification("Variant muvaffaqiyatli qo‘shildi!", "success");
      }

      setFormData({ question_id: "", text: "", is_correct: false });
      setIsStatus(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      setError(err.message);
      showNewNotification("Jarayonda xatolik yuz berdi", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div>
      <div className={`add-option-shape ${isStatus ? 'active' : ''}`}></div>
      <div className={`add-option-content ${isStatus ? 'active' : ''}`}>
        <h3>{initialData ? "Variantni tahrirlash" : "Variant qo‘shish"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <label>Savol tanlang:</label>
            <select name="question_id" value={formData.question_id} onChange={handleChange}>
              <option value="">-- Savolni tanlang --</option>
              {questions.map(q => (
                <option key={q.id} value={q.id}>{q.text || q.name}</option>
              ))}
            </select>
            {detailsError.question_id && <span>{detailsError.question_id}</span>}
          </div>

          <div className="input-row">
            <label>Variant matni:</label>
            <input
              type="text"
              name="text"
              value={formData.text}
              onChange={handleChange}
              placeholder="Variant matnini kiriting"
            />
            {detailsError.text && <span>{detailsError.text}</span>}
          </div>

          <div className="input-row checkbox">
            <label>
              <input
                type="checkbox"
                name="is_correct"
                checked={formData.is_correct}
                onChange={handleChange}
              />
              To‘g‘ri javobmi?
            </label>
          </div>
          <div className="input-row submit-button">
            <button
              type="button"
              onClick={() => {
                setIsStatus(false);
                setError("");
                setDetailsError({});
                if (initialData) {
                  setFormData({
                    text: initialData.text || "",
                    is_correct: initialData.is_correct || false,
                    question_id: initialData.question?.id || "",
                  });
                } else {
                  setFormData({ question_id: "", text: "", is_correct: false });
                }
              }}
            >
              Bekor qilish
            </button>
            <button type="submit" disabled={loading}>
              {loading
                ? initialData
                  ? "Saqlanmoqda..."
                  : "Qo‘shilmoqda..."
                : initialData
                  ? "Saqlash"
                  : "Qo‘shish"}
            </button>
          </div>

          {error && <p style={{ color: 'red' }}>Xatolik: {error}</p>}
        </form>
      </div>
    </div>
  );
};

export default AddOption;
