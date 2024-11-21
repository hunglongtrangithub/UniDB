const gradePointMap: { [key: string]: number } = {
  A: 4.0,
  B: 3.0,
  C: 2.0,
  D: 1.0,
  F: 0.0,
};

export const calculateGPA = (
  courses: {
    credits: number;
    grade: string;
  }[],
) => {
  let totalCredits = 0;
  let totalPoints = 0;

  courses.forEach((course) => {
    if (course.grade && course.credits) {
      totalCredits += course.credits;
      totalPoints += course.credits * (gradePointMap[course.grade] || 0);
    }
  });

  const GPA = totalCredits > 0 ? totalPoints / totalCredits : null;
  return GPA;
};