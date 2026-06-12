/* ============================================
   VidyaMitra – Application Logic (Part 1)
   Navigation, Auth, Dashboard, Resume
   ============================================ */

// ── State Management ──
const AppState = {
  currentPage: 'landing',
  user: null,
  quizState: null,
  interviewState: null,
};

// ── Navigation ──
function navigate(page) {
  // hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    AppState.currentPage = page;
  }

  // Update nav links
  document.querySelectorAll('.navbar-nav a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('data-page') === page);
  });

  // Update sidebar items
  document.querySelectorAll('.sidebar-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-page') === page);
  });

  // Show/hide sidebar
  const isApp = !['landing', 'login', 'register'].includes(page);
  const sidebar = document.getElementById('sidebar');
  const mainContents = document.querySelectorAll('.main-content');
  if (AppState.user && isApp) {
    sidebar.style.display = 'block';
    mainContents.forEach(mc => mc.style.marginLeft = 'var(--sidebar-width)');
  } else {
    sidebar.style.display = 'none';
    mainContents.forEach(mc => mc.style.marginLeft = '0');
  }

  // Update nav buttons
  updateNavAuth();

  // Page-specific init
  if (page === 'dashboard') initDashboard();
  if (page === 'skills') updateSkillAnalysis();
  if (page === 'careers') renderCareers();
  if (page === 'learning') renderLearningPlan();
  if (page === 'resources') renderResources();
  if (page === 'progress') renderProgress();
  if (page === 'profile') initProfile();

  window.scrollTo(0, 0);
  return false;
}

function updateNavAuth() {
  const loginBtn = document.getElementById('nav-login-btn');
  const userEl = document.getElementById('nav-user');
  if (AppState.user) {
    loginBtn.style.display = 'none';
    userEl.style.display = 'flex';
    document.getElementById('nav-avatar').textContent = AppState.user.name.charAt(0).toUpperCase();
    document.getElementById('nav-username').textContent = AppState.user.name.split(' ')[0];
  } else {
    loginBtn.style.display = 'inline-flex';
    userEl.style.display = 'none';
  }
}

// ── Authentication ──
async function handleLogin(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  // Try Supabase first
  if (typeof supabaseSignIn === 'function' && supabaseReady) {
    showToast('Signing in...', 'info');
    const result = await supabaseSignIn(email, password);
    if (result.success) {
      const profile = await getProfile(result.user.id);
      loginUser({
        id: result.user.id,
        name: profile ? profile.full_name : 'User',
        email: email,
        domain: profile ? profile.domain : 'software',
        skills: profile ? profile.skills : '',
        role: profile ? profile.target_role : '',
        exp: profile ? profile.experience_level : 'fresher',
        supabaseAuth: true
      });
      showToast('Welcome back!', 'success');
      return;
    } else {
      showToast(result.error || 'Login failed', 'error');
      return;
    }
  }

  // Fallback: localStorage
  const stored = localStorage.getItem('vm_users');
  const users = stored ? JSON.parse(stored) : [];
  const user = users.find(u => u.email === email);
  if (user) {
    loginUser(user);
  } else {
    showToast('No account found. Try the demo account!', 'warning');
  }
}

function handleDemoLogin() {
  const demo = {
    name: 'Rishi Kumar',
    email: 'rishi@demo.com',
    domain: 'software',
    skills: 'Python, JavaScript, React, SQL, Machine Learning',
    role: 'Full Stack Developer',
    exp: 'junior'
  };
  loginUser(demo);
}

async function handleRegister(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const domain = document.getElementById('reg-domain').value;

  // Try Supabase first
  if (typeof supabaseSignUp === 'function' && supabaseReady) {
    showToast('Creating account...', 'info');
    const result = await supabaseSignUp(name, email, password, domain);
    if (result.success) {
      loginUser({
        id: result.user.id,
        name: name,
        email: email,
        domain: domain,
        skills: '',
        role: '',
        exp: 'fresher',
        supabaseAuth: true
      });
      showToast('Account created! Welcome to VidyaMitra.', 'success');
      return;
    } else {
      showToast(result.error || 'Registration failed', 'error');
      return;
    }
  }

  // Fallback: localStorage
  const user = { name, email, domain, skills: '', role: '', exp: 'fresher' };
  const stored = localStorage.getItem('vm_users');
  const users = stored ? JSON.parse(stored) : [];
  users.push(user);
  localStorage.setItem('vm_users', JSON.stringify(users));
  loginUser(user);
  showToast('Account created successfully! Welcome to VidyaMitra.', 'success');
}

function loginUser(user) {
  AppState.user = user;
  localStorage.setItem('vm_current_user', JSON.stringify(user));
  navigate('dashboard');
}

async function logout() {
  if (typeof supabaseSignOut === 'function' && supabaseReady) {
    await supabaseSignOut();
  }
  AppState.user = null;
  localStorage.removeItem('vm_current_user');
  navigate('landing');
  showToast('Signed out successfully.', 'success');
}

function toggleUserMenu() {
  logout();
}


// ── Dashboard ──
function initDashboard() {
  if (!AppState.user) return;
  document.getElementById('dash-username').textContent = AppState.user.name.split(' ')[0];
  drawSkillsChart();
}

function drawSkillsChart() {
  const canvas = document.getElementById('skills-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const skills = ['Python', 'JavaScript', 'React', 'SQL', 'Node.js', 'ML'];
  const values = [85, 78, 72, 68, 55, 45];
  const barW = 40, gap = (w - skills.length * barW) / (skills.length + 1);

  skills.forEach((skill, i) => {
    const x = gap + i * (barW + gap);
    const barH = (values[i] / 100) * (h - 50);
    const y = h - 30 - barH;

    // gradient bar
    const grad = ctx.createLinearGradient(x, y, x, h - 30);
    grad.addColorStop(0, '#818cf8');
    grad.addColorStop(1, '#6366f1');
    ctx.fillStyle = grad;
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, barW, barH, [6, 6, 0, 0]);
    } else {
      ctx.rect(x, y, barW, barH);
    }
    ctx.fill();

    // value
    ctx.fillStyle = '#f1f5f9';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(values[i] + '%', x + barW / 2, y - 8);

    // label
    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 10px Inter, sans-serif';
    ctx.fillText(skill, x + barW / 2, h - 14);
  });
}

// ── Resume Upload ──
function handleResumeUpload(e) {
  const file = e.target.files[0];
  if (!file) return;
  showToast('Analyzing resume...', 'success');
  setTimeout(() => {
    showResumeAnalysis();
  }, 1500);
}

// Setup drag and drop
document.addEventListener('DOMContentLoaded', () => {
  const uploadArea = document.getElementById('upload-area');
  if (uploadArea) {
    uploadArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadArea.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', () => {
      uploadArea.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      if (file) {
        showToast('Analyzing resume...', 'success');
        setTimeout(() => showResumeAnalysis(), 1500);
      }
    });
  }
});

function showResumeAnalysis() {
  document.getElementById('resume-upload-section').style.display = 'none';
  const section = document.getElementById('resume-analysis-section');
  section.style.display = 'block';

  // Recommendations
  const recs = [
    { icon: '✅', text: 'Good formatting and structure detected.', type: 'success' },
    { icon: '⚠️', text: 'Add more quantifiable achievements to your experience section.', type: 'warning' },
    { icon: '⚠️', text: 'Include more industry-specific keywords like "REST API", "CI/CD", "Agile".', type: 'warning' },
    { icon: '💡', text: 'Consider adding a professional summary at the top of your resume.', type: 'primary' },
    { icon: '✅', text: 'Education section is well-structured.', type: 'success' },
    { icon: '⚠️', text: 'Add links to your GitHub profile and live projects.', type: 'warning' },
    { icon: '💡', text: 'Tailor your skills section to match the target job description.', type: 'primary' },
  ];
  document.getElementById('resume-recommendations').innerHTML = recs.map(r =>
    `<div style="display:flex;align-items:flex-start;gap:10px;padding:10px 0;border-bottom:1px solid var(--border-color);">
      <span style="font-size:1.1rem;">${r.icon}</span>
      <span style="font-size:0.9rem;color:var(--text-secondary);">${r.text}</span>
    </div>`
  ).join('');

  // Skills
  const skills = ['Python', 'JavaScript', 'React', 'SQL', 'HTML/CSS', 'Git', 'Machine Learning', 'Node.js'];
  document.getElementById('detected-skills').innerHTML = skills.map(s =>
    `<span class="tag">${s}</span>`
  ).join('');
}

function resetResumeUpload() {
  document.getElementById('resume-upload-section').style.display = 'block';
  document.getElementById('resume-analysis-section').style.display = 'none';
  document.getElementById('resume-file').value = '';
}

// ── Resume Builder ──
function generateResumePreview() {
  const name = document.getElementById('rb-name').value || 'Your Name';
  const email = document.getElementById('rb-email').value || 'email@example.com';
  const phone = document.getElementById('rb-phone').value || '';
  const location = document.getElementById('rb-location').value || '';
  const linkedin = document.getElementById('rb-linkedin').value || '';
  const github = document.getElementById('rb-github').value || '';
  
  const summary = document.getElementById('rb-summary').value || '';
  const skills = document.getElementById('rb-skills').value || '';
  const experience = document.getElementById('rb-experience').value || '';
  const education = document.getElementById('rb-education').value || '';
  const projects = document.getElementById('rb-projects').value || '';

  const template = document.getElementById('rb-template-select').value || 'modern';
  const preview = document.getElementById('resume-preview');
  
  // Clean up classes
  preview.className = 'resume-' + template;
  
  const contactInfo = [email, phone, location, linkedin, github].filter(Boolean).join(' | ');

  let html = '';

  if (template === 'modern') {
    html = `
      <div class="resume-header">
        <h2>${name}</h2>
        <p>${contactInfo}</p>
      </div>
      <div class="resume-main">
        ${summary ? `<div class="resume-section"><div class="section-title">Summary</div><p>${summary}</p></div>` : ''}
        ${skills ? `<div class="resume-section"><div class="section-title">Skills</div><p>${skills}</p></div>` : ''}
        ${experience ? `<div class="resume-section"><div class="section-title">Experience</div><div style="white-space:pre-line;">${experience}</div></div>` : ''}
        ${education ? `<div class="resume-section"><div class="section-title">Education</div><div style="white-space:pre-line;">${education}</div></div>` : ''}
        ${projects ? `<div class="resume-section"><div class="section-title">Projects & Certifications</div><div style="white-space:pre-line;">${projects}</div></div>` : ''}
      </div>
    `;
  } else if (template === 'creative') {
    html = `
      <div class="resume-sidebar">
        <h2>${name.split(' ')[0]}</h2>
        <div style="margin-top:20px;">
          <div class="section-title" style="color:white !important;border:none;padding:0;font-size:0.8rem;">Contact</div>
          <p style="font-size:0.8rem;word-break:break-all;">${email}<br>${phone}<br>${location}</p>
          ${linkedin ? `<p style="font-size:0.8rem;">LI: ${linkedin.replace(/https?:\/\//,'')}</p>` : ''}
          ${github ? `<p style="font-size:0.8rem;">GH: ${github.replace(/https?:\/\//,'')}</p>` : ''}
        </div>
        ${skills ? `
        <div style="margin-top:30px;">
          <div class="section-title" style="color:white !important;border:none;padding:0;font-size:0.8rem;">Skills</div>
          <p style="font-size:0.8rem;">${skills}</p>
        </div>` : ''}
      </div>
      <div class="resume-main">
        <div class="resume-header">
          <h2 style="font-size:2rem;">${name}</h2>
          <p style="color:var(--primary-500) !important;font-weight:600;">Professional Profile</p>
        </div>
        ${summary ? `<div class="resume-section"><div class="section-title">Profile</div><p>${summary}</p></div>` : ''}
        ${experience ? `<div class="resume-section"><div class="section-title">Experience</div><div style="white-space:pre-line;">${experience}</div></div>` : ''}
        ${education ? `<div class="resume-section"><div class="section-title">Education</div><div style="white-space:pre-line;">${education}</div></div>` : ''}
        ${projects ? `<div class="resume-section"><div class="section-title">Key Projects</div><div style="white-space:pre-line;">${projects}</div></div>` : ''}
      </div>
    `;
  } else if (template === 'executive') {
    html = `
      <div class="resume-header">
        <h2>${name}</h2>
        <p style="font-style:italic;">${contactInfo}</p>
      </div>
      <div class="resume-content">
        ${summary ? `<div class="section-title">Professional Executive Summary</div><p style="text-align:justify;">${summary}</p>` : ''}
        ${skills ? `<div class="section-title">Core Competencies</div><p style="text-align:center;">${skills.split(',').join(' • ')}</p>` : ''}
        ${experience ? `<div class="section-title">Professional Experience</div><div style="white-space:pre-line;">${experience}</div>` : ''}
        ${education ? `<div class="section-title">Academic Background</div><div style="white-space:pre-line;">${education}</div>` : ''}
        ${projects ? `<div class="section-title">Strategic Projects</div><div style="white-space:pre-line;">${projects}</div>` : ''}
      </div>
    `;
  }

  preview.innerHTML = html;
  showToast('Professional Resume generated!', 'success');
}

function downloadResume() {
  window.print();
}

// ── Profile ──
function initProfile() {
  if (!AppState.user) return;
  const u = AppState.user;
  document.getElementById('profile-avatar').textContent = u.name.charAt(0).toUpperCase();
  document.getElementById('profile-name').textContent = u.name;
  document.getElementById('profile-email').textContent = u.email;
  document.getElementById('profile-name-input').value = u.name;
  document.getElementById('profile-email-input').value = u.email;
  if (u.role) document.getElementById('profile-role').value = u.role;
  if (u.skills) document.getElementById('profile-skills').value = u.skills;
}

async function saveProfile(e) {
  e.preventDefault();
  AppState.user.name = document.getElementById('profile-name-input').value;
  AppState.user.email = document.getElementById('profile-email-input').value;
  AppState.user.role = document.getElementById('profile-role').value;
  AppState.user.skills = document.getElementById('profile-skills').value;
  AppState.user.exp = document.getElementById('profile-exp').value;
  localStorage.setItem('vm_current_user', JSON.stringify(AppState.user));

  // Sync to Supabase
  if (AppState.user.id && typeof updateProfile === 'function' && supabaseReady) {
    await updateProfile(AppState.user.id, {
      full_name: AppState.user.name,
      target_role: AppState.user.role,
      skills: AppState.user.skills,
      experience_level: AppState.user.exp
    });
  }

  initProfile();
  updateNavAuth();
  showToast('Profile saved successfully!', 'success');
}

// ── Toast Notifications ──
function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span style="font-size:1.2rem;">${icons[type] || '✅'}</span><span style="font-size:0.9rem;">${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100px)';
    toast.style.transition = 'all 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── Init on load ──
document.addEventListener('DOMContentLoaded', () => {
  const stored = localStorage.getItem('vm_current_user');
  if (stored) {
    AppState.user = JSON.parse(stored);
    updateNavAuth();
  }

  // Initialize Theme
  let savedTheme = localStorage.getItem('vm_theme') || 'dark';
  if (savedTheme === 'system') savedTheme = 'dark'; // Auto-migrate from old system setting
  applyTheme(savedTheme);

  // URL-based routing & login check
  const params = new URLSearchParams(window.location.search);
  const pageParam = params.get('page');

  if (pageParam) {
    navigate(pageParam);
  } else if (AppState.user) {
    navigate('dashboard');
  } else {
    navigate('landing');
  }
});

// ── Theme Switching ──
function toggleThemeCycle() {
  const current = localStorage.getItem('vm_theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  
  applyTheme(next);
  localStorage.setItem('vm_theme', next);
  
  const labels = { dark: 'Dark Mode', light: 'Light Mode' };
  showToast(`Theme set to ${labels[next]}`, 'info');
}

function applyTheme(t) {
  const btn = document.getElementById('theme-btn');
  const icons = { dark: '🌙', light: '☀️' };
  const tooltips = { dark: 'Dark Mode', light: 'Light Mode' };
  
  if (btn) {
    btn.textContent = icons[t];
    btn.title = tooltips[t];
  }

  document.documentElement.setAttribute('data-theme', t);
}
