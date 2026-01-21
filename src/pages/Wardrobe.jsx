import { useEffect, useState } from "react";
import axios from "axios";

export default function Wardrobe() {
  const [wardrobe, setWardrobe] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWardrobe = async () => {
      try {
        await axios.get("http://localhost:8000/sanctum/csrf-cookie", {
          withCredentials: true,
        });

        const res = await axios.get("http://localhost:8000/api/wardrobe", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        });

        setWardrobe(res.data);
      } catch (err) {
        console.error(err);
        alert("Greška pri dohvaćanju ormara");
      } finally {
        setLoading(false);
      }
    };

    fetchWardrobe();
  }, []);
  
  if (loading) return <p>Učitavanje ormara...</p>;

  return (
    <div>
      <h1>Moj Ormar</h1>
      {Object.keys(wardrobe).length === 0 && <p>Ormar je prazan!</p>}

      {Object.entries(wardrobe).map(([category, items]) => (
        <div key={category} style={{ marginBottom: "2rem" }}>
          <h2>{category}</h2>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {items.map((item) => (
            <div
                key={item.id}
                style={{
                border: "1px solid #ccc",
                padding: "10px",
                borderRadius: "8px",
                width: "150px",
                textAlign: "center",
                position: "relative",
                }}
            >
                <img
                src={`http://localhost:8000/storage/${item.image_url}`}
                alt={item.name || item.category}
                style={{ width: "100%", height: "150px", objectFit: "cover" }}
                />
                <p>{item.name || item.category}</p>
                <div
                style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: item.color,
                    margin: "0 auto",
                    borderRadius: "50%",
                    border: "1px solid #000",
                }}
                ></div>

                {/* Gumb za brisanje */}
                <button
                onClick={async () => {
                    if (!window.confirm("Jeste li sigurni da želite obrisati ovaj predmet?")) return;

                    try {
                    await axios.delete(`http://localhost:8000/api/wardrobe/${item.id}`, {
                        headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    });

                    // ukloni item iz state-a
                    setWardrobe((prev) => ({
                        ...prev,
                        [category]: prev[category].filter((i) => i.id !== item.id),
                    }));
                    } catch (err) {
                    console.error(err);
                    alert("Greška pri brisanju");
                    }
                }}
                style={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    cursor: "pointer",
                }}
                >
                ✖
                </button>
            </div>
            ))}

          </div>
        </div>
      ))}
    </div>
  );
}
