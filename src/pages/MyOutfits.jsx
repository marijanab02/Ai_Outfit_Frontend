import { useEffect, useState } from "react";
import axios from "axios";

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

  if (loading) return <p>Učitavanje...</p>;
  if (err) return <p>{err}</p>;

  if (outfits.length === 0) {
    return <p>Nema spremljenih outfita.</p>;
  }

  return (
    <div>
      <h2>Moji prethodni outfiti</h2>

      {outfits.map((outfit) => (
        <div key={outfit.id} style={{ marginBottom: 30 }}>
          <h4>
            Datum: {new Date(outfit.created_at).toLocaleDateString()}
          </h4>

          {outfit.weather_temp !== null && (
            <p>Temperatura: {outfit.weather_temp}°C</p>
          )}

          <ul>
            {outfit.items.map((item) => (
              <li key={item.id}>
                {item.name} – {item.category}
                <img
                    src={
                        item.image_url?.startsWith("http")
                        ? item.image_url
                        : `http://127.0.0.1:8000/storage/${item.image_url}`
                    }
                    alt={item.name}
                    width="120"
                    />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
