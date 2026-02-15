import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

import logoImg from "../assets/logo.jpeg";
import heroImg from "../assets/pozadina.jpeg";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")); // pretpostavljam da tamo čuvaš login info
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token && !!user;
  
  const changeCity = async () => {
    const newCity = prompt("Unesi svoj grad:");

    if (!newCity) return; // ako je prazan, izlazi

    try {

      const response = await fetch(`http://localhost:8000/api/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          location_city: newCity
        })
      });

      if (!response.ok) throw new Error("Greška pri promjeni grada");

      alert("Grad je uspješno promijenjen!");
    } catch (error) {
      alert(error.message);
    }
  };
  const logout = async () => {
    try {
      await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
    } catch (e) {
      // čak i ako backend padne, frontend se mora očistiti
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };
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
          {!isLoggedIn ? (
            <>
              <Link to="/login" className="dash-navBtn">Login</Link>
              <Link to="/register" className="dash-navBtn outline">Registracija</Link>
            </>
          ) : (
            <button className="dash-navBtn outline" onClick={logout}>
              Logout
            </button>
          )}
        </nav>
      </header>

      <main className="dash-hero" style={{ backgroundImage: `url(${heroImg})` }}>
        <div className="dash-overlay" />

        <div className="dash-heroContent">
          <h1 className="dash-title">
            Discover Your Perfect Style <br />
            with Clueless Wardrobe
          </h1>

          <div className="dash-actions">
            <Link to="/wardrobe/add" className="dash-btn">
              Dodaj odjevni predmet
            </Link>

            <div className="dash-actions-row">
              <Link to="/outfit-suggestion" className="dash-btn ghost">
                Style Me
              </Link>

              <Link to="/wardrobe" className="dash-btn ghost">
                Moj ormar
              </Link>

              <Link to="/outfits" className="dash-btn ghost">
                Moje kombinacije
              </Link>
              <button className="dash-btn ghost" onClick={changeCity}>
                Promijeni grad
              </button>
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
