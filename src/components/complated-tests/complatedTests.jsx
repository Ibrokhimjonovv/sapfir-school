'use client'
import React from 'react';
import "./complatedTests.scss";

const tests = [
    {
        id: 1,
        testTitle: 'Kasrga oid testlar',
        totalQuestions: 30,
        correctAnswers: 10,
        incorrectAnswers: 10,
        unanswerdOPtions: 10,
        correctPercentage: 50,
        complatedDate: "16.06.2026, 17:49",
    },
    {
        id: 2,
        testTitle: 'Kasrga oid testlar',
        totalQuestions: 30,
        correctAnswers: 10,
        incorrectAnswers: 10,
        unanswerdOPtions: 10,
        correctPercentage: 50,
        complatedDate: "16.06.2026: 18:52",
    }
]

const ProfileScienceResult = () => {
    return (
        <div className='profile-science-result'>
            {
                tests.map((testItem, indx) => (
                    <div className="test-item" key={indx}>
                        <p><span>{testItem.complatedDate}</span> da yechilgan test natijalari</p>
                        <div className="test-item-details">
                            <div className="test-item-details-container">
                                <span>Test nomi:</span>
                                <p>{testItem.testTitle}</p>
                            </div>
                            <div className="test-item-details-container">
                                <span>Jami savollar soni:</span>
                                <p>{testItem.totalQuestions} ta</p>
                            </div>
                            <div className="test-item-details-container">
                                <span>To'g'ri javoblar soni:</span>
                                <p>{testItem.correctAnswers} ta</p>
                            </div>
                            <div className="test-item-details-container">
                                <span>Noto'g'ri javoblar:</span>
                                <p>{testItem.incorrectAnswers} ta</p>
                            </div>
                            <div className="test-item-details-container">
                                <span>Belgilanmagan javoblar:</span>
                                <p>{testItem.unanswerdOPtions} ta</p>
                            </div>
                            <div className="test-item-details-container">
                                <span>Umumiy natija (Foizda):</span>
                                <p>{testItem.correctPercentage}%</p>
                            </div>
                        </div>
                        <div className="divider-line"></div>
                    </div>
                ))
            }
        </div>
    )
}

export default ProfileScienceResult