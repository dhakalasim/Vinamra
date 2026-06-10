const KEYS = {
  materials: 'vinamra_materials',
  assessments: 'vinamra_assessments',
  attendance: 'vinamra_attendance',
  assignments: 'vinamra_assignments',
  grades: 'vinamra_grades',
  students: 'vinamra_students',
  clubs: 'vinamra_clubs',
  posters: 'vinamra_posters',
};

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function initStore() {
  if (!localStorage.getItem(KEYS.students)) {
    save(KEYS.students, [
      { id: 1, name: 'Alex Chen', email: 'alex@vinamra.com', major: 'Cloud Computing', year: 2, phone: '555-0101' },
      { id: 2, name: 'Priya Sharma', email: 'priya@vinamra.com', major: 'Data Science', year: 3, phone: '555-0102' },
      { id: 3, name: 'Jordan Lee', email: 'jordan@vinamra.com', major: 'STEAM', year: 1, phone: '555-0103' },
    ]);
  }
  if (!localStorage.getItem(KEYS.grades)) {
    save(KEYS.grades, [
      { id: 1, studentId: 1, course: 'CC101 Cloud Computing', score: 88, letter: 'B+', semester: 'Spring 2026' },
      { id: 2, studentId: 2, course: 'CC101 Cloud Computing', score: 94, letter: 'A', semester: 'Spring 2026' },
      { id: 3, studentId: 3, course: 'CC101 Cloud Computing', score: 76, letter: 'C+', semester: 'Spring 2026' },
    ]);
  }
  if (!localStorage.getItem(KEYS.clubs)) {
    save(KEYS.clubs, [
      { id: 1, studentId: 1, club: 'Robotics Club', role: 'Member', since: '2025-09' },
      { id: 2, studentId: 2, club: 'Debate Society', role: 'President', since: '2024-01' },
    ]);
  }
  if (!localStorage.getItem(KEYS.posters)) {
    save(KEYS.posters, [
      { id: 1, title: 'Spring Tech Fair', date: '2026-04-15', location: 'Main Hall', imageColor: '#0d9488' },
      { id: 2, title: 'STEAM Expo', date: '2026-05-02', location: 'Auditorium', imageColor: '#6366f1' },
    ]);
  }
  if (!localStorage.getItem(KEYS.materials)) {
    save(KEYS.materials, [
      { id: 1, title: 'Week 1 — Intro to Cloud', type: 'slides', fileName: 'cloud-intro.pptx', uploadedAt: '2026-01-10' },
      { id: 2, title: 'Syllabus & Policies', type: 'document', fileName: 'syllabus.pdf', uploadedAt: '2026-01-08' },
    ]);
  }
  if (!localStorage.getItem(KEYS.assessments)) {
    save(KEYS.assessments, [
      {
        id: 1,
        title: 'Cloud Basics Quiz',
        type: 'quiz',
        durationMinutes: 10,
        questions: [
          { text: 'What does IaaS stand for?', options: ['Infrastructure as a Service', 'Internet as a Service', 'Integration as a Service', 'Instance as a Service'], answer: 0 },
          { text: 'Which is a public cloud provider?', options: ['AWS', 'MySQL', 'React', 'Linux'], answer: 0 },
        ],
        createdAt: '2026-01-12',
      },
      {
        id: 2,
        title: 'Midterm Exam — Cloud Architecture',
        type: 'exam',
        durationMinutes: 45,
        questions: [
          { text: 'Best practice for multi-region deployment?', options: ['Active-active failover', 'Single region only', 'No backups', 'Manual DNS'], answer: 0 },
          { text: 'Primary benefit of containerization?', options: ['Consistent environments', 'Slower deploys', 'More hardware', 'Less scalability'], answer: 0 },
          { text: 'VPC stands for?', options: ['Virtual Private Cloud', 'Very Public Cloud', 'Virtual Process Core', 'Verified Private Cluster'], answer: 0 },
        ],
        createdAt: '2026-02-01',
      },
    ]);
  }
}

export const store = {
  getMaterials: () => load(KEYS.materials, []),
  setMaterials: (data) => save(KEYS.materials, data),

  getAssessments: () => load(KEYS.assessments, []),
  setAssessments: (data) => save(KEYS.assessments, data),

  getAttendance: () => load(KEYS.attendance, []),
  setAttendance: (data) => save(KEYS.attendance, data),

  getAssignments: () => load(KEYS.assignments, []),
  setAssignments: (data) => save(KEYS.assignments, data),

  getGrades: () => load(KEYS.grades, []),
  setGrades: (data) => save(KEYS.grades, data),

  getStudents: () => load(KEYS.students, []),
  setStudents: (data) => save(KEYS.students, data),

  getClubs: () => load(KEYS.clubs, []),
  setClubs: (data) => save(KEYS.clubs, data),

  getPosters: () => load(KEYS.posters, []),
  setPosters: (data) => save(KEYS.posters, data),
};

export function nextId(items) {
  return items.length ? Math.max(...items.map(i => i.id)) + 1 : 1;
}
