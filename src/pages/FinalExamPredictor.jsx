import { useMemo, useState } from "react";
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

const createInitialRows = () => [
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
  const [finalWeight, setFinalWeight] = useState(20);
  const [rows, setRows] = useState(createInitialRows());

  const currentPointSum = useMemo(() => {
    return rows.reduce((sum, row) => {
      return sum + toNumber(row.point);
    }, 0);
  }, [rows]);

  const results = useMemo(() => {
    const weight = toNumber(finalWeight);

    return gradeTargets.map((grade) => {
      let requiredScore = 0;

      if (weight > 0) {
        requiredScore = ((grade.cutoff - currentPointSum) / weight) * 100;
      }

      if (requiredScore < 0) {
        requiredScore = 0;
      }

      return {
        ...grade,
        requiredScore,
      };
    });
  }, [currentPointSum, finalWeight]);

  const updateRow = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) => {
        if (i !== index) return row;
        return {
          ...row,
          [field]: value,
        };
      })
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, { name: "", point: "" }]);
  };

  const deleteRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  const getScoreClass = (score) => {
    if (score === 0) return "score-good";
    if (score > 100) return "score-danger";
    if (score >= 90) return "score-warning";
    return "";
  };

  return (
    <div className="predictor-page">
      <div className="predictor-card">
        <div className="final-weight-box">
          <label>기말 반영 비율</label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={finalWeight}
            onChange={(e) => setFinalWeight(e.target.value)}
          />
          <span>%</span>
        </div>

        <div className="predictor-layout">
          <section className="input-section">
            <h2>항목별 반영점수 입력</h2>

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
                      <input
                        type="text"
                        placeholder="예: 중간고사, 수행평가, 수시평가"
                        value={row.name}
                        onChange={(e) =>
                          updateRow(index, "name", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="예: 16.3"
                        value={row.point}
                        onChange={(e) =>
                          updateRow(index, "point", e.target.value)
                        }
                      />
                    </td>

                    <td>
                      <button
                        type="button"
                        className="delete-row-btn"
                        onClick={() => deleteRow(index)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button type="button" className="add-row-btn" onClick={addRow}>
              항목 추가
            </button>

            <div className="current-summary">
              <span>기말 제외 현재 반영점수 합계</span>
              <strong>{currentPointSum.toFixed(2)}점</strong>
            </div>
          </section>

          <section className="result-section">
            <h2>목표 등급별 필요 기말고사 점수</h2>

            <table className="result-table">
              <thead>
                <tr>
                  <th>목표 등급</th>
                  <th>필요 기말고사 점수</th>
                </tr>
              </thead>

              <tbody>
                {results.map((result) => (
                  <tr key={result.label}>
                    <td>{result.label}</td>
                    <td className={getScoreClass(result.requiredScore)}>
                      {result.requiredScore > 100
                        ? `${result.requiredScore.toFixed(2)} / 불가능`
                        : result.requiredScore.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="formula-note">
              <strong>계산식</strong>
              <p>
                필요 기말고사 점수 = (목표 등급 기준점수 - 현재 반영점수
                합계) ÷ 기말 반영 비율 × 100
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default FinalExamPredictor;