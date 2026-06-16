import { useState } from "react";
import "./GpaCalculator.css";

const createRows = (count) =>
  Array.from({ length: count }, () => ({
    credit: "",
    gp: "",
  }));

function GpaCalculator() {
  const [regularRows, setRegularRows] = useState(createRows(4));
  const [honorsRows, setHonorsRows] = useState(createRows(4));
  const [result, setResult] = useState(null);

  const addRegularRow = () => {
    setRegularRows((prev) => [...prev, { credit: "", gp: "" }]);
  };

  const addHonorsRow = () => {
    setHonorsRows((prev) => [...prev, { credit: "", gp: "" }]);
  };

  const deleteRegularRow = (index) => {
    setRegularRows((prev) => prev.filter((_, i) => i !== index));
  };

  const deleteHonorsRow = (index) => {
    setHonorsRows((prev) => prev.filter((_, i) => i !== index));
  };

  const updateRegularRow = (index, field, value) => {
    setRegularRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const updateHonorsRow = (index, field, value) => {
    setHonorsRows((prev) =>
      prev.map((row, i) => (i === index ? { ...row, [field]: value } : row))
    );
  };

  const convertHonorsToUnweightedGP = (gp) => {
    if (gp >= 3.0) {
      return gp - 1.0;
    }

    return gp;
  };

  const calculateSection = (rows, maxGP, isHonors) => {
    let weightedPoints = 0;
    let unweightedPoints = 0;
    let credits = 0;

    rows.forEach((row) => {
      if (row.credit === "" || row.gp === "") return;

      const credit = Number(row.credit);
      const gp = Number(row.gp);

      if (Number.isNaN(credit) || Number.isNaN(gp)) return;
      if (credit <= 0) return;
      if (gp < 0 || gp > maxGP) return;

      const unweightedGP = isHonors ? convertHonorsToUnweightedGP(gp) : gp;

      weightedPoints += credit * gp;
      unweightedPoints += credit * unweightedGP;
      credits += credit;
    });

    return {
      weightedPoints,
      unweightedPoints,
      credits,
      gpa: credits > 0 ? weightedPoints / credits : 0,
    };
  };

  const calculateGPA = () => {
    const regular = calculateSection(regularRows, 4, false);
    const honors = calculateSection(honorsRows, 5, true);

    const totalCredits = regular.credits + honors.credits;

    if (totalCredits === 0) {
      setResult(null);
      return;
    }

    const totalWeightedPoints = regular.weightedPoints + honors.weightedPoints;
    const totalUnweightedPoints =
      regular.unweightedPoints + honors.unweightedPoints;

    setResult({
      regularGPA: regular.credits > 0 ? regular.gpa : null,
      honorsGPA: honors.credits > 0 ? honors.gpa : null,
      weightedGPA: totalWeightedPoints / totalCredits,
      unweightedGPA: totalUnweightedPoints / totalCredits,
    });
  };

  return (
    <>
      <div className="description">
        <p>
          이 계산기는 <strong>학점 Credit</strong>과 <strong>GP</strong>만
          입력하여 GPA를 계산합니다.
        </p>
        <p>
          왼쪽에는 <strong>Regular 과목</strong>, 오른쪽에는{" "}
          <strong>Honors & AP 과목</strong>을 입력합니다.
        </p>
        <p>빈칸이 있는 줄은 자동으로 계산에서 제외됩니다.</p>
        <p>
          <strong>Weighted GPA</strong> = Σ(GP × Credit) ÷ Σ(Credit)
        </p>
        <p>
          <strong>Unweighted GPA</strong> = Honors/AP 가산점을 제외하고
          Regular 기준으로 환산한 GPA
        </p>
      </div>

      <div className="container">
        <div className="box">
          <h2>Regular</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Credit</th>
                  <th>GP</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {regularRows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="예: 4"
                        value={row.credit}
                        onChange={(e) =>
                          updateRegularRow(index, "credit", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="4"
                        step="0.01"
                        placeholder="예: 4.00"
                        value={row.gp}
                        onChange={(e) =>
                          updateRegularRow(index, "gp", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteRegularRow(index)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-area">
            <button type="button" className="add-btn" onClick={addRegularRow}>
              Regular 추가
            </button>
          </div>
        </div>

        <div className="box">
          <h2>Honors & AP</h2>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Credit</th>
                  <th>GP</th>
                  <th>Delete</th>
                </tr>
              </thead>

              <tbody>
                {honorsRows.map((row, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        placeholder="예: 4"
                        value={row.credit}
                        onChange={(e) =>
                          updateHonorsRow(index, "credit", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.01"
                        placeholder="예: 5.00"
                        value={row.gp}
                        onChange={(e) =>
                          updateHonorsRow(index, "gp", e.target.value)
                        }
                      />
                    </td>
                    <td>
                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() => deleteHonorsRow(index)}
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="button-area">
            <button type="button" className="add-btn" onClick={addHonorsRow}>
              Honors/AP 추가
            </button>
          </div>
        </div>
      </div>

      <button type="button" className="calc-btn" onClick={calculateGPA}>
        GPA 계산하기
      </button>

      <div className="result-box">
        <strong>Regular GPA:</strong>{" "}
        {result?.regularGPA !== null && result
          ? result.regularGPA.toFixed(2)
          : "-"}
        <br />
        <strong>Honors & AP GPA:</strong>{" "}
        {result?.honorsGPA !== null && result
          ? result.honorsGPA.toFixed(2)
          : "-"}
        <br />
        <strong>Weighted GPA:</strong>{" "}
        {result ? result.weightedGPA.toFixed(2) : "-"}
        <br />
        <strong>Unweighted GPA:</strong>{" "}
        {result ? result.unweightedGPA.toFixed(2) : "-"}
      </div>

      <p className="note">
        Honors & AP의 Unweighted GPA는 가산점 1.00을 제외하여 Regular 기준
        GP로 환산합니다. 단, D+, D, F 구간은 가산점이 없으므로 그대로
        계산합니다.
      </p>
    </>
  );
}

export default GpaCalculator;