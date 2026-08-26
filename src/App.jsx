import { useState } from "react";
import GpaCalculator from "./pages/GpaCalculator";
import FinalExamPredictor from "./pages/FinalExamPredictor";
import CumulativeGpa from "./pages/CumulativeGpa";
import "./App.css";

function App() {
  const [activePage, setActivePage] = useState("gpa");

  return (
    <div className="app">
      <header className="app-header">
        <img src="/gvcs-logo.png" alt="GVCS Logo" className="logo" />
        <h1>GPA Calculator</h1>
        <p>GPA 계산과 기말고사 필요 점수를 한 번에 확인합니다.</p>
      </header>

      <nav className="main-tabs">
        <button
          className={activePage === "gpa" ? "active" : ""}
          onClick={() => setActivePage("gpa")}
        >
          GPA 계산기
        </button>

        <button
          className={activePage === "cumulative" ? "active" : ""}
          onClick={() => setActivePage("cumulative")}
        >
          Cumulative GPA
        </button>

        <button
          className={activePage === "final" ? "active" : ""}
          onClick={() => setActivePage("final")}
        >
          기말고사 예측
        </button>
      </nav>

      <main>
        {activePage === "gpa" && <GpaCalculator />}
        {activePage === "cumulative" && <CumulativeGpa />}
        {activePage === "final" && <FinalExamPredictor />}
      </main>
    </div>
  );
}

export default App;
