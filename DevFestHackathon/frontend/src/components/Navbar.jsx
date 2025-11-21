import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar(){
  const navigate = useNavigate()
  const token = localStorage.getItem('cf_token')
  const user = localStorage.getItem('cf_user') ? JSON.parse(localStorage.getItem('cf_user')) : null

  function logout(){
    localStorage.removeItem('cf_token')
    localStorage.removeItem('cf_user')
    navigate('/')
  }

  return (
    <div className="navbar">
      <div style={{ display:'flex', alignItems:'center', gap:12 }}>
        {/* UPDATED: Changed brand initials and name to BlueprintLabs */}
        <div style={{ width:48, height:48, background:'#00274C', color:'#FFCB05', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, borderRadius:8 }}>BL</div>
        <Link to="/" style={{ fontSize:20, fontWeight:700, color:'#00274C', textDecoration:'none' }}>BlueprintLabs</Link>
      </div>
      <div className="nav-right">
        {/* UPDATED: Make nav items visible as yellow buttons */}
        <Link to="/student" className="btn-primary" style={{ padding:'8px 12px', fontSize:14 }}>Students</Link>
        <Link to="/company" className="btn-primary" style={{ padding:'8px 12px', fontSize:14 }}>Companies</Link>
        <Link to="/professor" className="btn-primary" style={{ padding:'8px 12px', fontSize:14 }}>Professors</Link>
        {token ? (
          <>
            <span style={{ color:'#00274C', alignSelf:'center' }}>{user?.first_name || user?.email}</span>
            <button className="btn-secondary" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            {/* UPDATED: Make Login clearly visible as yellow button */}
            <Link to="/login" className="btn-primary" style={{ padding:'8px 12px', fontSize:14 }}>Login</Link>
            <Link to="/register" className="btn-secondary" style={{ padding:'8px 12px', fontSize:14 }}>Sign up</Link>
          </>
        )}
      </div>
    </div>
  )
}
