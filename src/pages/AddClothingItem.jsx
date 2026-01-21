import { useState } from "react";
import axios from "axios";

export default function AddClothingItem() {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8000/api/wardrobe",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Odjevni predmet dodan!");
      setImage(null);
    } catch (err) {
      alert("Greška pri dodavanju");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button disabled={loading}>
        {loading ? "Analiziram..." : "Dodaj u ormar"}
      </button>
    </form>
  );
}