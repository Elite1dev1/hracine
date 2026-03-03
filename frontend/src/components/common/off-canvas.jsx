import Link from 'next/link';
import Image from 'next/image';
// internal
import { CloseTwo } from '@/svg';
import logo from '@assets/img/logo/favicon.png';
import MobileDrawerMenu from './mobile-drawer-menu';

const OffCanvas = ({ isOffCanvasOpen, setIsCanvasOpen, categoryType = "electronics" }) => {
  return (
    <>
      <div className={`offcanvas__area offcanvas__radius offcanvas__mobile-redesign ${isOffCanvasOpen ? "offcanvas-opened" : ""}`}>
        <div className="offcanvas__wrapper">
          <div className="offcanvas__close">
            <button
              type="button"
              onClick={() => setIsCanvasOpen(false)}
              className="offcanvas__close-btn offcanvas-close-btn"
              aria-label="Close menu"
            >
              <CloseTwo />
            </button>
          </div>
          <div className="offcanvas__content">
            <div className="offcanvas__top offcanvas__top--compact d-flex justify-content-between align-items-center">
              <div className="offcanvas__logo logo">
                <Link href="/">
                  <Image
                    src={logo}
                    alt="logo"
                    width={100}
                    height={100}
                    style={{ width: 'auto', height: 'auto', maxWidth: '100px', maxHeight: '100px' }}
                    className="d-none d-sm-block"
                  />
                  <Image
                    src={logo}
                    alt="logo"
                    width={50}
                    height={50}
                    style={{ width: 'auto', height: 'auto', maxWidth: '50px', maxHeight: '50px' }}
                    className="d-block d-sm-none"
                  />
                </Link>
              </div>
            </div>
            <div className="offcanvas__nav d-lg-none">
              <MobileDrawerMenu />
            </div>
          </div>
          <div className="offcanvas__bottom">
            <div className="offcanvas__btn">
              <Link href="/contact" className="offcanvas__contact-btn-redesign">Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
      {/* body overlay start */}
      <div onClick={() => setIsCanvasOpen(false)} className={`body-overlay ${isOffCanvasOpen ? 'opened' : ''}`}></div>
      {/* body overlay end */}
    </>
  );
};

export default OffCanvas;