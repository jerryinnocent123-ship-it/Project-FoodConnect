import { CircleArrowLeft, ShieldCheck, Phone, KeyRound } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Alert from '@mui/material/Alert';

export default function Paiement({ amount = 0 }) {
  const navigate = useNavigate();
  const [input, setInput] = useState({ tel: "", code: "" });
  const [message, setMessage] = useState(null);

  // men fucntion nap mete nan btn nan
  const paid = () => {
    if (input.tel === "" || input.code === "") {
      setMessage("Please fill in the blank spaces");
    } else {
      setMessage(<Alert severity="success">Payment successfull.</Alert>);
      setInput({ tel: "", code: "" });
      setTimeout(() => {
        navigate("/");
      }, 2000);
    }
  };

  // function pou input yo (onchange)
  const handleChange = (event) => {
    setInput((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      {/* pa retire sa */}
      <div style={{ marginBottom: "20px" }}>
        <Link
          to={"/"}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "22px",
            fontWeight: "600",
            color: "#4a4a4a",
            textDecoration: "none"
          }}
        >
          <CircleArrowLeft size={40} />
          <span>Back</span>
        </Link>
      </div>

      {/* interface paiement */}
      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
          backgroundColor: "#fff"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
          <ShieldCheck size={40} color="#16a34a" />
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "10px" }}>
          Secure Payment
        </h2>
        <p style={{ fontSize: "18px", fontWeight: "600", marginBottom: "5px" }}>
          FoodConnect
        </p>
       
        {/* logo Mon Cash */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
          <img
            src="data:image/jpeg;base64,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"
            alt="Mon Cash"
            style={{ height: "50px" }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "15px" }}>
          <Phone size={22} style={{ marginRight: "8px" }} />
          <input
            type="text"
            name="tel"
            placeholder="Mon Cash Number (ex: 38883344)"
            value={input.tel}
            onChange={handleChange}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}>
          <KeyRound size={22} style={{ marginRight: "8px" }} />
          <input
            type="password"
            name="code"
            placeholder="PIN Code"
            value={input.code}
            onChange={handleChange}
            style={{
              flex: 1,
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "16px"
            }}
          />
        </div>

        <button
          onClick={paid}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#dc2626", // rouge
            color: "white",
            fontWeight: "bold",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          Pay
        </button>
      </div>

      {/* pa retire sa */}
      <div
        style={{
          textAlign: "center",
          backgroundColor: "#dcfce7",
          color: "#166534",
          fontSize: "18px",
          fontWeight: "600",
          padding: "12px",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
          width: "fit-content",
          margin: "20px auto"
        }}
      >
        {message}
      </div>
    </>
  );
}
