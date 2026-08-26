import { useState } from "react";
import "./CumulativeGpa.css";

const createCourse = () => ({
  type: "regular",
  credit: "",
  gp: "",
});

const createSemester = (grade, semester) => ({
  grade,
  semester,
  courses: [createCourse(), createCourse(), createCourse(), createCourse()],
});

function CumulativeGpa() {
  const [semesters, setSemesters] = useState([]);
  const [result, setResult] = useState(null);
  const [addGrade, setAddGrade] = useState("9");
  const [addSemester, setAddSemester] = useState("1");

  const addSemesterBlock = () => {
    const exists = semesters.some(
      (s) => s.grade === addGrade && s.semester === addSemester
    );
    if (exists) {
      alert(`${addGrade}학년 ${addSemester}학기는 이미 추가되어 있습니다.`);
      return;
    }
    setSemesters((prev) => {
      const updated = [...prev, createSemester(addGrade, addSemester)];
      updated.sort((a, b) => {
        if (a.grade !== b.grade) return Number(a.grade) - Number(b.grade);
        return Number(a.semester) - Number(b.semester);
      });
      return updated;
    });
    setResult(null);
  };

  const removeSemester = (index) => {
    setSemesters((prev) => prev.filter((_, i) => i !== index));
    setResult(null);
  };

  const addCourse = (semIndex) => {
    setSemesters((prev) =>
      prev.map((sem, i) =>
        i === semIndex
          ? { ...sem, courses: [...sem.courses, createCourse()] }
          : sem
      )
    );
    setResult(null);
  };

  const removeCourse = (semIndex, courseIndex) => {
    setSemesters((prev) =>
      prev.map((sem, i) =>
        i === semIndex
          ? { ...sem, courses: sem.courses.filter((_, j) => j !== courseIndex) }
          : sem
      )
    );
    setResult(null);
  };

  const updateCourse = (semIndex, courseIndex, field, value) => {
    setSemesters((prev) =>
      prev.map((sem, i) =>
        i === semIndex
          ? {
              ...sem,
              courses: sem.courses.map((c, j) =>
                j === courseIndex ? { ...c, [field]: value } : c
              ),
            }
          : sem
      )
    );
    setResult(null);
  };

  const convertToUnweighted = (gp) => (gp >= 3.0 ? gp - 1.0 : gp);

  const calculateCumulative = () => {
    if (semesters.length === 0) {
      alert("학기를 먼저 추가해주세요.");
      return;
    }

    let totalWeightedPoints = 0;
    let totalUnweightedPoints = 0;
    let totalCredits = 0;

    const semesterResults = semesters.map((sem) => {
      let semWeighted = 0;
      let semUnweighted = 0;
      let semCredits = 0;

      sem.courses.forEach((c) => {
        if (c.credit === "" || c.gp === "") return;
        const credit = Number(c.credit);
        const gp = Number(c.gp);
        if (Number.isNaN(credit) || Number.isNaN(gp)) return;
        if (credit <= 0) return;
        const maxGP = c.type === "honors" ? 5 : 4;
        if (gp < 0 || gp > maxGP) return;

        const unweightedGP =
          c.type === "honors" ? convertToUnweighted(gp) : gp;

        semWeighted += credit * gp;
        semUnweighted += credit * unweightedGP;
        semCredits += credit;
      });

      totalWeightedPoints += semWeighted;
      totalUnweightedPoints += semUnweighted;
      totalCredits += semCredits;

      return {
        grade: sem.grade,
        semester: sem.semester,
        credits: semCredits,
        weightedGPA: semCredits > 0 ? semWeighted / semCredits : null,
        unweightedGPA: semCredits > 0 ? semUnweighted / semCredits : null,
      };
    });

    setResult({
      semesters: semesterResults,
      totalCredits,
      cumulativeWeighted:
        totalCredits > 0 ? totalWeightedPoints / totalCredits : 0,
      cumulativeUnweighted:
        totalCredits > 0 ? totalUnweightedPoints / totalCredits : 0,
    });
  };

  return (
    <div className="cumulative-page">
      <div className="cumulative-description">
        <p>
          <strong>9학년~12학년</strong>까지 원하는 학기를 추가하고, 각 학기별
          과목의 <strong>Credit</strong>과 <strong>GP</strong>를 입력하면{" "}
          <strong>Cumulative GPA</strong>를 계산합니다.
        </p>
        <p>
          과목 유형을 <strong>Regular</strong> 또는{" "}
          <strong>Honors/AP</strong>로 선택할 수 있습니다.
        </p>
      </div>

      <div className="add-semester-bar">
        <select
          value={addGrade}
          onChange={(e) => setAddGrade(e.target.value)}
          className="grade-select"
        >
          <option value="9">9학년</option>
          <option value="10">10학년</option>
          <option value="11">11학년</option>
          <option value="12">12학년</option>
        </select>

        <select
          value={addSemester}
          onChange={(e) => setAddSemester(e.target.value)}
          className="semester-select"
        >
          <option value="1">1학기</option>
          <option value="2">2학기</option>
        </select>

        <button type="button" className="add-semester-btn" onClick={addSemesterBlock}>
          학기 추가
        </button>
      </div>

      {semesters.length === 0 && (
        <div className="empty-state">
          위에서 학년과 학기를 선택한 뒤 "학기 추가" 버튼을 눌러주세요.
        </div>
      )}

      <div className="semesters-list">
        {semesters.map((sem, semIndex) => (
          <div className="semester-block" key={`${sem.grade}-${sem.semester}`}>
            <div className="semester-header">
              <h2>
                {sem.grade}학년 {sem.semester}학기
              </h2>
              <button
                type="button"
                className="remove-semester-btn"
                onClick={() => removeSemester(semIndex)}
              >
                삭제
              </button>
            </div>

            <div className="semester-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>유형</th>
                    <th>Credit</th>
                    <th>GP</th>
                    <th>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {sem.courses.map((course, cIndex) => (
                    <tr key={cIndex}>
                      <td>
                        <select
                          className="type-select"
                          value={course.type}
                          onChange={(e) =>
                            updateCourse(semIndex, cIndex, "type", e.target.value)
                          }
                        >
                          <option value="regular">Regular</option>
                          <option value="honors">Honors/AP</option>
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="예: 4"
                          value={course.credit}
                          onChange={(e) =>
                            updateCourse(semIndex, cIndex, "credit", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          max={course.type === "honors" ? 5 : 4}
                          step="0.01"
                          placeholder={
                            course.type === "honors" ? "예: 5.00" : "예: 4.00"
                          }
                          value={course.gp}
                          onChange={(e) =>
                            updateCourse(semIndex, cIndex, "gp", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="delete-course-btn"
                          onClick={() => removeCourse(semIndex, cIndex)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              type="button"
              className="add-course-btn"
              onClick={() => addCourse(semIndex)}
            >
              과목 추가
            </button>
          </div>
        ))}
      </div>

      {semesters.length > 0 && (
        <button
          type="button"
          className="calc-cumulative-btn"
          onClick={calculateCumulative}
        >
          Cumulative GPA 계산하기
        </button>
      )}

      {result && (
        <div className="cumulative-result">
          <div className="cumulative-total">
            <div className="total-item">
              <span>Cumulative Weighted GPA</span>
              <strong>{result.cumulativeWeighted.toFixed(2)}</strong>
            </div>
            <div className="total-item">
              <span>Cumulative Unweighted GPA</span>
              <strong>{result.cumulativeUnweighted.toFixed(2)}</strong>
            </div>
            <div className="total-item secondary">
              <span>Total Credits</span>
              <strong>{result.totalCredits}</strong>
            </div>
          </div>

          <div className="semester-breakdown">
            <h3>학기별 GPA</h3>
            <table className="breakdown-table">
              <thead>
                <tr>
                  <th>학기</th>
                  <th>Credits</th>
                  <th>Weighted</th>
                  <th>Unweighted</th>
                </tr>
              </thead>
              <tbody>
                {result.semesters.map((s) => (
                  <tr key={`${s.grade}-${s.semester}`}>
                    <td>
                      {s.grade}학년 {s.semester}학기
                    </td>
                    <td>{s.credits}</td>
                    <td>
                      {s.weightedGPA !== null ? s.weightedGPA.toFixed(2) : "-"}
                    </td>
                    <td>
                      {s.unweightedGPA !== null
                        ? s.unweightedGPA.toFixed(2)
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="cumulative-note">
        Cumulative GPA는 추가된 모든 학기의 과목을 합산하여 계산합니다.
        Honors/AP 과목의 Unweighted GPA는 가산점 1.00을 제외하여 환산합니다.
      </p>
    </div>
  );
}

export default CumulativeGpa;
