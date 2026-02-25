import { useState } from "react";

function BillModal({ closeModal, addBill }) {

  const [form, setForm] = useState({
    eventName: "",
    eventDate: "",
    amount: "",
    image: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result   // base64
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.image) {
      alert("Please upload image");
      return;
    }

    const newBill = {
      ...form,
      amount: Number(form.amount),
      uploadedAt: new Date().toISOString()
    };

    await addBill(newBill);
    closeModal();
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>Upload Bill</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="eventName"
            placeholder="Event Name"
            onChange={handleChange}
            required
          />

          <input
            type="date"
            name="eventDate"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="amount"
            placeholder="Amount"
            onChange={handleChange}
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
          />

          <div style={{ marginTop: "15px" }}>
            <button type="button" onClick={closeModal}>
              Cancel
            </button>
            <button type="submit" style={{ marginLeft: "10px" }}>
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 9999
};

const modalStyle = {
  background: "#662828",
  padding: "20px",
  borderRadius: "8px",
  width: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  color: "white"
};

export default BillModal;