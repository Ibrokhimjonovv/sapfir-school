'use client'

import React, { useEffect, useState } from 'react';
import crown from "@/assets/crown.png";
import "./layout.scss";
import BalanceTopUp from '../top-up-balance/layout';
import Link from 'next/link';

const Rating = ({ userId, user, allUsers, balance }) => {

    const formattedNumber = new Intl.NumberFormat('de-DE').format(balance ? balance : 0);

    const classCount = 1

    return (
        <div id='rating'>
            <div className={`ichi`}>
                <p>{allUsers?.user_count || 0} ta {classCount}-sinflar ichidan</p>
                <p>
                    <img src={crown.src} alt="crown" />
                    <span>{userId?.rank || 0}</span>
                </p>
                <p>O'rindasiz</p>
            </div>
            {/* <div className={`line`}></div> */}
            {/* <div className={`ni`}>
                <p id='f-p'>Mening balansim</p>
                <div className={`results-cont`}>
                    <p>{formattedNumber} UZS</p>
                    <BalanceTopUp user={user}/>
                    <Link href="/top-up-balance">
                        Balansni oshirish
                    </Link>
                </div>
            </div> */}
        </div>
    );
};

export default Rating;