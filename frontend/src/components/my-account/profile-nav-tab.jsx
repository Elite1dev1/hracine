import React, { useState } from "react";

function SingleNav({ active = false, id, title, icon, onClick, idPrefix = "nav" }) {
  return (
    <button
      className={`nav-link ${active ? "active" : ""}`}
      id={`${idPrefix}-${id}-tab`}
      data-bs-toggle="tab"
      data-bs-target={`#nav-${id}`}
      type="button"
      role="tab"
      aria-controls={id}
      aria-selected={active ? "true" : "false"}
      onClick={onClick}
    >
      <span>
        <i className={icon}></i>
      </span>
      {title}
    </button>
  );
}

const ProfileNavTab = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav>
      <button
        type="button"
        className="profile__mobile-menu-toggle d-flex d-md-none"
        onClick={() => setIsMobileMenuOpen((prev) => !prev)}
        aria-expanded={isMobileMenuOpen}
        aria-controls="profile-tab-mobile"
      >
        <span>My Account</span>
        <span className={`profile__mobile-menu-chevron ${isMobileMenuOpen ? "is-open" : ""}`}>
          ▼
        </span>
      </button>

      <div className="nav nav-tabs tp-tab-menu flex-column d-none d-md-flex" id="profile-tab" role="tablist">
        <SingleNav active={true} id="profile" title="Profile" icon="fa-regular fa-user-pen" />
        <SingleNav id="information" title="Information" icon="fa-regular fa-circle-info" />
        <SingleNav id="order" title="My Orders" icon="fa-light fa-clipboard-list-check" />
        <SingleNav id="password" title="Change Password" icon="fa-regular fa-lock" />
      </div>

      <div className={`profile__mobile-menu-wrap d-md-none ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="nav nav-tabs tp-tab-menu flex-column" id="profile-tab-mobile" role="tablist">
          <SingleNav
            active={true}
            id="profile"
            title="Profile"
            icon="fa-regular fa-user-pen"
            onClick={handleMobileNavClick}
            idPrefix="nav-mobile"
          />
          <SingleNav
            id="information"
            title="Information"
            icon="fa-regular fa-circle-info"
            onClick={handleMobileNavClick}
            idPrefix="nav-mobile"
          />
          <SingleNav
            id="order"
            title="My Orders"
            icon="fa-light fa-clipboard-list-check"
            onClick={handleMobileNavClick}
            idPrefix="nav-mobile"
          />
          <SingleNav
            id="password"
            title="Change Password"
            icon="fa-regular fa-lock"
            onClick={handleMobileNavClick}
            idPrefix="nav-mobile"
          />
        </div>
      </div>
    </nav>
  );
};

export default ProfileNavTab;
