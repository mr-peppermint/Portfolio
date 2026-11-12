import './EducationSection.css';

interface EducationItem {
  school: string;
  degree: string;
  period: string;
  location: string;
  description: string;
  courses: string[];
  badge: string;
}

const EDUCATION_DATA: EducationItem[] = [
  {
    school: 'Newton School of Technology',
    degree: 'B.Tech in Computer Science & Artificial Intelligence',
    period: '2024 — Present',
    location: 'India',
    description:
      'Rigorous engineering curriculum focusing on data structures, algorithms, operating system internals, software architecture, and competitive programming.',
    courses: ['Data Structures & Algorithms', 'Operating Systems', 'Computer Networks', 'DBMS', 'Object-Oriented Design'],
    badge: 'NST'
  },
  {
    school: 'Harvard University',
    degree: 'CS50x — Introduction to Computer Science',
    period: 'Completed',
    location: 'Cambridge, MA (Online)',
    description:
      'Comprehensive study of computer science fundamentals: manual memory management in C, pointer arithmetic, hash tables, algorithmic complexity (Big-O), Python, and SQL.',
    courses: ['C & Memory Architecture', 'Algorithmic Big-O', 'Data Structures', 'Python', 'SQL'],
    badge: 'HARVARD'
  },
  {
    school: 'University of Helsinki',
    degree: 'Full Stack Open — Deep Web Architecture',
    period: 'Completed',
    location: 'Helsinki, Finland (Online)',
    description:
      'Intensive 14-part curriculum on single-page applications, Node.js backend architectures, TypeScript typing systems, GraphQL APIs, containerization, and continuous integration.',
    courses: ['React & Redux', 'Node.js & Express', 'TypeScript', 'GraphQL', 'CI/CD Pipelines'],
    badge: 'HELSINKI'
  },
  {
    school: 'DeepLearning.AI × Stanford',
    degree: 'Machine Learning Specialization',
    period: 'Completed',
    location: 'Stanford, CA (Online)',
    description:
      'Foundational mathematical and algorithmic machine learning: gradient descent, cost functions, neural networks, regularisation, and classification systems.',
    courses: ['Supervised Learning', 'Neural Networks', 'Gradient Optimization', 'NumPy Vectorization'],
    badge: 'STANFORD'
  }
];

export const EducationSection = () => {
  return (
    <section id="education" className="education-section">
      <div className="edu-head">
        <div className="edu-tag">// 02 / ACADEMIC FOUNDATIONS</div>
        <h2 className="edu-title">EDUCATION &amp; THEORY</h2>
        <p className="edu-desc">
          Formal computer science curricula, algorithmic training, and systems engineering — built on deep mathematical and low-level computational foundations.
        </p>
      </div>

      <div className="edu-grid">
        {EDUCATION_DATA.map(item => (
          <div key={item.school} className="edu-card">
            <div className="edu-card-top">
              <span className="edu-badge">{item.badge}</span>
              <span className="edu-period">{item.period}</span>
            </div>

            <div className="edu-card-body">
              <h3 className="edu-school">{item.school}</h3>
              <p className="edu-degree">{item.degree}</p>
              <p className="edu-description">{item.description}</p>
            </div>

            <div className="edu-courses">
              {item.courses.map(c => (
                <span key={c} className="edu-course-pill">
                  {c}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default EducationSection;
