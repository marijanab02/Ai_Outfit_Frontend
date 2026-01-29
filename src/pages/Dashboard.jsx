import React from "react";
import { Link } from "react-router-dom";
import "./Dashboard.css";

import logoImg from "../assets/logo.jpeg";
import heroImg from "../assets/pozadina.jpeg";

function Dashboard() {
  return (
    <div className="dash">
      <header className="dash-header">
        <div className="dash-brand">
          <div className="dash-logo">
            <img src={logoImg} alt="Clueless Wardrobe logo" />
          </div>
          <div className="dash-brandName">Clueless Wardrobe</div>
        </div>

        <nav className="dash-nav">
          <Link to="/login" className="dash-navBtn">
            Login
          </Link>
          <Link to="/register" className="dash-navBtn outline">
            Registracija
          </Link>
        </nav>
      </header>

      <main
        className="dash-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
      >
        <div className="dash-overlay" />

        <div className="dash-heroInner">
          <div className="dash-heroContent">
            <h1 className="dash-title">
              Discover Your Perfect Style <br />
              with Clueless Wardrobe
            </h1>

            <div className="dash-actions">
              <button className="dash-btn">Dodaj odjevni predmet</button>
              <button className="dash-btn ghost">Moj ormar</button>
            </div>
          </div>
        </div>
      </main>

      <footer className="dash-footer">
        <div className="dash-footerInner">
          <span>Clueless Wardrobe</span>
          <span className="dot">•</span>
          <span>Organize. Discover. Style.</span>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
