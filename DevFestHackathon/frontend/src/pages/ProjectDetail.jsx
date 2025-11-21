import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'

export default function ProjectDetail(){
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [files, setFiles] = useState([])
  const [status, setStatus] = useState(null)
  const [aiResult, setAiResult] = useState(null)
  const fileRef = useRef()

  useEffect(()=>{
    if(!id) return
    api.get(`/projects/${id}`).then(r=>setProject(r.project)).catch(()=>{})
  },[id])

  async function submit(e){
    e.preventDefault()
    setStatus('uploading')
    try{
      const user = localStorage.getItem('cf_user') ? JSON.parse(localStorage.getItem('cf_user')) : null
      if(!user) throw new Error('You must be logged in as a student to submit')
      if(user.role !== 'student') throw new Error('Only students can submit to projects')
      const form = new FormData()
      for(const f of files) form.append('files', f)
      form.append('student_id', user.id)
      const res = await api.post(`/submissions/${id}`, form)
      setStatus('submitted')
      // call AI parse on the project description (stub) only if enabled via Vite env
      try{
        if((import.meta.env.VITE_USE_AI || 'false').toLowerCase() === 'true'){
          const ai = await api.post('/ai/parse', { text: project.raw_description || '' })
          setAiResult(ai)
        }
      }catch(e){
        // swallow AI errors to avoid user-facing glitches
        console.warn('AI parse failed or is disabled', e)
      }
    }catch(err){
      setStatus('error: ' + (err.message || err))
    }
  }

  function onFiles(e){
    setFiles(Array.from(e.target.files))
  }

  if(!project) return <div style={{ padding:120 }}>Loading...</div>

  return (
    <div style={{ padding:120 }}>
      <div className="container" style={{ maxWidth:980 }}>
        <h1 style={{ marginTop:0 }}>{project.project_title}</h1>
        <div style={{ display:'flex', gap:20 }}>
          <div style={{ flex:2 }}>
            <p style={{ color:'var(--color-text-muted)' }}>{project.raw_description}</p>
            <div style={{ marginTop:12 }}>
              <strong>Deadline:</strong> {project.deadline}
            </div>
            <div style={{ marginTop:8 }}>
              <strong>Skills:</strong> {(project.skill_requirements || []).join(', ') || 'None specified'}
            </div>
            <div style={{ marginTop:8 }}>
              <strong>Compensation:</strong> {project.compensation_type}
            </div>

            <form onSubmit={submit} style={{ marginTop:20, display:'grid', gap:12 }}>
              <label style={{ color:'var(--color-text-muted)' }}>Upload deliverables (multiple files supported)</label>
              <input ref={fileRef} type="file" multiple onChange={onFiles} />
              <div style={{ display:'flex', gap:10 }}>
                <button className="btn-primary" type="submit">Submit</button>
                <button type="button" className="btn-secondary" onClick={()=>{ setFiles([]); if(fileRef.current) fileRef.current.value = null }}>Clear</button>
              </div>
            </form>

            {status && <div style={{ marginTop:12 }}>Status: {status}</div>}
            {aiResult && (
              <div style={{ marginTop:18, background:'var(--color-card-bg)', padding:12, borderRadius:8 }}>
                <h3 style={{ marginTop:0 }}>AI Analysis (stub)</h3>
                <pre style={{ whiteSpace:'pre-wrap', color:'var(--color-text-muted)' }}>{JSON.stringify(aiResult, null, 2)}</pre>
              </div>
            )}

          </div>
          <aside style={{ flex:1 }}>
            <div className="info-card">
              <h4 style={{ marginTop:0 }}>Project Summary</h4>
              <p><strong>Company:</strong> {project.company_id || 'Unknown'}</p>
              <p><strong>Created:</strong> {new Date(project.created_at).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {project.status}</p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
