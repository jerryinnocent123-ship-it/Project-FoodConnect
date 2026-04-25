import { useTranslation } from "react-i18next"
import ClientLayout from "../../layouts/ClientLayout";


export default function About() {
  const { t } = useTranslation()

  return (
    <ClientLayout>
      <section
        className="h-[250px] bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836')",
        }}
      >
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
          <h1 className="text-3xl font-bold">
            {t("About FoodConnect")}
          </h1>
          <p className="mt-2">{t("Discover FoodConnect")}</p>
        </div>
      </section>

      <section className="flex flex-col md:flex-row items-center gap-10 px-6 py-12 max-w-5xl mx-auto">
        <div>
          <img
            src="https://images.unsplash.com/photo-1551024601-bec78aea704b"
            alt="cake"
            className="w-[300px] rounded-xl"
          />
        </div>

        <div className="max-w-md">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("Our Mission")}
          </h2>
          <p className="mt-4 text-slate-600 leading-7">
            {t("We strive to create meaningful connections and inspire positive change. Our mission is to bring people together through shared values, creativity, and innovation. By celebrating diversity and encouraging collaboration, we aim to make everyday experiences more impactful, accessible, and fulfilling.")}
          </p>
        </div>
      </section>
    </ClientLayout>
  )
}