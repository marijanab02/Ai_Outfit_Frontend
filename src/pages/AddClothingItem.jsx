import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./AddClothingItem.css";
import "./Dashboard.css";

import logoImg from "../assets/logo.jpeg";

export default function AddClothingItem() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const previewUrl = image ? URL.createObjectURL(image) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    const token = localStorage.getItem("token");
    if (!token) {
      setErrMsg("Nisi prijavljena. Prvo se ulogiraj.");
      return;
    }

    if (!image) {
      setErrMsg("Molim odaberi sliku.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/wardrobe", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      });

      setImage(null);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const msg = err?.response?.data?.message || err?.response?.data?.error;

      if (status) setErrMsg(`${status}: ${msg || "Greška na serveru"}`);
      else setErrMsg("Ne mogu doći do servera.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="uploadPage">
      <header className="uploadTop">
        <div className="uploadTopInner">

          <div className="uploadHeadLeft">
            <div className="dash-logo">
              <img src={logoImg} alt="logo" />
            </div>

            <div>
              <h1 className="uploadTitle">Dodaj odjevni predmet</h1>
              <p className="uploadSub">Učitaj sliku i spremi u ormar.</p>
            </div>
          </div>

          <div className="dash-nav">
            <Link to="/dashboard" className="dash-navBtn">Natrag</Link>
            <Link to="/wardrobe" className="dash-navBtn outline">Moj ormar</Link>
          </div>

        </div>
      </header>

      <main className="uploadMain">
        <div className="uploadCard">
          <form onSubmit={handleSubmit} className="uploadForm">
            <label className="dropZone">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
              />

              {previewUrl ? (
                <div className="imagePreview">
                  <img src={previewUrl} alt="Odabrana slika" />
                  <div className="changeHint">Klikni za promjenu slike</div>
                </div>
              ) : (
                <div className="dropInner">
                  <div className="dropIcon">📸</div>
                  <div>
                    <div className="dropHeadline">Klikni i odaberi sliku</div>
                    <div className="dropHint">JPG/PNG</div>
                  </div>
                </div>
              )}
            </label>

            {errMsg ? <div className="errorBox">{errMsg}</div> : null}

            <button className="primaryBtn" disabled={loading}>
              {loading ? "Spremam..." : "Dodaj u ormar"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
