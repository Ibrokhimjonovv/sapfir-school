'use client'
import React, { useContext, useEffect, useState } from "react";
import "./teacherProfile.scss";
import { AccessContext } from "@/contexts/contexts";
import Loading from "@/components/loading/layout";
import Waves from "@/components/rankCard/rank-card";
import LineChart from "@/components/rank-chart/chart";
import ScienceTest from "@/components/scienceTestResults/science-test";
import Logout from "@/components/logout/logout";
import Link from "next/link";
import TeacherClasses from "../teachersClasses/teachersClasses";

const sampleStats = {
  2022: [3, 4, 7, 2, 1, 5, 6, 2, 1, 4, 3, 2],
  2023: [5, 7, 8, 3, 2, 2, 9, 6, 5, 3, 2, 1],
  2024: [2, 20, 3],
};

const TeacherProfile = ({profileData}) => {
  const currentClassRank = 3;
  const currentSchoolRank = 2;
  const [selectedYear, setSelectedYear] = useState(2024);
  const [editProfileModal, setEditProfileModal] = useState(false);

  const toggleShowModal = () => {
    setEditProfileModal(!editProfileModal)
  }

  return (
    <section id="profile-section" >
      <div className={`edit-profile ${editProfileModal ? "active" : ""}`}>
        <div className={`edit-profile-content ${editProfileModal ? "active" : ""}`}>
          <p>Profildagi bironta ma'lumotni o'zgartirish uchun adminga murojat qiling!</p>
          <div className="edit-actions">
            <button onClick={toggleShowModal}>Tushundim</button>
          </div>
        </div>
      </div>
      <div className="welcome-text">
        <span>Xush kelibsiz, {profileData.first_name}</span>
        <div className="logout">
          <Logout />
        </div>
      </div>
      <div className="top-line">
        <div className="profile-card">
          <button onClick={toggleShowModal}>
            <img src="https://icons.veryicon.com/png/o/miscellaneous/linear-small-icon/edit-246.png" alt="" />
          </button>
          <img src="/assets/image/profile.jpg" alt="" />
          <div className="profile-card-texts">
            <p>{profileData.first_name} {profileData.last_name}</p>
            <p>{profileData.username}</p>
          </div>
        </div>
        <div className="add-student-card">
            <h2>Sizga bog'langan sinflar uchun o'quvchi qo'shishingiz mumkun</h2>
            <div className="btn-line">
                <Link href='/profile/add-student'>O'quvchi qo'shish</Link>
            </div>
        </div>
      </div>
        <div className="mid-line">
            <TeacherClasses />
        </div>
    </section>
  );
};

export default TeacherProfile;