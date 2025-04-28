import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import "./club.css";
import Footer from "../footer/Footer";
import logo from "../assets/Napoli-2020.png";

function TheClub() {
  return (
    <>
      {/* Club Header Section */}
      <div className="club-header">
        <div className="club-container">
          <img src={logo} alt="Napoli Logo" className="club-logo" />
          <h1 className="club-heading">Our Vision</h1>
          <p className="club-vision" aria-live="polite">
            To provide a first class football programme that will produce
            outstanding football players ready for local and international clubs.
            <br />
            To be an intermediary talent pool for professional clubs.
          </p>
          {/* WhatsApp Contact Link */}
          <a
            href="https://wa.me/+27737378310"
            aria-label="Contact us on WhatsApp"
          >
            <img
              id="whatsapp-icon"
              width="40"
              height="40"
              src="https://img.icons8.com/fluency/40/whatsapp.png"
              alt="WhatsApp icon"
            />
          </a>
        </div>

        {/* Owner Information Slider */}
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          className="ownerinfo-slider"
        >
          {/* Owner 1 */}
          <SwiperSlide>
            <div className="owner-container">
              <img
                className="owner-icon"
                width="75"
                height="75"
                src="https://img.icons8.com/pastel-glyph/75/e9ecef/user-male-circle.png"
                alt="user-male-circle"
              />
              <h2 className="owner-name">Mary Maseko</h2>
              <p className="owner-details">
                Mary Maseko is a co-owner and Chairperson of Napoli Sports Club. 
                She also attends to the day-to-day running of the club.
                <br />
                <br />
                Mary holds a B.Sc degree (Genetics and Botany) from the University
                of the Witwatersrand. She also holds a Post-graduate diploma in
                Human Resources Management from Wits Business School.
                <br />
                <br />
                Mary is passionate about nurturing talent and assisting talented
                young people to achieve their dreams. A passion she shares with her
                business partners.
              </p>
            </div>
          </SwiperSlide>

          {/* Owner 2 */}
          <SwiperSlide>
            <div className="owner-container">
              <img
                className="owner-icon"
                width="75"
                height="75"
                src="https://img.icons8.com/pastel-glyph/75/e9ecef/user-male-circle.png"
                alt="user-male-circle"
              />
              <h2 className="owner-name">Nancy Maseko</h2>
              <p className="owner-details">
                Nancy Maseko is a co-owner of Napoli Sports Club. She is
                responsible for the sponsorship program of the club. Nancy holds a
                B.A. degree in International Relations from Wheaton College,
                Massachusetts, USA.
                <br />
                <br />
                She also holds a BA Honours degree in Political Science and
                Comparative Studies from the University of Cape Town. Nancy is
                passionate about nurturing talent and assisting talented young
                people to achieve their dreams.
                <br />
                <br />
                A passion she shares with her business partners.
              </p>
            </div>
          </SwiperSlide>

          {/* Owner 3 */}
          <SwiperSlide>
            <div className="owner-container">
              <img
                className="owner-icon"
                width="75"
                height="75"
                src="https://img.icons8.com/pastel-glyph/75/e9ecef/user-male-circle.png"
                alt="user-male-circle"
              />
              <h2 className="owner-name">Karabo Khumalo</h2>
              <p className="owner-details">
                Karabo Khumalo is a co-owner of Napoli Sports Club. Karabo is a well
                seasoned ex player of the game we love and currently also serves as
                the Sporting Director of the club.
                <br />
                <br />
                Furthermore, he possesses a Bachelor of Commerce in Law degree and
                his love for the game in developing the next generation of football
                icons is where he excels. Moulding footballers while young enables
                the organisation to carefully manage their development correctly
                and allow them a high ceiling in this unforgiving industry.
                <br />
                <br />
                Paving this 5-10 year plan for these youngsters is what Mr.Khumalo
                delivers to an excellent level.
              </p>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Club Footer Section */}
      <div className="club-footer-container">
        <Footer />
      </div>
    </>
  );
}

export default TheClub;