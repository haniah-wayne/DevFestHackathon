import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function StudentDashboard(){
  const [classes, setClasses] = useState([])
  const [projects, setProjects] = useState([])
  useEffect(()=>{
    // Load existing mock data; if empty, seed with sample classes/projects for demo
    api.get('/classes').then(r=>{
      const cls = r.classes || []
      if(cls.length===0){
        // UPDATED: seed demo classes with fake values
        const seed = [
          { id: 'class_1', name: 'Intro to Design', semester: 'Fall 2025', roster: ['student1@univ.edu'], demo: true },
          { id: 'class_2', name: 'ME Capstone', semester: 'Spring 2026', roster: ['student2@univ.edu'], demo: true }
        ]
        setClasses(seed)
      } else setClasses(cls)
    }).catch(()=>{})
    api.get('/projects').then(r=>{
      const ps = r.projects || []
      if(ps.length===0){
        // UPDATED: seed a project inside class_1 for demo purposes
        const seedP = [
          { id:'proj_1', project_title: 'Autonomous Cart', raw_description: 'Build a prototype autonomous cart to transport lab equipment.', deadline: '2025-12-15', skill_requirements:['Python','CAD'], compensation_type:'fixed', class_id:'class_1' }
        ]
        setProjects(seedP)
      } else setProjects(ps)
    }).catch(()=>{})
  },[])

  return (
    <div className="student-dashboard">

      {/* HEADER */}
      <div className="section-header">
        <h1>My Classes</h1>
        <p>Select a class to view available projects</p>
      </div>

      {/* CLASS GRID */}
      <div className="class-grid">
        {classes.map(c => (
          <div key={c.id} className="class-card">
            <div className="class-icon">📘</div>
            <h2>{c.name}</h2>
            <p>{c.professor || "Dr. Sarah Johnson"}</p>
            <p className="muted">{c.semester}</p>

            <p className="active-projects">
              {projects.filter(p => p.class_id === c.id).length} Active Projects
            </p>
          </div>
        ))}
      </div>

      {/* SECOND SECTION — Available Projects */}
      <div className="section-header" style={{ marginTop: 60 }}>
        <h1>Available Projects</h1>
        <p>Select a project to view details and submit your work</p>
      </div>

      <div className="project-list">
        {projects.map(p => (
          <div key={p.id} className="project-item-card">
            <h2>{p.project_title}</h2>
            <p className="muted">{p.company || "Unnamed Company"}</p>

            <p>{p.raw_description}</p>

            <p className="deadline"><strong>Deadline:</strong> {p.deadline}</p>

            {/* difficulty pill */}
            <div className={`difficulty-tag ${p.difficulty?.toLowerCase()}`}>
              {p.difficulty || "Intermediate"}
            </div>

          </div>
        ))}
      </div>

    </div>
  )


  return (
    <div style={{ marginTop:12 }}>
      <div style={{ background:'rgba(0,0,0,0.12)', padding:10, borderRadius:8, maxHeight:160, overflowY:'auto' }}>
        {messages.map(m=> (
          <div key={m.id} style={{ marginBottom:8 }}>
            <div style={{ fontSize:13, fontWeight:700 }}>{m.from === 'ai' ? 'Assistant' : 'You'}</div>
            <div style={{ color:'var(--color-text-muted)' }}>{m.text}</div>
          </div>
        ))}
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask the assistant..." style={{ flex:1, padding:8, borderRadius:8, border:'none' }} />
        <button className="btn-primary" onClick={send}>Send</button>
      </div>
    </div>
  )
}
