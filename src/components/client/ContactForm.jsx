import React, { useState } from "react";

export default function ContactForm() {
  const [formData, setFormData] = useState({ mail: "", username: "", message: "" });

  const handleChange = (event) => {
    setFormData((previousData) => ({
      ...previousData,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmission = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("https://formspree.io/f/mnjgynwy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Envoi réussi — merci !");
        setFormData({ mail: "", username: "", message: "" });
      } else {
        alert("Échec de l'envoi. Réessayez plus tard.");
      }
    } catch (error) {
      console.log(error);
      alert("Erreur réseau. Vérifiez votre connexion.");
    }
  };

  return (
    <div className="rounded-[2rem] bg-white p-6 shadow-sm">
      <form className="space-y-6" onSubmit={handleSubmission}>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="votre@exemple.com"
            onChange={handleChange}
            name="mail"
            value={formData.mail}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nom
          </label>
          <input
            type="text"
            placeholder="Votre nom"
            onChange={handleChange}
            name="username"
            value={formData.username}
            required
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Message
          </label>
          <textarea
            placeholder="Votre message..."
            onChange={handleChange}
            name="message"
            value={formData.message}
            rows={5}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500"
          />
        </div>

        <button
          className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          type="submit"
        >
          Soumettre
        </button>
      </form>
    </div>
  );
}