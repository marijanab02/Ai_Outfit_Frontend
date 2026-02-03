import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Wardrobe.css";
import "./Dashboard.css";

import logoImg from "../assets/logo.jpeg";

export default function Wardrobe() {
  const [wardrobe, setWardrobe] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const didFetch = useRef(false);

  const fetchWardrobe = async () => {
    try {
      setHasError(false);
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setHasError(true);
        setWardrobe({});
        return;
      }

      const res = await axios.get("http://localhost:8000/api/wardrobe", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWardrobe(res.data || {});
    } catch (err) {
      console.error(err);
      setHasError(true);
      setWardrobe({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchWardrobe();

  }, []);

  const handleDelete = async (category, itemId) => {
    if (!window.confirm("Jeste li sigurni da želite obrisati ovaj predmet?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8000/api/wardrobe/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setWardrobe((prev) => ({
        ...prev,
        [category]: (prev[category] || []).filter((i) => i.id !== itemId),
      }));
    } catch (err) {
      console.error(err);
      setHasError(true);
    }
  };

  const isEmpty = !loading && !hasError && Object.keys(wardrobe).length === 0;

  return (
    <div className="uploadPage">
      <header className="uploadTop">
        <div className="uploadTopInner">
          <div className="uploadHeadLeft">
            <div className="dash-logo">
              <img src={logoImg} alt="logo" />
            </div>

            <div>
              <h1 className="uploadTitle">Moj ormar</h1>
              <p className="uploadSub">Pregled i organizacija odjevnih predmeta.</p>
            </div>
          </div>

          <div className="dash-nav">
            <Link to="/dashboard" className="dash-navBtn">Dashboard</Link>
            <Link to="/wardrobe/add" className="dash-navBtn outline">Dodaj</Link>
          </div>
        </div>
      </header>

      <main className="uploadMain">
        <div className="uploadCard">
          <div className="wInner">
            {loading ? <div className="wLoading">Učitavanje ormara...</div> : null}

            {!loading && (isEmpty || hasError) ? (
              <div className="wEmpty">
                <div className="wEmptyIcon">👗</div>

                <div className="wEmptyTitle">
                  {hasError ? "Ne mogu učitati ormar" : "Ormar je prazan"}
                </div>

                <div className="wEmptyText">
                  {hasError
                    ? "Probaj ponovno ili se ulogiraj pa pokušaj opet."
                    : "Dodaj prvi odjevni predmet da kreneš."}
                </div>

                <div className="wEmptyActions">
                  <Link to="/wardrobe/add" className="primaryBtnLink">
                    Dodaj odjevni predmet
                  </Link>

                  {hasError ? (
                    <>
                      <button className="primaryBtn small" onClick={fetchWardrobe}>
                        Pokušaj ponovno
                      </button>
                      <Link to="/login" className="ghostBtn">
                        Login
                      </Link>
                    </>
                  ) : null}
                </div>
              </div>
            ) : null}

            {!loading && !hasError && !isEmpty ? (
              <div className="wSections">
                {Object.entries(wardrobe).map(([category, items]) => (
                  <section key={category} className="wSection">
                    <div className="wSectionHead">
                      <h2 className="wSectionTitle">{category}</h2>
                      <div className="wSectionCount">{items.length} kom</div>
                    </div>

                    <div className="wGrid">
                      {items.map((item) => (
                        <article key={item.id} className="wItem">
                          <button
                            className="wDelete"
                            onClick={() => handleDelete(category, item.id)}
                            aria-label="Obriši"
                            title="Obriši"
                          >
                            ✖
                          </button>

                          <div className="wImg">
                            <img
                              src={`http://localhost:8000/storage/${item.image_url}`}
                              alt={item.name || item.category}
                              loading="lazy"
                            />
                          </div>

                          <div className="wBody">
                            <div className="wName">{item.name || item.category}</div>

                            <div className="wMeta">
                              <span className="wTag">{item.category}</span>
                              {item.season ? <span className="wTag">{item.season}</span> : null}
                            </div>

                            <div className="wColorRow">
                              <span className="wColorLabel">Boja</span>
                              <span
                                className="wColorDot"
                                style={{ backgroundColor: item.color || "#ddd" }}
                                title={item.color || ""}
                              />
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
