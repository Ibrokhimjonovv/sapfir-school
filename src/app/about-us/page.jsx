import React from 'react';
import "./page.scss"

const AboutUs = () => {
  return (
    <div className='about-us'>
      <div className="about-texts">
        <h3>Biz haqimizda:</h3>
        <p className='title'>
          <span>Sapfir School</span> — bu nafaqat o‘quv maskani, balki har bir bola o‘zini o‘zgacha his qiladigan makon. Maktabimiz zamonaviy infratuzilma, ilg‘or metodika va tajribali o‘qituvchilar jamoasi bilan farzandingiz uchun eng yaxshi ta’limni taqdim etadi.
        </p>
        <p className='fontwe-500'>Ta’lim jarayonlarimiz 3 asosiy ustunlikka tayangan:</p>
        <ul>
          <li>1. <span>Sifatli bilim</span> — davlat va xalqaro dasturlarga asoslangan, chuqurlashtirilgan fanlar.</li>
          <li>2. <span>Tarbiya va qadriyatlar</span> — oila va jamiyat uchun foydali shaxs tarbiyasi.</li>
          <li>3. <span>Ijodiy rivojlanish</span> — musiqa, san’at, sport va IT yo‘nalishlari orqali bolalarning iste’dodini rivojlantirish.</li>
        </ul>
        <p className='last-words'><span>Maqsadimiz</span> — farzandingizni kelajakda mas’uliyatli, bilimli, va o‘z yo‘lini topgan inson sifatida tarbiyalash.</p>
      </div>
        <h3 className='school-conditions'>Makta b sharoitlari:</h3>
    </div>
  )
}

export default AboutUs