import { useEffect, useState } from "react";
import axios from "axios";

export default function OutfitSuggestion() {
  const [outfit, setOutfit] = useState(null);

  const fetchOutfit = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/outfit/suggest",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setOutfit(res.data);
    } catch {
      alert("Nema outfita");
    }
  };

  return (
    <div>
      <h1>AI Outfit prijedlog</h1>
      <button onClick={fetchOutfit}>Predloži outfit</button>
      {outfit?.temperature && (
        <p>🌡️ Trenutna temperatura: {outfit.temperature}°C</p>
      )}
      {outfit && (
        <div>
          
          {Object.entries(outfit.outfit).map(([key, item]) => (
            <div key={key}>
              <h3>{key}</h3>
              <img
                src={`http://localhost:8000/storage/${item.image_url}`}
                width="150"
              />
              <p>{item.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
