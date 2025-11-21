// Mock API using localStorage so the frontend works without a backend.
// This provides minimal implementations for the endpoints used by the UI.

function readDB(){
  const raw = localStorage.getItem('cf_mock_db')
  if(!raw) {
    const init = { users: [], classes: [], projects: [], submissions: [] }
    localStorage.setItem('cf_mock_db', JSON.stringify(init))
    return init
  }
  return JSON.parse(raw)
}

function writeDB(db){
  localStorage.setItem('cf_mock_db', JSON.stringify(db))
}

function generateId(){
  return 'id_' + Date.now().toString(36) + Math.random().toString(36).slice(2,9)
}

async function delay(ms=200){ return new Promise(r=>setTimeout(r, ms)) }

export default {
  // GET /classes, /projects, /projects/:id, /submissions/project/:id
  get: async (path) => {
    await delay()
    const db = readDB()
    if(path === '/classes') return { classes: db.classes }
    if(path === '/projects') return { projects: db.projects }
    if(path.startsWith('/projects/')){
      const id = path.split('/')[2]
      const p = db.projects.find(x=>x.id===id)
      if(!p) throw new Error('not found')
      return { project: p }
    }
    if(path.startsWith('/submissions/project/')){
      const id = path.split('/')[3]
      const subs = db.submissions.filter(s=>s.project_id===id)
      return { submissions: subs }
    }
    return {}
  },

  // POST handlers for /auth/login, /auth/register, /projects, /classes, /submissions/:id, /ai/parse
  post: async (path, body) => {
    await delay()
    const db = readDB()
    if(path === '/auth/register'){
      const { role, first_name, last_name, email, password, institution, company_name } = body
      if(!role || !email || !password) throw new Error('role,email,password required')
      if(db.users.find(u=>u.email===email)) throw new Error('email already registered')
      const user = { id: generateId(), role, first_name, last_name, email, institution: institution || company_name || '' }
      // store password in plain text for mock (do NOT do this in production)
      user.password = password
      db.users.push(user)
      writeDB(db)
      const token = 'mocktoken.'+user.id
      return { user: { id: user.id, role: user.role, email: user.email, institution: user.institution }, token }
    }
    if(path === '/auth/login'){
      const { email, password } = body
      const user = db.users.find(u=>u.email===email && u.password===password)
      if(!user) throw new Error('invalid credentials')
      const token = 'mocktoken.'+user.id
      return { user: { id: user.id, role: user.role, email: user.email, institution: user.institution }, token }
    }
    if(path === '/projects'){
      // body: project_title, description, deadline, compensation_type
      const user = JSON.parse(localStorage.getItem('cf_user')||'null')
      const proj = { id: generateId(), company_id: user?.id || null, project_title: body.project_title, raw_description: body.description, deadline: body.deadline, compensation_type: body.compensation_type || 'none', skill_requirements: body.skill_requirements||[], created_at: new Date().toISOString(), status: 'open' }
      db.projects.push(proj)
      writeDB(db)
      return { project: proj }
    }
    if(path === '/classes'){
      const user = JSON.parse(localStorage.getItem('cf_user')||'null')
      const cls = { id: generateId(), professor_id: user?.id || null, name: body.name, semester: body.semester || '', roster: body.roster || [], created_at: new Date().toISOString() }
      db.classes.push(cls)
      writeDB(db)
      return { class: cls }
    }
    if(path.startsWith('/submissions/')){
      // body is FormData in real app; here we may receive FormData or an object
      const parts = path.split('/')
      const projectId = parts[1] === '' ? parts[2] : parts[1] // handle different call styles
      // in our frontend usage, we call post(`/submissions/${id}`, form)
      // body may be FormData or object with files array
      const user = JSON.parse(localStorage.getItem('cf_user')||'null')
      const submission = { id: generateId(), student_id: user?.id || null, project_id: projectId, timestamp: new Date().toISOString(), file_paths: [], ai_feedback: null, status: 'submitted' }
      if(body instanceof FormData){
        for(const pair of body.entries()){
          if(pair[0] === 'files'){
            const f = pair[1]
            submission.file_paths.push({ original: f.name, size: f.size, type: f.type })
          }
        }
      } else if(Array.isArray(body.files)){
        submission.file_paths = body.files.map(f=>({ original: f.name || f.filename || 'file' }))
      }
      db.submissions.push(submission)
      writeDB(db)
      return { submission }
    }
    if(path === '/ai/parse'){
      if((import.meta.env.VITE_USE_AI||'false').toLowerCase() !== 'true'){
        return { disabled: true, message: 'AI disabled in frontend mock', summary: (body.text||'').slice(0,300) }
      }
      // simple heuristic mock
      const text = body.text || ''
      const skills = []
      if(text.toLowerCase().includes('python')) skills.push('python')
      return { skills_required: skills, domain: 'general', estimated_time_hours: 10, complexity: 'medium', deliverable_types: ['report'] }
    }
    return {}
  },

  put: async (p,b) => { await delay(); return {} },
  del: async (p) => { await delay(); return {} }
}
