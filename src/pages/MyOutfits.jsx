import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./MyOutfits.css";

import logoImg from "../assets/logo.jpeg";

export default function MyOutfits() {
  const [outfits, setOutfits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    fetchOutfits();
  }, []);

  const fetchOutfits = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "http://127.0.0.1:8000/api/outfits",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      setOutfits(res.data);
    } catch (e) {
      setErr("Ne mogu dohvatiti outfite");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="outfitsPage">

   <header className="outfitsHeader">
  <div className="outfitsBrand">
    <div className="outfitsLogo">
      <img src={logoImg} alt="logo" />
    </div>

    <div>
      <div className="outfitsBrandName">Moje kombinacije</div>
      <div className="outfitsSub">
        Tvoj osobni lookbook
      </div>
    </div>
  </div>

  <Link to="/dashboard" className="outfitsBackBtn">
    ← Dashboard
  </Link>
</header>


      {/* CONTENT */}
      <main className="outfitsContent">
        {loading && <p className="outfitsInfo">Učitavanje...</p>}
        {err && <p className="outfitsError">{err}</p>}

        {!loading && !err && outfits.length === 0 && (
          <p className="outfitsInfo">Nema spremljenih outfita.</p>
        )}

        <div className="outfitsGrid">
          {outfits.map((outfit) => (
            <div key={outfit.id} className="outfitCard">
              <div className="outfitTop">
                <div>
                  <div className="outfitDate">
                    {new Date(outfit.created_at).toLocaleDateString()}
                  </div>

                  {outfit.weather_temp !== null && (
                    <div className="outfitTemp">
                      🌡 {outfit.weather_temp}°C
                    </div>
                  )}
                </div>
              </div>

              <div className="outfitItems">
                {outfit.items.map((item) => (
                  <div key={item.id} className="outfitItem">
                    <img
                      src={
                        item.image_url?.startsWith("http")
                          ? item.image_url
                          : `http://127.0.0.1:8000/storage/${item.image_url}`
                      }
                      alt={item.name}
                    />
                    <div className="outfitItemName">{item.name}</div>
                    <div className="outfitItemCat">{item.category}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
