import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  async function submit(e){
    e.preventDefault()
    setError(null)
    try{
      const res = await api.post('/auth/login', { email, password })
      if(res.user && res.token){
        localStorage.setItem('cf_token', res.token)
        localStorage.setItem('cf_user', JSON.stringify(res.user))
        navigate('/')
      }
    }catch(err){
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div style={{ padding: 120 }}>
      <div style={{ maxWidth:420, margin:'0 auto', background:'var(--color-card-bg)', padding:28, borderRadius:12 }}>
        <h2 style={{ marginTop:0 }}>Login</h2>
        <form onSubmit={submit}>
          <div style={{ marginBottom:12 }}>
            <label>Email</label>
            <input value={email} onChange={e=>setEmail(e.target.value)} style={{ width:'100%', padding:10, borderRadius:8, border:'none' }} />
          </div>
          <div style={{ marginBottom:12 }}>
            <label>Password</label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)} style={{ width:'100%', padding:10, borderRadius:8, border:'none' }} />
          </div>
          {error && <div style={{ color:'#FF6B6B' }}>{error}</div>}
          <div style={{ display:'flex', gap:10, marginTop:10 }}>
            <button className="btn-primary" type="submit">Login</button>
            <a href="#/register" style={{ alignSelf:'center', color:'var(--color-text-muted)' }}>Create an account</a>
          </div>
        </form>
      </div>
    </div>
  )
}
