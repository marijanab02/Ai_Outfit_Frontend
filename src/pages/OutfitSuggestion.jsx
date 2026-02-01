import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./OutfitSuggestion.css";

export default function OutfitSuggestion() {
  const [outfit, setOutfit] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const fetchOutfit = async () => {
    setLoading(true);
    setErr("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErr("Moraš biti prijavljen da dobiješ outfit");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:8000/api/outfit/suggest", {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      setOutfit(res.data);

      if (!res.data?.outfit || Object.keys(res.data.outfit).length === 0) {
        setErr("Nema dostupne kombinacije za ovu temperaturu");
      }

    } catch (e) {
      setOutfit(null);

      const apiMsg = e?.response?.data?.error;

      if (apiMsg === "Wardrobe is empty") {
        setErr("Tvoj ormar je prazan - dodaj par komada pa pokušaj opet");
      } 
      else if (apiMsg === "User location city not set") {
        setErr("Lokacija nije postavljena - dodaj grad u profilu");
      } 
      else {
        setErr(apiMsg || "Nema outfita / greška na servisu.");
      }

    } finally {
      setLoading(false);
    }
  };

  const temp = outfit?.temperature;
  const outfitObj = outfit?.outfit;

  return (
    <div className="os-page">
      <header className="os-header">
        <div className="os-brand">
          <div>
            <h2 className="os-title">Tvoj stil, bez razmišljanja</h2>
            <p className="os-sub">Jedan klik do gotovog outfita.</p>
          </div>
        </div>

        <nav className="os-nav">
          <Link to="/dashboard" className="os-link">Dashboard</Link>
          <Link to="/wardrobe" className="os-link outline">Moj ormar</Link>
        </nav>
      </header>

      <main className="os-main">
        <div className="os-actions">
          <button className="os-btn" onClick={fetchOutfit} disabled={loading}>
            {loading ? "Generating..." : "Predloži outfit"}
          </button>
        </div>

        {err && <div className="os-error">{err}</div>}

        {typeof temp !== "undefined" && temp !== null && (
          <div className="os-pill">🌡️ Trenutna temperatura: <b>{temp}°C</b></div>
        )}

        {outfitObj && (
          <div className="os-grid">
            {Object.entries(outfitObj).map(([key, item]) => (
              <div className="os-card" key={key}>
                <div className="os-cardHead">
                  <h4 className="os-cardTitle">{prettyKey(key)}</h4>
                </div>

                <div className="os-imgWrap">
                  <img
                    className="os-img"
                    src={resolveImage(item?.image_url)}
                    alt={key}
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://via.placeholder.com/420x300?text=No+Image";
                    }}
                  />
                </div>

                <div className="os-meta">
                  <div><b>Category:</b> {item?.category ?? "-"}</div>
                  {item?.color && (
                    <div className="os-colorRow">
                      <span><b>Color:</b> {item.color}</span>
                      <span
                        className="os-colorDot"
                        style={{ backgroundColor: item.color }}
                        title={item.color}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

    
        {!outfitObj && !loading && !err && (
          <div className="os-empty">
            Klikni za svoj outfit dana - bez razmišljanja 
          </div>
        )}

      </main>

      <footer className="os-footer">
        <span>Clueless Wardrobe</span>
        <span className="os-dot">•</span>
        <span>Organize. Discover. Style.</span>
      </footer>
    </div>
  );
}

function prettyKey(k) {
  return k.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveImage(imageUrl) {
  if (!imageUrl) return "";
  if (imageUrl.startsWith("http")) return imageUrl;
  return `http://127.0.0.1:8000/storage/${imageUrl}`;
}
