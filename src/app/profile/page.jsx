'use client'
import React, { useContext, useEffect, useState } from "react";
import "./layout.scss";
import { AccessContext } from "@/contexts/contexts";
import Loading from "@/components/loading/layout";
import Waves from "@/components/rankCard/rank-card";
import LineChart from "@/components/rank-chart/chart";
import ScienceTest from "@/components/scienceTestResults/science-test";
import NotFound from "../not-found";
import Logout from "@/components/logout/logout";

const sampleStats = {
  2022: [3, 4, 7, 2, 1, 5, 6, 2, 1, 4, 3, 2],
  2023: [5, 7, 8, 3, 2, 2, 9, 6, 5, 3, 2, 1],
  2024: [2, 20, 3], // faqat bir necha oyga
};

const Profile = () => {
  const currentClassRank = 3;
  const currentSchoolRank = 2;
  const [selectedYear, setSelectedYear] = useState(2024);
  const { profileData, profileLoading } = useContext(AccessContext);
  const [editProfileModal, setEditProfileModal] = useState(false);

  const toggleShowModal = () => {
    setEditProfileModal(!editProfileModal)
  }

  if (profileLoading) return <p>Yuklanmoqda...</p>
  if (!profileData) return <NotFound />

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
        <div className="class-rank-card">
          <Waves />
          <p className="c-r">Sinfdagi 30 ta o'quvchi ichidan</p>
          <p className="c-o">{currentClassRank}</p>
          <img
            className={`crown-img ${currentClassRank === 1 ? 'gold' :
              currentClassRank === 2 ? 'silver' :
                currentClassRank === 3 ? 'bronze' : ''
              }`}
            src={
              currentClassRank === 1 || currentClassRank === 2 || currentClassRank === 3
                ? '/assets/image/gold-crown.png'
                : '/assets/image/normal-crown.png'
            }
            alt="crown"
          />
          <p>O'rindasiz</p>
        </div>
        <div className="school-rank-card">
          <Waves />
          <p className="c-r">Maktabdagi 1-sinflar ichidan</p>
          <p className="c-o">{currentSchoolRank}</p>
          <img
            className={`crown-img school-crown ${currentClassRank === 1 ? 'gold' :
              currentSchoolRank === 2 ? 'silver' :
                currentSchoolRank === 3 ? 'bronze' : ''
              }`}
            src={
              currentSchoolRank === 1 || currentSchoolRank === 2 || currentSchoolRank === 3
                ? '/assets/image/school-crown.png'
                : '/assets/image/normal-crown.png'
            }
            alt="crown"
          />
          <p>O'rindasiz</p>
        </div>
      </div>
      <div className="middle-line">
        <div className="monthly-class-chart">
          <div className="line">
            <p>O'quvchini sinf ichidagi o'rni</p>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>

          <LineChart
            year={selectedYear}
            data={sampleStats[selectedYear] || []}
          />
        </div>
        <div className="monthly-school-chart">
          <div className="line">
            <p>O'quvchini maktab ichidagi o'rni</p>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              <option value={2022}>2022</option>
              <option value={2023}>2023</option>
              <option value={2024}>2024</option>
            </select>
          </div>

          <LineChart
            year={selectedYear}
            data={sampleStats[selectedYear] || []}
          />
        </div>
      </div>
      <div className="profile-sciences">
        <p className="title-p">Ishlangan testlar natijalari</p>
        <ScienceTest />
      </div>
    </section>
  );
};

export default Profile;