/* ============================================
   VidyaMitra – Application Logic (Part 2)
   Skills, Careers, Learning, Quiz, Interview,
   Progress, Resources
   ============================================ */

// ── Skill Analysis Data ──
const ROLE_SKILLS = {
  fullstack: {
    title: 'Full Stack Developer',
    skills: {
      'JavaScript': 90, 'React': 85, 'Node.js': 85, 'Python': 70,
      'SQL': 80, 'Git': 80, 'REST APIs': 85, 'CSS': 75,
      'Docker': 60, 'TypeScript': 70, 'MongoDB': 65, 'AWS': 55
    }
  },
  frontend: {
    title: 'Frontend Developer',
    skills: {
      'JavaScript': 95, 'React': 90, 'CSS': 90, 'HTML': 90,
      'TypeScript': 80, 'Git': 75, 'Redux': 70, 'Webpack': 60,
      'Testing': 65, 'Figma': 50, 'Accessibility': 70, 'Performance': 65
    }
  },
  backend: {
    title: 'Backend Developer',
    skills: {
      'Python': 90, 'SQL': 90, 'Node.js': 85, 'REST APIs': 90,
      'Docker': 75, 'Git': 80, 'AWS': 70, 'Redis': 60,
      'Linux': 75, 'Security': 65, 'GraphQL': 55, 'Microservices': 70
    }
  },
  'data-scientist': {
    title: 'Data Scientist',
    skills: {
      'Python': 95, 'Machine Learning': 90, 'SQL': 80, 'Statistics': 85,
      'TensorFlow': 75, 'Pandas': 90, 'Data Viz': 80, 'NLP': 65,
      'Deep Learning': 70, 'R': 50, 'Spark': 55, 'Git': 60
    }
  },
  devops: {
    title: 'DevOps Engineer',
    skills: {
      'Docker': 90, 'Kubernetes': 85, 'AWS': 90, 'Linux': 90,
      'CI/CD': 90, 'Terraform': 75, 'Python': 70, 'Git': 85,
      'Monitoring': 75, 'Networking': 70, 'Security': 65, 'Bash': 80
    }
  },
  mobile: {
    title: 'Mobile Developer',
    skills: {
      'React Native': 90, 'JavaScript': 85, 'Swift': 70, 'Kotlin': 70,
      'Firebase': 75, 'REST APIs': 80, 'Git': 75, 'UI/UX': 70,
      'Redux': 65, 'Testing': 60, 'CI/CD': 55, 'TypeScript': 65
    }
  }
};

const USER_SKILLS = {
  'JavaScript': 78, 'React': 72, 'Node.js': 55, 'Python': 85,
  'SQL': 68, 'Git': 70, 'REST APIs': 60, 'CSS': 65,
  'Docker': 30, 'TypeScript': 35, 'MongoDB': 40, 'AWS': 20,
  'Machine Learning': 45, 'HTML': 80, 'Redux': 40, 'Webpack': 25,
  'Testing': 35, 'Figma': 20, 'Accessibility': 30, 'Performance': 40,
  'Redis': 15, 'Linux': 45, 'Security': 25, 'GraphQL': 20,
  'Microservices': 25, 'Statistics': 50, 'TensorFlow': 30, 'Pandas': 55,
  'Data Viz': 45, 'NLP': 20, 'Deep Learning': 25, 'R': 10, 'Spark': 10,
  'Kubernetes': 15, 'CI/CD': 20, 'Terraform': 10, 'Monitoring': 15,
  'Networking': 20, 'Bash': 35, 'React Native': 30, 'Swift': 10,
  'Kotlin': 10, 'Firebase': 25, 'UI/UX': 40
};

function updateSkillAnalysis() {
  const role = document.getElementById('skill-target-role').value;
  const roleData = ROLE_SKILLS[role];
  if (!roleData) return;

  // Comparison bars
  const barsEl = document.getElementById('skill-comparison-bars');
  let barsHTML = '';
  const skillKeys = Object.keys(roleData.skills);
  skillKeys.forEach(skill => {
    const required = roleData.skills[skill];
    const current = USER_SKILLS[skill] || 0;
    const color = current >= required ? 'var(--gradient-success)' : (current >= required * 0.6 ? 'var(--gradient-primary)' : 'var(--gradient-warm)');
    barsHTML += `
      <div style="margin-bottom:16px;">
        <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
          <span style="font-size:0.85rem;font-weight:500;">${skill}</span>
          <span style="font-size:0.8rem;color:var(--text-secondary);">${current}% / ${required}%</span>
        </div>
        <div style="position:relative;height:8px;background:var(--bg-glass);border-radius:50px;">
          <div style="position:absolute;height:100%;width:${required}%;background:rgba(255,255,255,0.1);border-radius:50px;"></div>
          <div style="position:absolute;height:100%;width:${current}%;background:${color};border-radius:50px;transition:width 1s;"></div>
        </div>
      </div>`;
  });
  barsEl.innerHTML = barsHTML;

  // Strengths & Gaps
  const strengths = [];
  const gaps = [];
  skillKeys.forEach(skill => {
    const required = roleData.skills[skill];
    const current = USER_SKILLS[skill] || 0;
    if (current >= required * 0.8) {
      strengths.push({ skill, current, required });
    } else {
      gaps.push({ skill, current, required, gap: required - current });
    }
  });
  gaps.sort((a, b) => b.gap - a.gap);

  document.getElementById('skill-strengths').innerHTML = strengths.map(s =>
    `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color);">
      <span style="color:var(--success-400);font-size:1.1rem;">✓</span>
      <span style="font-size:0.9rem;">${s.skill}</span>
      <span style="margin-left:auto;font-size:0.8rem;color:var(--text-tertiary);">${s.current}%</span>
    </div>`
  ).join('') || '<p style="color:var(--text-tertiary);font-size:0.9rem;">Keep learning to build strengths!</p>';

  document.getElementById('skill-gaps').innerHTML = gaps.map(g =>
    `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border-color);">
      <span style="color:var(--warning-400);font-size:1.1rem;">↑</span>
      <span style="font-size:0.9rem;">${g.skill}</span>
      <span class="badge badge-warning" style="margin-left:auto;">+${g.gap}% needed</span>
    </div>`
  ).join('');

  // Radar chart
  drawRadarChart(roleData, skillKeys);
}

function drawRadarChart(roleData, skills) {
  const canvas = document.getElementById('skill-radar-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2, cy = h / 2;
  const maxR = Math.min(cx, cy) - 40;
  const n = Math.min(skills.length, 8);
  const topSkills = skills.slice(0, n);

  // Draw rings
  for (let ring = 1; ring <= 5; ring++) {
    const r = (ring / 5) * maxR;
    ctx.beginPath();
    for (let i = 0; i <= n; i++) {
      const angle = (Math.PI * 2 * (i % n)) / n - Math.PI / 2;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
    ctx.stroke();
  }

  // Draw axes & labels
  topSkills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const x = cx + Math.cos(angle) * maxR;
    const y = cy + Math.sin(angle) * maxR;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    ctx.stroke();

    const lx = cx + Math.cos(angle) * (maxR + 20);
    const ly = cy + Math.sin(angle) * (maxR + 20);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(skill, lx, ly);
  });

  // Draw required area
  ctx.beginPath();
  topSkills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = (roleData.skills[skill] || 0) / 100;
    const x = cx + Math.cos(angle) * maxR * val;
    const y = cy + Math.sin(angle) * maxR * val;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(var(--primary-rgb), 0.1)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(var(--primary-rgb), 0.3)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Draw user area
  ctx.beginPath();
  topSkills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = (USER_SKILLS[skill] || 0) / 100;
    const x = cx + Math.cos(angle) * maxR * val;
    const y = cy + Math.sin(angle) * maxR * val;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(var(--accent-rgb), 0.15)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(var(--accent-rgb), 0.6)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Draw dots
  topSkills.forEach((skill, i) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const val = (USER_SKILLS[skill] || 0) / 100;
    const x = cx + Math.cos(angle) * maxR * val;
    const y = cy + Math.sin(angle) * maxR * val;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--accent)';
    ctx.fill();
  });
}

// ── Career Recommendations ──
function renderCareers() {
  const careers = [
    { title: 'Full Stack Developer', match: 78, salary: '₹8-25 LPA', desc: 'Build end-to-end web applications with frontend and backend expertise.', skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'], icon: '💻', growth: 'High' },
    { title: 'Data Scientist', match: 65, salary: '₹10-30 LPA', desc: 'Analyze data and build ML models to drive business decisions.', skills: ['Python', 'ML', 'Statistics', 'SQL', 'TensorFlow'], icon: '📊', growth: 'Very High' },
    { title: 'Frontend Developer', match: 72, salary: '₹6-20 LPA', desc: 'Create stunning, responsive user interfaces with modern frameworks.', skills: ['JavaScript', 'React', 'CSS', 'TypeScript', 'HTML'], icon: '🎨', growth: 'High' },
    { title: 'Backend Developer', match: 70, salary: '₹8-22 LPA', desc: 'Design robust server architectures, APIs, and database systems.', skills: ['Python', 'Node.js', 'SQL', 'Docker', 'REST APIs'], icon: '⚙️', growth: 'High' },
    { title: 'ML Engineer', match: 55, salary: '₹12-35 LPA', desc: 'Deploy and optimize machine learning models at scale.', skills: ['Python', 'TensorFlow', 'Docker', 'Cloud', 'MLOps'], icon: '🤖', growth: 'Very High' },
    { title: 'DevOps Engineer', match: 40, salary: '₹10-28 LPA', desc: 'Automate workflows and manage cloud infrastructure.', skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux'], icon: '🔧', growth: 'High' },
  ];

  const container = document.getElementById('career-cards');
  container.innerHTML = careers.map((c, i) => {
    const matchColor = c.match >= 70 ? 'var(--gradient-success)' : (c.match >= 50 ? 'var(--gradient-primary)' : 'var(--gradient-warm)');
    return `
    <div class="career-card glass-card animate-fadeInUp delay-${i + 1}" style="margin-bottom:16px;">
      <div class="match-circle" style="background:${matchColor};">${c.match}%</div>
      <div class="career-info" style="flex:1;">
        <h4>${c.icon} ${c.title}</h4>
        <p>${c.desc}</p>
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
          <span class="badge badge-success">💰 ${c.salary}</span>
          <span class="badge badge-primary">📈 ${c.growth} Growth</span>
        </div>
        <div class="career-skills">
          ${c.skills.map(s => `<span class="tag">${s}</span>`).join('')}
        </div>
      </div>
      <div>
        <button class="btn btn-sm btn-outline" onclick="navigate('learning')">View Plan →</button>
      </div>
    </div>`;
  }).join('');
}

// ── Learning Plan ──
function renderLearningPlan() {
  const weeks = [
    { week: 1, title: 'JavaScript Fundamentals', tasks: ['ES6+ features (arrow functions, destructuring, async/await)', 'DOM manipulation and event handling', 'Practice: Build a todo app'], complete: true },
    { week: 2, title: 'React Basics', tasks: ['Components, props, and state management', 'React hooks (useState, useEffect, useContext)', 'Practice: Build a weather dashboard'], complete: true },
    { week: 3, title: 'Advanced React & State', tasks: ['Redux / Context API for state management', 'React Router for navigation', 'Practice: Build a multi-page CRUD app'], complete: true },
    { week: 4, title: 'Node.js & Express', tasks: ['Setting up Express server', 'REST API design and implementation', 'Middleware, error handling, authentication'], complete: false, current: true },
    { week: 5, title: 'Database & SQL', tasks: ['PostgreSQL fundamentals', 'ORM (Sequelize/Prisma)', 'Practice: Build a full API with database'], complete: false },
    { week: 6, title: 'Authentication & Security', tasks: ['JWT tokens and session management', 'OAuth2 implementation', 'Security best practices (CORS, HTTPS, input validation)'], complete: false },
    { week: 7, title: 'DevOps Basics', tasks: ['Docker containerization', 'CI/CD with GitHub Actions', 'Basic AWS deployment (EC2, S3)'], complete: false },
    { week: 8, title: 'Portfolio & Interview Prep', tasks: ['Build and deploy a full-stack portfolio project', 'Practice DSA problems (arrays, trees, graphs)', 'Mock interview sessions'], complete: false },
  ];

  const timeline = document.getElementById('learning-timeline');
  timeline.innerHTML = weeks.map(w => `
    <div class="timeline-item glass-card ${w.complete ? 'completed' : ''}" style="border-left:${w.current ? '3px solid var(--primary-500)' : 'none'};">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <h4>${w.complete ? '✅' : (w.current ? '🔄' : '⬜')} Week ${w.week}: ${w.title}</h4>
        ${w.complete ? '<span class="badge badge-success">Completed</span>' : (w.current ? '<span class="badge badge-primary">In Progress</span>' : '<span class="badge" style="background:var(--bg-glass);">Upcoming</span>')}
      </div>
      <ul style="padding-left:20px;">
        ${w.tasks.map(t => `<li style="color:var(--text-secondary);font-size:0.9rem;margin-bottom:6px;list-style:disc;">${t}</li>`).join('')}
      </ul>
      ${w.current ? '<div style="margin-top:12px;"><button class="btn btn-sm btn-primary" onclick="showToast(\'Keep going! You are on track.\',\'success\')">Mark Complete</button></div>' : ''}
    </div>
  `).join('');
}

// ── Quiz System ──
const QUIZ_DATA = {
  python: {
    title: 'Python',
    questions: [
      { q: 'What is the output of: print(type([]))?', options: ["<class 'list'>", "<class 'tuple'>", "<class 'dict'>", "<class 'set'>"], answer: 0 },
      { q: 'Which keyword is used to define a function in Python?', options: ['function', 'func', 'def', 'define'], answer: 2 },
      { q: 'What does "len()" function return?', options: ['Data type', 'Memory size', 'Number of elements', 'Index'], answer: 2 },
      { q: 'Which of the following is immutable in Python?', options: ['List', 'Dictionary', 'Set', 'Tuple'], answer: 3 },
      { q: 'What is a decorator in Python?', options: ['A function that modifies another function', 'A class method', 'A type of loop', 'A data structure'], answer: 0 },
      { q: 'Which module is used for regular expressions?', options: ['regex', 're', 'regexp', 'match'], answer: 1 },
      { q: 'What is the difference between "==" and "is"?', options: ['No difference', '"==" checks value, "is" checks identity', '"is" checks value, "==" checks identity', 'Both check identity'], answer: 1 },
      { q: 'What is a list comprehension?', options: ['A way to sort lists', 'A concise way to create lists', 'A method to delete lists', 'A type of loop'], answer: 1 },
      { q: 'Which method adds an element to the end of a list?', options: ['insert()', 'add()', 'append()', 'push()'], answer: 2 },
      { q: 'What does the "yield" keyword do?', options: ['Stops the program', 'Returns and pauses a generator', 'Deletes a variable', 'Creates a thread'], answer: 1 },
    ]
  },
  javascript: {
    title: 'JavaScript',
    questions: [
      { q: 'What is the result of typeof null?', options: ['"null"', '"undefined"', '"object"', '"number"'], answer: 2 },
      { q: 'Which method converts JSON string to object?', options: ['JSON.stringify()', 'JSON.parse()', 'JSON.convert()', 'JSON.object()'], answer: 1 },
      { q: 'What is a closure in JavaScript?', options: ['A syntax error', 'A function with access to its outer scope', 'A type of loop', 'A class'], answer: 1 },
      { q: 'What does "===" check?', options: ['Value only', 'Type only', 'Value and type', 'Reference'], answer: 2 },
      { q: 'Which is NOT a JavaScript data type?', options: ['Boolean', 'Float', 'Symbol', 'BigInt'], answer: 1 },
      { q: 'What is the event loop?', options: ['A for loop', 'Mechanism for async execution', 'A DOM event', 'A CSS animation'], answer: 1 },
      { q: 'What does "Promise.all()" do?', options: ['Runs one promise', 'Resolves when all promises resolve', 'Rejects all promises', 'Creates a new promise'], answer: 1 },
      { q: 'What is hoisting?', options: ['Moving declarations to the top', 'A design pattern', 'An error type', 'A loop type'], answer: 0 },
      { q: 'Which array method does NOT mutate the original?', options: ['push()', 'splice()', 'map()', 'sort()'], answer: 2 },
      { q: 'What is "this" in an arrow function?', options: ['The function itself', 'The global object', 'Inherited from enclosing scope', 'undefined'], answer: 2 },
    ]
  },
  react: {
    title: 'React.js',
    questions: [
      { q: 'What is JSX?', options: ['A database', 'JavaScript XML syntax extension', 'A CSS framework', 'A testing library'], answer: 1 },
      { q: 'Which hook manages state in functional components?', options: ['useEffect', 'useContext', 'useState', 'useReducer'], answer: 2 },
      { q: 'What is the Virtual DOM?', options: ['The actual DOM', 'A lightweight copy of the DOM', 'A CSS framework', 'A database'], answer: 1 },
      { q: 'What does useEffect do?', options: ['Manages state', 'Handles side effects', 'Creates components', 'Styles elements'], answer: 1 },
      { q: 'What is a React key used for?', options: ['Styling', 'Encryption', 'Unique identification in lists', 'Authentication'], answer: 2 },
      { q: 'What is props drilling?', options: ['A testing technique', 'Passing props through many levels', 'A state management tool', 'An API pattern'], answer: 1 },
      { q: 'Which is true about React components?', options: ['They must be classes', 'They can be functions or classes', 'They cannot have state', 'They cannot receive props'], answer: 1 },
      { q: 'What is React.memo used for?', options: ['Creating memos', 'Performance optimization via memoization', 'State management', 'Routing'], answer: 1 },
      { q: 'What does StrictMode do?', options: ['Blocks errors', 'Highlights potential problems', 'Improves performance', 'Enables dark mode'], answer: 1 },
      { q: 'What is the Context API for?', options: ['HTTP requests', 'Global state sharing without prop drilling', 'Routing', 'Animations'], answer: 1 },
    ]
  },
  sql: {
    title: 'SQL & Databases',
    questions: [
      { q: 'Which SQL command retrieves data?', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], answer: 2 },
      { q: 'What does JOIN do?', options: ['Deletes tables', 'Combines rows from multiple tables', 'Creates indexes', 'Drops databases'], answer: 1 },
      { q: 'What is a PRIMARY KEY?', options: ['Any column', 'A unique identifier for each row', 'A foreign table', 'A data type'], answer: 1 },
      { q: 'Which clause filters grouped results?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], answer: 1 },
      { q: 'What is normalization?', options: ['Deleting data', 'Organizing data to reduce redundancy', 'Encrypting data', 'Backing up data'], answer: 1 },
      { q: 'What is an INDEX used for?', options: ['Deleting rows', 'Faster data retrieval', 'Creating tables', 'Joining tables'], answer: 1 },
      { q: 'What is a FOREIGN KEY?', options: ['A primary key in another table', 'A key from a foreign database', 'An encryption key', 'A unique constraint'], answer: 0 },
      { q: 'What does DISTINCT do?', options: ['Sorts data', 'Removes duplicate rows', 'Counts rows', 'Groups data'], answer: 1 },
      { q: 'Which is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'MongoDB', 'Oracle'], answer: 2 },
      { q: 'What is a transaction?', options: ['A query', 'A unit of work that is atomic', 'A table', 'An index'], answer: 1 },
    ]
  },
  ml: {
    title: 'Machine Learning',
    questions: [
      { q: 'What is supervised learning?', options: ['Learning without labels', 'Learning with labeled data', 'Reinforcement learning', 'Clustering'], answer: 1 },
      { q: 'What is overfitting?', options: ['Model is too simple', 'Model memorizes training data', 'Model has no data', 'Model is fast'], answer: 1 },
      { q: 'Which is a classification algorithm?', options: ['Linear Regression', 'K-Means', 'Random Forest', 'PCA'], answer: 2 },
      { q: 'What is the purpose of a validation set?', options: ['Train the model', 'Tune hyperparameters', 'Deploy the model', 'Clean data'], answer: 1 },
      { q: 'What does gradient descent minimize?', options: ['Data size', 'Loss function', 'Feature count', 'Training time'], answer: 1 },
      { q: 'What is a neural network layer?', options: ['A database table', 'A set of connected nodes', 'A CSV file', 'A Python library'], answer: 1 },
      { q: 'What is the bias-variance tradeoff?', options: ['Speed vs accuracy', 'Underfitting vs overfitting balance', 'CPU vs GPU', 'Training vs testing'], answer: 1 },
      { q: 'What is cross-validation?', options: ['Testing on training data', 'Splitting data into k-folds for evaluation', 'Removing outliers', 'Feature scaling'], answer: 1 },
      { q: 'Which metric is used for classification?', options: ['MSE', 'R-squared', 'F1 Score', 'RMSE'], answer: 2 },
      { q: 'What is feature engineering?', options: ['Building hardware', 'Creating/transforming input features', 'Deploying models', 'Writing documentation'], answer: 1 },
    ]
  },
  dsa: {
    title: 'Data Structures & Algorithms',
    questions: [
      { q: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], answer: 2 },
      { q: 'Which data structure uses FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
      { q: 'What is a hash table?', options: ['A sorting algorithm', 'A key-value data structure', 'A linked list', 'A tree'], answer: 1 },
      { q: 'What is the worst case of quicksort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 2 },
      { q: 'What is a balanced binary tree?', options: ['All nodes have 2 children', 'Height difference between subtrees ≤ 1', 'All leaves are at same level', 'A sorted array'], answer: 1 },
      { q: 'Which traversal visits root first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], answer: 1 },
      { q: 'What is dynamic programming?', options: ['Using global variables', 'Solving problems by breaking into overlapping subproblems', 'A type of polymorphism', 'runtime compilation'], answer: 1 },
      { q: 'What is the space complexity of merge sort?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], answer: 2 },
      { q: 'What is a graph cycle?', options: ['A sorted path', 'A path that starts and ends at the same node', 'A disconnected graph', 'A tree'], answer: 1 },
      { q: 'Which algorithm finds shortest path?', options: ['DFS', 'Merge Sort', 'Dijkstra', 'Quick Sort'], answer: 2 },
    ]
  }
};

let quizTimer = null;

function startQuiz(topic) {
  const data = QUIZ_DATA[topic];
  if (!data) return;

  AppState.quizState = {
    topic,
    questions: data.questions,
    current: 0,
    answers: new Array(data.questions.length).fill(-1),
    startTime: Date.now(),
    timeLeft: 20 * 60
  };

  document.getElementById('quiz-selection').style.display = 'none';
  document.getElementById('quiz-active-section').style.display = 'block';
  document.getElementById('quiz-results-section').style.display = 'none';
  document.getElementById('quiz-total-q').textContent = data.questions.length;

  renderQuizQuestion();
  startQuizTimer();
}

function renderQuizQuestion() {
  const qs = AppState.quizState;
  const q = qs.questions[qs.current];
  document.getElementById('quiz-current-q').textContent = qs.current + 1;
  document.getElementById('quiz-progress-fill').style.width = ((qs.current + 1) / qs.questions.length * 100) + '%';
  document.getElementById('quiz-question-text').textContent = `Q${qs.current + 1}. ${q.q}`;

  const container = document.getElementById('quiz-options-container');
  container.innerHTML = '';
  q.options.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = `quiz-option ${qs.answers[qs.current] === i ? 'selected' : ''}`;
    div.onclick = () => selectQuizOption(i);
    div.innerHTML = `<div class="quiz-option-radio"></div>`;
    const span = document.createElement('span');
    span.textContent = opt;
    div.appendChild(span);
    container.appendChild(div);
  });

  document.getElementById('quiz-prev-btn').disabled = qs.current === 0;
  document.getElementById('quiz-next-btn').textContent = qs.current === qs.questions.length - 1 ? 'Submit ✓' : 'Next →';
}

function selectQuizOption(idx) {
  AppState.quizState.answers[AppState.quizState.current] = idx;
  renderQuizQuestion();
}

function quizNext() {
  const qs = AppState.quizState;
  if (qs.current === qs.questions.length - 1) {
    finishQuiz();
  } else {
    qs.current++;
    renderQuizQuestion();
  }
}

function quizPrev() {
  if (AppState.quizState.current > 0) {
    AppState.quizState.current--;
    renderQuizQuestion();
  }
}

function startQuizTimer() {
  if (quizTimer) clearInterval(quizTimer);
  quizTimer = setInterval(() => {
    AppState.quizState.timeLeft--;
    const mins = Math.floor(AppState.quizState.timeLeft / 60);
    const secs = AppState.quizState.timeLeft % 60;
    document.getElementById('quiz-timer-display').textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    if (AppState.quizState.timeLeft <= 0) {
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  if (quizTimer) clearInterval(quizTimer);
  const qs = AppState.quizState;
  let correct = 0;
  qs.questions.forEach((q, i) => {
    if (qs.answers[i] === q.answer) correct++;
  });
  const pct = Math.round((correct / qs.questions.length) * 100);

  document.getElementById('quiz-active-section').style.display = 'none';
  document.getElementById('quiz-results-section').style.display = 'block';
  document.getElementById('quiz-score-display').textContent = pct + '%';
  document.getElementById('quiz-result-text').textContent = `You got ${correct} out of ${qs.questions.length} correct.`;

  // Save to Supabase
  if (AppState.user && AppState.user.id && typeof saveQuizResult === 'function' && supabaseReady) {
    const timeTaken = Math.round((Date.now() - qs.startTime) / 1000);
    saveQuizResult(AppState.user.id, {
      topic: qs.topic,
      score: pct,
      totalQuestions: qs.questions.length,
      correctAnswers: correct,
      timeTaken: timeTaken,
      answers: qs.answers
    });
  }

  showToast(`Quiz completed! Score: ${pct}%`, pct >= 70 ? 'success' : 'warning');
}

function showQuizSelection() {
  document.getElementById('quiz-selection').style.display = 'block';
  document.getElementById('quiz-active-section').style.display = 'none';
  document.getElementById('quiz-results-section').style.display = 'none';
}

// ── Mock Interview ──
const INTERVIEW_QUESTIONS = {
  general: [
    'Tell me about yourself and your career aspirations.',
    'What are your greatest strengths and how do they apply to this role?',
    'Describe a challenging situation you faced and how you handled it.',
    'Where do you see yourself in 5 years?',
    'Why should we hire you? What makes you unique?'
  ],
  frontend: [
    'Explain the difference between CSS Grid and Flexbox. When would you use each?',
    'What is the Virtual DOM in React and why is it beneficial?',
    'How do you optimize the performance of a React application?',
    'Explain the concept of closures in JavaScript with an example.',
    'How would you implement responsive design for a complex dashboard?'
  ],
  backend: [
    'Explain the difference between SQL and NoSQL databases.',
    'How would you design a RESTful API for a social media platform?',
    'What is database indexing and when should you use it?',
    'Explain the concept of middleware in Express.js/FastAPI.',
    'How do you handle authentication and authorization in a backend system?'
  ],
  fullstack: [
    'Walk me through how a web request flows from browser to server and back.',
    'How would you design the architecture for a real-time chat application?',
    'Explain the difference between server-side and client-side rendering.',
    'How do you handle state management in a full-stack application?',
    'Describe your approach to testing in a full-stack project.'
  ],
  'data-science': [
    'Explain the bias-variance tradeoff in machine learning.',
    'How would you handle missing data in a large dataset?',
    'What is the difference between L1 and L2 regularization?',
    'Explain how a Random Forest algorithm works.',
    'How would you evaluate a classification model with imbalanced classes?'
  ],
  'system-design': [
    'Design a URL shortener like bit.ly. Explain your architecture.',
    'How would you design a notification system that can handle millions of users?',
    'Design a caching strategy for a high-traffic e-commerce website.',
    'How would you design a real-time leaderboard system?',
    'Explain how you would design a file storage system like Google Drive.'
  ]
};

function startInterview() {
  const domain = document.getElementById('interview-domain').value;
  const questions = INTERVIEW_QUESTIONS[domain] || INTERVIEW_QUESTIONS.general;

  AppState.interviewState = {
    domain,
    questions,
    currentQ: 0,
    answers: [],
    startTime: Date.now()
  };

  document.getElementById('interview-setup').style.display = 'none';
  document.getElementById('interview-active').style.display = 'block';
  document.getElementById('interview-feedback').style.display = 'none';
  document.getElementById('interview-domain-badge').textContent = domain.charAt(0).toUpperCase() + domain.slice(1);

  const chatArea = document.getElementById('chat-area');
  chatArea.innerHTML = '';
  addChatBubble('ai', `Welcome! I'm your AI interviewer. Let's begin the ${domain} interview. I'll ask you 5 questions. Take your time to answer each one.`);
  setTimeout(() => {
    addChatBubble('ai', questions[0]);
    updateInterviewQCount();
  }, 1000);
}

function addChatBubble(type, text) {
  const chatArea = document.getElementById('chat-area');
  const bubble = document.createElement('div');
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatArea.appendChild(bubble);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function sendInterviewAnswer() {
  const input = document.getElementById('interview-input');
  const answer = input.value.trim();
  if (!answer) return;

  const state = AppState.interviewState;
  addChatBubble('user', answer);
  state.answers.push(answer);
  input.value = '';

  state.currentQ++;
  updateInterviewQCount();

  if (state.currentQ < state.questions.length) {
    setTimeout(() => {
      const feedback = generateQuickFeedback(answer);
      addChatBubble('ai', feedback);
      setTimeout(() => {
        addChatBubble('ai', state.questions[state.currentQ]);
      }, 800);
    }, 600);
  } else {
    setTimeout(() => {
      addChatBubble('ai', 'Great job! That concludes our interview session. Let me prepare your feedback...');
      setTimeout(() => endInterview(), 2000);
    }, 600);
  }
}

function generateQuickFeedback(answer) {
  const feedbacks = [
    'Good answer! You explained the concept well. Let me ask the next question.',
    'Nice response! Consider adding more specific examples next time. Moving on...',
    'That was a solid answer. Try to be more concise for technical interviews. Next question:',
    'Interesting perspective! Adding real-world examples would strengthen your answer. Here\'s the next one:',
    'Well structured response! Keep it up. Next question:'
  ];
  return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}

function updateInterviewQCount() {
  const state = AppState.interviewState;
  document.getElementById('interview-q-count').textContent = `Q ${Math.min(state.currentQ + 1, state.questions.length)}/${state.questions.length}`;
}

function endInterview() {
  document.getElementById('interview-active').style.display = 'none';
  document.getElementById('interview-feedback').style.display = 'block';

  const overall = Math.floor(Math.random() * 3) + 7;
  const technical = Math.floor(Math.random() * 3) + 6;
  const communication = Math.floor(Math.random() * 3) + 7;

  // Save to Supabase
  if (AppState.user && AppState.user.id && typeof saveInterviewSession === 'function' && supabaseReady) {
    const state = AppState.interviewState;
    saveInterviewSession(AppState.user.id, {
      domain: state.domain,
      overallScore: overall,
      technicalScore: technical,
      communicationScore: communication,
      questions: state.questions,
      answers: state.answers,
      feedback: { strengths: ['Core concepts', 'Structured communication'], improvements: ['Add examples', 'Be concise'] }
    });
  }

  document.getElementById('fb-overall').textContent = `${overall}/10`;
  document.getElementById('fb-technical').textContent = `${technical}/10`;
  document.getElementById('fb-communication').textContent = `${communication}/10`;

  document.getElementById('interview-feedback-details').innerHTML = `
    <div class="glass-card" style="padding:16px;margin-bottom:12px;">
      <h5 style="color:var(--success-400);margin-bottom:8px;">✅ Strengths</h5>
      <ul style="padding-left:20px;color:var(--text-secondary);font-size:0.9rem;">
        <li style="list-style:disc;margin-bottom:4px;">Good understanding of core concepts</li>
        <li style="list-style:disc;margin-bottom:4px;">Clear and structured communication</li>
        <li style="list-style:disc;margin-bottom:4px;">Showed problem-solving ability</li>
      </ul>
    </div>
    <div class="glass-card" style="padding:16px;">
      <h5 style="color:var(--warning-400);margin-bottom:8px;">📝 Areas to Improve</h5>
      <ul style="padding-left:20px;color:var(--text-secondary);font-size:0.9rem;">
        <li style="list-style:disc;margin-bottom:4px;">Add more specific real-world examples</li>
        <li style="list-style:disc;margin-bottom:4px;">Practice being more concise in technical explanations</li>
        <li style="list-style:disc;margin-bottom:4px;">Mention trade-offs when discussing design decisions</li>
      </ul>
    </div>
  `;

  showToast('Interview feedback ready!', 'success');
}

function showInterviewSetup() {
  document.getElementById('interview-setup').style.display = 'block';
  document.getElementById('interview-active').style.display = 'none';
  document.getElementById('interview-feedback').style.display = 'none';
}

// ── Progress Tracking ──
function renderProgress() {
  drawProgressQuizChart();
  drawProgressSkillChart();
  renderProgressTimeline();
}

function drawProgressQuizChart() {
  const canvas = document.getElementById('progress-quiz-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const data = [65, 70, 68, 75, 80, 72, 85, 78, 82, 88, 85, 90];
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const padL = 40, padB = 30, padT = 20, padR = 20;
  const chartW = w - padL - padR, chartH = h - padT - padB;

  // Y-axis
  for (let i = 0; i <= 5; i++) {
    const y = padT + (chartH / 5) * i;
    const val = 100 - (i * 20);
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(w - padR, y);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    ctx.stroke();
    ctx.fillStyle = '#64748b';
    ctx.font = '500 10px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(val + '%', padL - 8, y + 4);
  }

  // Line
  const grad = ctx.createLinearGradient(0, padT, 0, h - padB);
  grad.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
  grad.addColorStop(1, 'rgba(99, 102, 241, 0)');

  ctx.beginPath();
  data.forEach((val, i) => {
    const x = padL + (chartW / (data.length - 1)) * i;
    const y = padT + chartH - (val / 100) * chartH;
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.strokeStyle = 'var(--primary)';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Fill
  ctx.lineTo(padL + chartW, padT + chartH);
  ctx.lineTo(padL, padT + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Dots & labels
  data.forEach((val, i) => {
    const x = padL + (chartW / (data.length - 1)) * i;
    const y = padT + chartH - (val / 100) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'var(--primary-400)';
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.font = '500 9px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(labels[i], x, h - 8);
  });
}

function drawProgressSkillChart() {
  const canvas = document.getElementById('progress-skill-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const skills = ['JS', 'Python', 'React', 'SQL', 'Node', 'Git'];
  const before = [55, 60, 40, 45, 30, 50];
  const after = [78, 85, 72, 68, 55, 70];
  const barW = 22, groupGap = (w - skills.length * (barW * 2 + 6)) / (skills.length + 1);

  skills.forEach((skill, i) => {
    const gx = groupGap + i * (barW * 2 + 6 + groupGap);
    const bH = (before[i] / 100) * (h - 50);
    const aH = (after[i] / 100) * (h - 50);

    // Before bar
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(gx, h - 30 - bH, barW, bH, [4, 4, 0, 0]);
    } else {
      ctx.rect(gx, h - 30 - bH, barW, bH);
    }
    ctx.fill();

    // After bar
    const grad = ctx.createLinearGradient(0, h - 30 - aH, 0, h - 30);
    grad.addColorStop(0, 'var(--accent)');
    grad.addColorStop(1, 'var(--primary)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(gx + barW + 6, h - 30 - aH, barW, aH, [4, 4, 0, 0]);
    } else {
      ctx.rect(gx + barW + 6, h - 30 - aH, barW, aH);
    }
    ctx.fill();

    // Label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(skill, gx + barW + 3, h - 14);
  });

  // Legend
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(w - 110, 10, 12, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.font = '500 10px Inter, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('Before', w - 92, 20);

  const lgrd = ctx.createLinearGradient(w - 110, 0, w - 98, 0);
  lgrd.addColorStop(0, '#6366f1');
  lgrd.addColorStop(1, '#a855f7');
  ctx.fillStyle = lgrd;
  ctx.fillRect(w - 110, 30, 12, 12);
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('After', w - 92, 40);
}

function renderProgressTimeline() {
  const events = [
    { icon: '📄', text: 'Uploaded and analyzed resume – Score: 72/100', time: '2 hours ago', color: 'var(--primary-500)' },
    { icon: '✅', text: 'Completed Python Quiz – Score: 85%', time: '5 hours ago', color: 'var(--success-500)' },
    { icon: '🎤', text: 'Mock Interview Session – Overall: 7/10', time: 'Yesterday', color: 'var(--accent-500)' },
    { icon: '📚', text: 'Completed Week 3: Advanced React & State', time: '2 days ago', color: 'var(--warning-500)' },
    { icon: '🎯', text: 'Skill gap analysis for Full Stack Developer role', time: '3 days ago', color: 'var(--primary-500)' },
    { icon: '✅', text: 'Completed JavaScript Quiz – Score: 78%', time: '4 days ago', color: 'var(--success-500)' },
    { icon: '📄', text: 'Resume updated with new projects section', time: '1 week ago', color: 'var(--primary-500)' },
    { icon: '🎤', text: 'First Mock Interview Completed – Overall: 6/10', time: '1 week ago', color: 'var(--accent-500)' },
  ];

  document.getElementById('progress-timeline').innerHTML = events.map(e => `
    <div class="activity-item">
      <div class="activity-dot" style="background:${e.color};"></div>
      <div style="flex:1;">
        <div class="activity-text">${e.icon} ${e.text}</div>
        <div class="activity-time">${e.time}</div>
      </div>
    </div>
  `).join('');
}

// ── Resources ──
const RESOURCES = [
  { type: 'video', title: 'React.js Full Course 2026', desc: 'Complete React course covering hooks, state management, and modern patterns.', icon: '🎬', gradient: 'var(--gradient-primary)', tag: 'React' },
  { type: 'course', title: 'Python for Data Science', desc: 'Master Python with NumPy, Pandas, and Matplotlib for data analysis.', icon: '📊', gradient: 'var(--gradient-accent)', tag: 'Python' },
  { type: 'article', title: 'System Design Interview Guide', desc: 'Comprehensive guide covering load balancers, caching, and distributed systems.', icon: '📝', gradient: 'var(--gradient-success)', tag: 'System Design' },
  { type: 'tutorial', title: 'Building REST APIs with FastAPI', desc: 'Step-by-step tutorial on building production-grade APIs with Python FastAPI.', icon: '🔧', gradient: 'var(--gradient-warm)', tag: 'Backend' },
  { type: 'video', title: 'JavaScript: The Hard Parts', desc: 'Deep dive into closures, prototypes, async/await, and the event loop.', icon: '🎬', gradient: 'var(--gradient-primary)', tag: 'JavaScript' },
  { type: 'course', title: 'Machine Learning A-Z', desc: 'Comprehensive ML course from linear regression to neural networks.', icon: '🤖', gradient: 'var(--gradient-accent)', tag: 'ML' },
  { type: 'article', title: 'Docker & Kubernetes Guide', desc: 'Learn containerization and orchestration for modern application deployment.', icon: '📝', gradient: 'var(--gradient-success)', tag: 'DevOps' },
  { type: 'tutorial', title: 'SQL Mastery: From Zero to Hero', desc: 'Interactive SQL tutorial covering joins, subqueries, and optimization.', icon: '🔧', gradient: 'var(--gradient-warm)', tag: 'Database' },
  { type: 'video', title: 'Git & GitHub for Professionals', desc: 'Master version control with advanced Git workflows and collaboration.', icon: '🎬', gradient: 'var(--gradient-primary)', tag: 'Git' },
  { type: 'course', title: 'TypeScript Complete Guide', desc: 'Learn TypeScript from basics to advanced types and generics.', icon: '📘', gradient: 'var(--gradient-accent)', tag: 'TypeScript' },
  { type: 'article', title: 'Resume Writing Best Practices', desc: 'Expert tips on crafting ATS-friendly resumes that stand out.', icon: '📝', gradient: 'var(--gradient-success)', tag: 'Career' },
  { type: 'tutorial', title: 'DSA Problem Solving Patterns', desc: 'Learn the most common algorithm patterns for coding interviews.', icon: '🔧', gradient: 'var(--gradient-warm)', tag: 'DSA' },
];

function renderResources(filter = 'all') {
  const filtered = filter === 'all' ? RESOURCES : RESOURCES.filter(r => r.type === filter);
  const grid = document.getElementById('resources-grid');
  grid.innerHTML = filtered.map(r => `
    <div class="resource-card glass-card" data-type="${r.type}">
      <div class="resource-thumb" style="background:${r.gradient};">${r.icon}</div>
      <div class="resource-body">
        <div class="resource-type">${r.type}</div>
        <h4>${r.title}</h4>
        <p>${r.desc}</p>
        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:12px;">
          <span class="tag">${r.tag}</span>
          <button class="btn btn-sm btn-outline">Open →</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterResources(type, tabEl) {
  document.querySelectorAll('.tabs .tab').forEach(t => t.classList.remove('active'));
  if (tabEl) tabEl.classList.add('active');
  renderResources(type);
}
