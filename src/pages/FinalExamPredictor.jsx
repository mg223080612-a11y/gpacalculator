import { useState } from "react";
import "./FinalExamPredictor.css";

const gradeTargets = [
  { label: "A+", cutoff: 94.5 },
  { label: "A", cutoff: 89.5 },
  { label: "B+", cutoff: 84.5 },
  { label: "B", cutoff: 79.5 },
  { label: "C+", cutoff: 74.5 },
  { label: "C", cutoff: 69.5 },
  { label: "D+", cutoff: 64.5 },
  { label: "D", cutoff: 59.5 },
  { label: "F", cutoff: 0 },
];

const itemOptions = [
  "중간고사",
  "수행평가",
  "수시평가",
  "학습활동 및 수업태도",
  "출석",
  "기타",
];

const initialRows = [
  { name: "", point: "" },
  { name: "", point: "" },
  { name: "", point: "" },
  { name: "", point: "" },
  { name: "", point: "" },
];

function toNumber(value) {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
}

function FinalExamPredictor() {
  const [finalWeight, setFinalWeight] = useState("15");
  const [rows, setRows] = useState(initialRows);
  const [results, setResults] = useState(null);
  const [currentTotal, setCurrentTotal] = useState(0);

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        return { ...row, [field]: value };
      })
    );

    setResults(null);
  };

  const addRow = () => {
    setRows((prev) => [...prev, { name: "", point: "" }]);
    setResults(null);
  };

  const deleteRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
    setResults(null);
  };

  const calculateRequiredScores = () => {
    const weight = toNumber(finalWeight);

    if (weight <= 0) {
      alert("기말 반영 비율을 선택해주세요.");
      return;
    }

    const total = rows.reduce((sum, row) => {
      return sum + toNumber(row.point);
    }, 0);

    setCurrentTotal(total);

    const calculated = gradeTargets.map((grade) => {
      let required = ((grade.cutoff - total) / weight) * 100;

      if (required < 0) {
        required = 0;
      }

      return {
        ...grade,
        required,
      };
    });

    setResults(calculated);
  };

  const getScoreClass = (score) => {
    if (score === 0) return "good";
    if (score > 100) return "danger";
    if (score >= 90) return "warning";
    return "normal";
  };

  const formatRequiredScore = (score) => {
    if (score > 100) {
      return "불가능";
    }

    return `${score.toFixed(2)}점`;
  };

  return (
    <main className="predictor-page">
      <section className="predictor-header">
        <h1>기말고사 필요 점수 예측</h1>
        <p>
          이미 받은 <strong>반영점수</strong>를 입력하면 목표 등급별로
          기말고사에서 몇 점이 필요한지 계산합니다.
        </p>
      </section>

      <section className="predictor-card">
        <div className="final-weight-area">
          <label>기말 반영 비율</label>

          <div className="final-weight-input-box">
            <select
              className="final-weight-select"
              value={finalWeight}
              onChange={(e) => {
                setFinalWeight(e.target.value);
                setResults(null);
              }}
            >
              <option value="15">15</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
            <span>%</span>
          </div>
        </div>

        <div className="main-layout">
          <section className="input-panel">
            <div className="panel-title">
              <h2>항목별 반영점수 입력</h2>
              <span>기말고사 제외 반영점수만 입력</span>
            </div>

            <table className="input-table">
              <thead>
                <tr>
                  <th>항목</th>
                  <th>반영점수</th>
                  <th>삭제</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <select
                        className="item-select"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(index, "name", e.target.value)
                        }
                      >
                        <option value="">선택</option>
                        {itemOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.point}
                        onChange={(e) =>
                          updateRow(index, "point", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteRow(index)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button type="button" className="add-btn" onClick={addRow}>
              항목 추가
            </button>

            <button
              type="button"
              className="calculate-btn"
              onClick={calculateRequiredScores}
            >
              계산하기
            </button>
          </section>

          <section className="result-panel">
            <div className="panel-title">
              <h2>목표 등급별 필요 점수</h2>
              <span>계산하기 버튼을 누르면 표시됩니다</span>
            </div>

            <div className="total-box">
              <span>기말 제외 반영점수 합계</span>
              <strong>{results ? currentTotal.toFixed(2) : "-"}점</strong>
            </div>

            <table className="result-table">
              <thead>
                <tr>
                  <th>목표 등급</th>
                  <th>필요 기말고사 점수</th>
                </tr>
              </thead>

              <tbody>
                {results ? (
                  results.map((result) => (
                    <tr key={result.label}>
                      <td>{result.label}</td>
                      <td className={getScoreClass(result.required)}>
                        {formatRequiredScore(result.required)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="2" className="empty-result">
                      반영점수를 입력한 뒤 계산하기를 눌러주세요.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {results && (
              <p className="result-note">
                100점을 초과하는 등급은 현재 입력값 기준으로 달성이 어렵습니다.
              </p>
            )}
          </section>
        </div>
      </section>
    </main>
  );
}

export default FinalExamPredictor;