import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing(){
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="badge">Michigan Industry — University Collaboration</div>
          {/* UPDATED: Updated branding name to BlueprintLabs */}
          <h1>Connect Michigan companies with <span>University</span> projects</h1>
          <p className="hero-subtext">BlueprintLabs helps companies post real problems, professors assign them into classes or labs, and students complete paid, real-world projects tied to coursework.</p>
          <div className="hero-buttons">
            <Link to="/student" className="btn-primary">I'm a Student</Link>
            <Link to="/company" className="btn-secondary">I'm a Company</Link>
            <Link to="/professor" className="btn-secondary">I'm a Professor</Link>
          </div>

          <div className="roles-section">
            <div className="role-card">
              <div style={{ width:60, height:60, borderRadius:10, background:'#0B3A66', margin:'0 auto' }}></div>
              <div className="role-card-title">Students</div>
              <p>Find real projects from Michigan companies and submit deliverables through your class.</p>
            </div>
            <div className="role-card">
              <div style={{ width:60, height:60, borderRadius:10, background:'#0B3A66', margin:'0 auto' }}></div>
              <div className="role-card-title">Companies</div>
              <p>Post problems, attach requirements, and connect with professors, labs, and classes.</p>
            </div>
            <div className="role-card">
              <div style={{ width:60, height:60, borderRadius:10, background:'#0B3A66', margin:'0 auto' }}></div>
              <div className="role-card-title">Professors & Labs</div>
              <p>Approve projects, manage assignments and mentor student teams using campus resources.</p>
            </div>
          </div>

          <div style={{ marginTop: 30, display:'flex', justifyContent:'center' }}>
            <div className="info-card" style={{ maxWidth:920 }}>
              <h3 style={{ marginTop:0 }}>MVP Features</h3>
              <div className="card-row">
                <div className="info-card" style={{ width:280 }}>
                  <strong>Project Posting</strong>
                  <p>Companies can post projects with deadlines and compensation type.</p>
                </div>
                <div className="info-card" style={{ width:280 }}>
                  <strong>Class Assignments</strong>
                  <p>Professors create classes and assign projects to students or teams.</p>
                </div>
                <div className="info-card" style={{ width:280 }}>
                  <strong>Submissions</strong>
                  <p>Students upload files; AI provides assistive feedback (stubbed).</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
