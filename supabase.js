/* ============================================
   VidyaMitra – Supabase Integration
   Database client, auth, and data operations
   ============================================ */

// ── Supabase Configuration ──
// IMPORTANT: Replace SUPABASE_ANON_KEY with your actual anon/public key
// Find it at: Supabase Dashboard → Settings → API → anon public key
const SUPABASE_URL = 'https://hdqwjuqicvdntkrhhkrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkcXdqdXFpY3ZkbnRrcmhoa3JuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyNjE3MjQsImV4cCI6MjA1NjgzNzcyNH0.S_publishable_ptTHibcA3G6ZDesqe3CnPA_1EX11LQ';

let supabase = null;
let supabaseReady = false;

// Initialize Supabase client
function initSupabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    supabaseReady = true;
    console.log('✅ Supabase connected');
    checkAuthState();
  } else {
    console.warn('⚠️ Supabase library not loaded. Using localStorage fallback.');
    supabaseReady = false;
  }
}

// ── Auth State Check ──
async function checkAuthState() {
  if (!supabaseReady) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const profile = await getProfile(session.user.id);
      if (profile) {
        AppState.user = {
          id: session.user.id,
          name: profile.full_name,
          email: session.user.email,
          domain: profile.domain,
          skills: profile.skills,
          role: profile.target_role,
          exp: profile.experience_level,
          supabaseAuth: true
        };
        localStorage.setItem('vm_current_user', JSON.stringify(AppState.user));
        updateNavAuth();
      }
    }
  } catch (err) {
    console.error('Auth check error:', err);
  }
}

// ── Supabase Auth: Sign Up ──
async function supabaseSignUp(name, email, password, domain) {
  if (!supabaseReady) return { success: false, error: 'Supabase not connected' };

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { 
          full_name: name,
          domain: domain
        }
      }
    });

    if (error) return { success: false, error: error.message };

    // Profile creation is handled automatically by the database trigger
    // logging activity will happen after the user is confirmed or logged in
    
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Supabase Auth: Sign In ──
async function supabaseSignIn(email, password) {
  if (!supabaseReady) return { success: false, error: 'Supabase not connected' };

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) return { success: false, error: error.message };

    return { success: true, user: data.user, session: data.session };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Supabase Auth: Sign Out ──
async function supabaseSignOut() {
  if (!supabaseReady) return;
  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.error('Sign out error:', err);
  }
}

// ── Profile Operations ──
async function getProfile(userId) {
  if (!supabaseReady) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  } catch (err) {
    console.error('Get profile error:', err);
    return null;
  }
}

async function updateProfile(userId, updates) {
  if (!supabaseReady) return false;
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId);
    if (error) throw error;
    await logActivity(userId, 'profile_update', 'Profile information updated');
    return true;
  } catch (err) {
    console.error('Update profile error:', err);
    return false;
  }
}

// ── Resume Analysis Operations ──
async function saveResumeAnalysis(userId, analysisData) {
  if (!supabaseReady) return null;
  try {
    const { data, error } = await supabase
      .from('resume_analyses')
      .insert({
        user_id: userId,
        file_name: analysisData.fileName,
        overall_score: analysisData.overallScore,
        formatting_score: analysisData.formatting,
        skills_score: analysisData.skills,
        experience_score: analysisData.experience,
        education_score: analysisData.education,
        projects_score: analysisData.projects,
        keywords_score: analysisData.keywords,
        detected_skills: analysisData.detectedSkills,
        recommendations: analysisData.recommendations
      })
      .select()
      .single();
    if (error) throw error;
    await logActivity(userId, 'resume_analysis', `Resume analyzed – Score: ${analysisData.overallScore}/100`);
    return data;
  } catch (err) {
    console.error('Save resume error:', err);
    return null;
  }
}

async function getResumeHistory(userId) {
  if (!supabaseReady) return [];
  try {
    const { data, error } = await supabase
      .from('resume_analyses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Get resume history error:', err);
    return [];
  }
}

// ── Quiz Results Operations ──
async function saveQuizResult(userId, quizData) {
  if (!supabaseReady) return null;
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        topic: quizData.topic,
        score: quizData.score,
        total_questions: quizData.totalQuestions,
        correct_answers: quizData.correctAnswers,
        time_taken_seconds: quizData.timeTaken,
        answers: quizData.answers
      })
      .select()
      .single();
    if (error) throw error;
    await logActivity(userId, 'quiz', `Completed ${quizData.topic} quiz – Score: ${quizData.score}%`);
    return data;
  } catch (err) {
    console.error('Save quiz error:', err);
    return null;
  }
}

async function getQuizHistory(userId) {
  if (!supabaseReady) return [];
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Get quiz history error:', err);
    return [];
  }
}

// ── Interview Session Operations ──
async function saveInterviewSession(userId, interviewData) {
  if (!supabaseReady) return null;
  try {
    const { data, error } = await supabase
      .from('interview_sessions')
      .insert({
        user_id: userId,
        domain: interviewData.domain,
        overall_score: interviewData.overallScore,
        technical_score: interviewData.technicalScore,
        communication_score: interviewData.communicationScore,
        questions: interviewData.questions,
        answers: interviewData.answers,
        feedback: interviewData.feedback
      })
      .select()
      .single();
    if (error) throw error;
    await logActivity(userId, 'interview', `Mock interview completed – Score: ${interviewData.overallScore}/10`);
    return data;
  } catch (err) {
    console.error('Save interview error:', err);
    return null;
  }
}

// ── Learning Progress Operations ──
async function saveLearningProgress(userId, weekNumber, completed) {
  if (!supabaseReady) return false;
  try {
    const { error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        week_number: weekNumber,
        completed: completed,
        completed_at: completed ? new Date().toISOString() : null
      }, { onConflict: 'user_id, week_number' });
    if (error) throw error;
    if (completed) {
      await logActivity(userId, 'learning', `Completed Week ${weekNumber} of Learning Plan`);
    }
    return true;
  } catch (err) {
    console.error('Save progress error:', err);
    return false;
  }
}

async function getLearningProgress(userId) {
  if (!supabaseReady) return [];
  try {
    const { data, error } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId)
      .order('week_number', { ascending: true });
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Get learning progress error:', err);
    return [];
  }
}

// ── Activity Log ──
async function logActivity(userId, type, description, metadata = {}) {
  if (!supabaseReady) return;
  try {
    await supabase.from('activity_log').insert({
      user_id: userId,
      activity_type: type,
      description: description,
      metadata: metadata
    });
  } catch (err) {
    console.error('Log activity error:', err);
  }
}

async function getActivityLog(userId, limit = 10) {
  if (!supabaseReady) return [];
  try {
    const { data, error } = await supabase
      .from('activity_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Get activity error:', err);
    return [];
  }
}

// ── Dashboard Stats ──
async function getDashboardStats(userId) {
  if (!supabaseReady) return null;
  try {
    const [resumes, quizzes, interviews] = await Promise.all([
      getResumeHistory(userId),
      getQuizHistory(userId),
      supabase.from('interview_sessions').select('*').eq('user_id', userId)
    ]);

    const latestResume = resumes[0];
    const avgQuizScore = quizzes.length > 0
      ? Math.round(quizzes.reduce((sum, q) => sum + q.score, 0) / quizzes.length)
      : 0;

    return {
      resumeScore: latestResume ? latestResume.overall_score : 0,
      quizCount: quizzes.length,
      avgQuizScore: avgQuizScore,
      interviewCount: interviews.data ? interviews.data.length : 0,
    };
  } catch (err) {
    console.error('Dashboard stats error:', err);
    return null;
  }
}

// ── Initialize on page load ──
document.addEventListener('DOMContentLoaded', () => {
  // Wait a bit for Supabase CDN script to load
  setTimeout(initSupabase, 500);
});
