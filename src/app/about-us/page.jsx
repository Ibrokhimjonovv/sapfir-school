import React from 'react';
import './page.scss';

const SapfirBlog = () => {
  return (
    <div className="Sapfir-blog">
      <header className="blog-header">
        <div className="container">
          <h1 className="logo">Sapfir SCHOOL</h1>
          <p className="tagline">Sapfir - bu sizning muvaffaqiyatingiz kaliti</p>
        </div>
      </header>

      <main className="blog-main">
        <div className="container">
          <section className="about-section">
            <h2>Sapfir nima?</h2>
            <div className="content">
              <p>Sapfir - bu qimmatbaho tosh bo'lib, aql-idrok, haqiqat va ichki tinchlik ramzi hisoblanadi. Bizning Sapfir Schoolda bu konsepsiya har bir o'quvchining ichki qobiliyatlarini ochib berish va ularni rivojlantirish g'oyasiga asoslangan.</p>
              
              <p>Sapfirning sof ko'k rangi cheksizlik va kenglikni anglatadi, bu esa bizning o'quvchilarimizga doimo yangi bilimlar olish va o'zlarini rivojlantirish imkoniyatini beradi.</p>
            </div>
          </section>

          <section className="school-section">
            <h2>Sapfir School haqida</h2>
            <div className="content">
              <p>Sapfir School - bu an'anaviy ta'lim muassasalaridan farq qiluvchi innovatsion ta'lim markazi. Bizning maqsadimiz - nafaqat bilim berish, balki har bir talabaning individual qobiliyatlarini aniqlash va ularni rivojlantirish.</p>
              
              <h3>Bizning metodologiyamiz</h3>
              <p>Biz shaxsiylashtirilgan yondashuvni qo'llaymiz. Har bir o'quvchi uchun alohida dastur tuziladi, bu ularning qiziqishlari, qobiliyatlari va maqsadlariga mos keladi.</p>
              
              <h3>Bizning afzalliklarimiz</h3>
              <ul>
                <li>Malakali va tajribali o'qituvchilar</li>
                <li>Zamonaviy o'quv usullari</li>
                <li>Shaxsiy yondashuv</li>
                <li>Amaliyotga yo'naltirilgan darslar</li>
                <li>Qulab o'quv jadvali</li>
              </ul>
            </div>
          </section>

          <section className="programs-section">
            <h2>Ta'lim dasturlarimiz</h2>
            <div className="content">
              <div className="program-card">
                <h3>Boshlang'ich ta'lim</h3>
                <p>Yosh bolalar uchun asosiy bilim va ko'nikmalarni shakllantirish</p>
              </div>
              
              <div className="program-card">
                <h3>O'rta ta'lim</h3>
                <p>Maktab o'quvchilari uchun chuqurlashtirilgan dasturlar</p>
              </div>
              
              <div className="program-card">
                <h3>Kasbiy ta'lim</h3>
                <p>Turli kasblar bo'yicha malaka oshirish kurslari</p>
              </div>
            </div>
          </section>

          <section className="values-section">
            <h2>Bizning qadriyatlarimiz</h2>
            <div className="content">
              <div className="value-item">
                <h4>Sifat</h4>
                <p>Biz doimo eng yuqori sifatli ta'limni taqdim etishga intilamiz</p>
              </div>
              
              <div className="value-item">
                <h4>Innovatsiya</h4>
                <p>Yangi usullar va texnologiyalarni doimo qo'llaymiz</p>
              </div>
              
              <div className="value-item">
                <h4>Hamjamiyat</h4>
                <p>O'quvchilar, ota-onalar va o'qituvchilar hamjamiyatini quramiz</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SapfirBlog;