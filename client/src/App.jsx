import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import MyNews from "./pages/MyNews";
import TodayNews from "./pages/TodayNews";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#05080F] text-slate-200 flex flex-col font-sans relative z-0">
        <div className="fixed inset-0 z-[-1] h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/my-news" element={<MyNews />} />
            <Route path="/today" element={<TodayNews />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}