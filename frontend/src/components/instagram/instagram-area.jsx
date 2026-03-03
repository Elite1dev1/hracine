import React from 'react';
import Image from 'next/image';
// internal
import ins_1 from '@assets/img/instagram/instagram-1.jpg';
import ins_2 from '@assets/img/instagram/instagram-2.jpg';
import ins_3 from '@assets/img/instagram/instagram-3.jpg';
import ins_4 from '@assets/img/instagram/instagram-4.jpg';
import ins_5 from '@assets/img/instagram/instagram-5.jpg';

const INSTAGRAM_LINK = 'https://www.instagram.com/theroot.tribe?igsh=MWwyM2U0cWk5djF3bQ%3D%3D&utm_source=qr';

// instagram data
const instagram_data = [
  { id: 1, link: INSTAGRAM_LINK, img: ins_1 },
  { id: 2, link: INSTAGRAM_LINK, img: ins_2 },
  { id: 3, link: INSTAGRAM_LINK, img: ins_3 },
  { id: 4, link: INSTAGRAM_LINK, img: ins_4 },
  { id: 5, link: INSTAGRAM_LINK, img: ins_5 },
];

const InstagramArea = () => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 767.98px) {
          .tp-instagram-area.tp-instagram-mobile-limit .tp-instagram-col:nth-child(n+3) {
            display: none !important;
          }
        }
      `}} />
      <div className="tp-instagram-area tp-instagram-mobile-limit pb-70">
        <div className="container">
          <div className="row row-cols-lg-5 row-cols-md-3 row-cols-sm-2 row-cols-1">
            {instagram_data.map((item) => (
              <div key={item.id} className="col tp-instagram-col">
                <div className="tp-instagram-item p-relative z-index-1 fix mb-30 w-img">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                    <Image src={item.img} alt="instagram img" style={{ width: '100%', height: '100%' }} />
                  </a>
                  <div className="tp-instagram-icon">
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="popup-image">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InstagramArea;