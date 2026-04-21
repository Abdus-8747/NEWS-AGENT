import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing";
import TodayNews from "./pages/TodayNews";
import GitHub from "./pages/GitHub";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#050505] text-[#e5e5e5] flex flex-col font-mono relative z-0">
        <div className="fixed inset-0 z-[-1] h-full w-full bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none opacity-40"></div>
        <Navbar />
        <div className="flex-1 flex flex-col">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/today" element={<TodayNews />} />
            <Route path="/github" element={<GitHub />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}