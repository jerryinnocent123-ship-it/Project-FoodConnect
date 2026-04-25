import { useTranslation } from "react-i18next";
import ClientLayout from "../../layouts/ClientLayout";
import { Link } from 'react-router-dom';

export default function About() {
  const { t } = useTranslation();

  return (
    <ClientLayout>
      <section
        className="h-[250px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">
            {t("About FoodConnect")}
          </h1>
          <p className="mt-2 text-sm md:text-base">{t("Discover FoodConnect")}</p>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center gap-10 px-4 sm:px-6 py-12 max-w-5xl mx-auto">
        <div className="flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b"
            alt="cake"
            className="w-[280px] sm:w-[300px] rounded-xl shadow-md"
          />
        </div>

        <div className="max-w-md text-center md:text-left">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("Our Mission")}
          </h2>
          <p className="mt-4 text-slate-600 leading-7">
            {t("We strive to create meaningful connections and inspire positive change. Our mission is to bring people together through shared values, creativity, and innovation. By celebrating diversity and encouraging collaboration, we aim to make everyday experiences more impactful, accessible, and fulfilling.")}
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12 bg-gray-50">
        <div className="bg-white shadow-md rounded-2xl p-6 hover:shadow-lg transition border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-wide">
            {t("Who are we?")}
          </h3>
          <p className="text-gray-600 leading-relaxed text-[15px]">
            {t("We are a team of passionate individuals dedicated to providing the best food delivery experience. We are committed to connecting customers with their favorite local restaurants and ensuring that every meal is delivered fresh and on time. Our mission is to make food delivery convenient, reliable, and enjoyable for everyone.")}
            <br /><br />
            {t("Our team is made up of talented individuals who are passionate about food and technology. We work tirelessly to create a seamless and enjoyable experience for our customers, and we are always looking for ways to improve and innovate in the food delivery industry.")}
            <br /><br />
            {t("Food Connect is more than just a food delivery service; it's a community of food lovers who share a common goal of bringing delicious meals to people's doorsteps. We are proud to be a part of this community and look forward to serving you in the future.")}
            <br /><br />
            {t("As long as we are in business, we will continue to strive to provide the best food delivery experience possible. We are committed to our customers and will always go above and beyond to ensure their satisfaction.")}
            <br /><br />
            {t("Thank you for choosing Food Connect — here for you, here to serve you!")}
          </p>
        </div>

        <div className="bg-gray-50 shadow-md rounded-2xl p-6 hover:shadow-lg transition border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-wide">
            {t("Our values")}
          </h3>
          <ul className="list-disc list-inside text-gray-600 space-y-2 pl-2">
            <li className="hover:text-orange-500 transition">{t("Serving with respect")}</li>
            <li className="hover:text-orange-500 transition">{t("Attention")}</li>
            <li className="hover:text-orange-500 transition">{t("Love")}</li>
            <li className="hover:text-orange-500 transition">{t("Enjoyment")}</li>
            <li className="hover:text-orange-500 transition">{t("Always in a good mood")}</li>
          </ul>
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-4 tracking-wide">
            {t("Join us")}
          </h3>
          <p className="text-gray-600 mb-6 text-[15px]">
            {t("You can't make this amazing adventure alone — it's about us, here for you! This is a collaboration that includes your engagement on our platform. Click below to join us quickly.")}
          </p>
          <div>
            <Link to="/signup">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 hover:scale-105 transition duration-300 shadow-md">
                {t("Join")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
}