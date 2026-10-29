import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  ShieldCheck, LayoutDashboard, Siren, Map, BookOpen, Package, FileText,
  Users, Settings, Bell, Search, Wifi, WifiOff, ChevronDown, Menu, X,
  ClipboardCheck, HeartPulse, RadioTower, CloudLightning, CheckCircle2,
  Clock3, AlertTriangle, ArrowUpRight, Download, GraduationCap, House,
  CalendarDays, FileCheck2, LifeBuoy, CircleHelp, ShieldAlert, ListChecks
} from 'lucide-react'
import './styles.css'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard },
  { label: 'Emergency Alerts', icon: Siren },
  { label: 'School DRRM Plan', icon: FileText },
  { label: 'Hazard Map', icon: Map },
  { label: 'Learning Modules', icon: BookOpen },
  { label: 'Resources & Go-bag', icon: Package },
  { label: 'Drills & Activities', icon: ClipboardCheck },
  { label: 'Reports', icon: FileCheck2 },
  { label: 'Users & Roles', icon: Users },
  { label: 'Settings', icon: Settings }
]

const initialAlerts = [
  { type: 'Preparedness', title: 'Earthquake drill reminder', detail: 'Review your assigned evacuation route and assembly area.', time: 'Scheduled · School notice', status: 'Upcoming', color: 'amber' },
  { type: 'Weather', title: 'Monitor official weather advisories', detail: 'Check PAGASA updates and follow verified school instructions.', time: 'Preparedness reminder', status: 'Monitor', color: 'blue' },
  { type: 'Safety', title: 'Keep evacuation paths clear', detail: 'Report blocked exits or hazards to an authorized school staff member.', time: 'Ongoing safety reminder', status: 'Action', color: 'green' }
]

const modules = [
  { n: '01', title: 'DRRM Basics', sub: 'Hazard, exposure, vulnerability and risk', progress: 100, color: 'blue' },
  { n: '02', title: 'Earthquake Preparedness', sub: 'Before, during and after shaking', progress: 65, color: 'rose' },
  { n: '03', title: 'Fire Safety', sub: 'Alarm, evacuation and assembly points', progress: 30, color: 'orange' },
  { n: '04', title: 'Flood Readiness', sub: 'Warnings, routes and safe decisions', progress: 0, color: 'cyan' }
]

function App() {
  const [active, setActive] = useState('Dashboard')
  const [role, setRole] = useState('School Admin')
  const [online, setOnline] = useState(navigator.onLine)
  const [mobileNav, setMobileNav] = useState(false)
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [reportType, setReportType] = useState('Blocked exit / hazard')
  const [reportDetails, setReportDetails] = useState('')
  const [reports, setReports] = useState(() => {
    try { return JSON.parse(localStorage.getItem('drrm-reports') || '[]') } catch { return [] }
  })
  const [completed, setCompleted] = useState(() => {
    try { return JSON.parse(localStorage.getItem('drrm-completed') || '[]') } catch { return [] }
  })

  useEffect(() => {
    const onOnline = () => setOnline(true)
    const onOffline = () => setOnline(false)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => {
      window.removeEventListener('online', onOnline)
      window.removeEventListener('offline', onOffline)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('drrm-reports', JSON.stringify(reports))
  }, [reports])
  useEffect(() => {
    localStorage.setItem('drrm-completed', JSON.stringify(completed))
  }, [completed])

  const showNotice = (message) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3200)
  }

  const saveReport = (e) => {
    e.preventDefault()
    if (!reportDetails.trim()) return
    const item = {
      id: `LOCAL-${Date.now().toString().slice(-6)}`,
      type: reportType,
      details: reportDetails.trim(),
      createdAt: new Date().toLocaleString(),
      sync: online ? 'Local demo record' : 'Saved on this device · not sent'
    }
    setReports(prev => [item, ...prev])
    setReportDetails('')
    setShowReport(false)
    setActive('Reports')
    showNotice(online ? 'Demo report saved on this device.' : 'Saved locally. It has NOT been sent to the school.')
  }

  const toggleModule = (n) => {
    setCompleted(prev => prev.includes(n) ? prev.filter(x => x !== n) : [...prev, n])
  }

  const filteredNav = navItems.filter(item => item.label.toLowerCase().includes(query.toLowerCase()))
  const isStudent = role === 'Student'
  const isParent = role === 'Parent / Guardian'
  const isTeacher = role === 'Teacher'
  const pageTitle = active === 'Dashboard'
    ? (isStudent ? 'Student Safety Dashboard' : isParent ? 'Family Safety Dashboard' : isTeacher ? 'Teacher Safety Dashboard' : 'School DRRM Dashboard')
    : active

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileNav ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><ShieldCheck size={23} strokeWidth={2.5}/></div>
          <div><strong>School DRRM</strong><span>Prepared. Responsive. Resilient.</span></div>
          <button className="icon-btn close-mobile" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="school-chip"><div className="school-crest">S</div><div><strong>My School</strong><span>School Safety Hub</span></div><ChevronDown size={15}/></div>
        <div className="nav-label">WORKSPACE</div>
        <nav>
          {filteredNav.map(item => {
            const Icon = item.icon
            return <button key={item.label} className={`nav-item ${active === item.label ? 'active' : ''}`} onClick={() => { setActive(item.label); setMobileNav(false) }}>
              <Icon size={18}/><span>{item.label}</span>{item.label === 'Emergency Alerts' && <i className="nav-dot"/>}
            </button>
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="offline-card">
            <div className={`offline-icon ${online ? 'connected' : ''}`}>{online ? <Wifi size={17}/> : <WifiOff size={17}/>}</div>
            <div><strong>{online ? 'Connection available' : 'Offline mode active'}</strong><span>{online ? 'Local data is available' : 'Using saved information'}</span></div>
          </div>
          <div className="profile-mini"><div className="avatar">JD</div><div><strong>Juan Dela Cruz</strong><span>{role}</span></div><button className="icon-btn" onClick={() => showNotice('Demo profile settings')} aria-label="Profile settings"><Settings size={16}/></button></div>
        </div>
      </aside>

      {mobileNav && <button className="scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn menu-btn" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button>
            <div className="breadcrumbs"><span>School Safety</span><b>/</b><strong>{active}</strong></div>
          </div>
          <div className="top-actions">
            <div className={`connection-pill ${online ? 'is-online' : 'is-offline'}`}>
              {online ? <Wifi size={14}/> : <WifiOff size={14}/>}
              <span>{online ? 'Online' : 'Offline mode'}</span>
            </div>
            <button className="icon-btn notification-btn" onClick={() => setActive('Emergency Alerts')} aria-label="View alerts"><Bell size={19}/><i/></button>
            <div className="top-avatar">JD</div>
          </div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot"/> SCHOOL DISASTER READINESS</div>
              <h1>{pageTitle}</h1>
              <p className="welcome-copy">Know the risk. Prepare before disaster. Keep one another safe.</p>
            </div>
            <div className="role-switch">
              <label htmlFor="role-select">Preview portal</label>
              <select id="role-select" value={role} onChange={e => { setRole(e.target.value); setActive('Dashboard') }}>
                <option>School Admin</option><option>Teacher</option><option>Student</option><option>Parent / Guardian</option>
              </select>
            </div>
          </section>

          {!online && <div className="offline-banner"><WifiOff size={18}/><div><strong>You are viewing saved information</strong><span>Live alerts and remote reporting may be unavailable. Follow school procedures and use established emergency channels.</span></div></div>}

          {active === 'Dashboard' && <>
            <section className="hero-card">
              <div className="hero-content">
                <div className="hero-tag"><ShieldCheck size={15}/> SAFETY STARTS WITH PREPARATION</div>
                <h2>Ready today.<br/><em>Safer tomorrow.</em></h2>
                <p>Access school safety guidance, preparedness activities and verified emergency information in one place.</p>
                <div className="hero-buttons">
                  <button className="btn btn-white" onClick={() => setActive('Learning Modules')}>Explore learning <ArrowUpRight size={16}/></button>
                  <button className="btn btn-outline-white" onClick={() => setActive('School DRRM Plan')}>View DRRM plan</button>
                </div>
              </div>
              <div className="hero-art" aria-hidden="true">
                <div className="art-circle circle-one"/><div className="art-circle circle-two"/>
                <div className="shield-illustration"><ShieldCheck size={70} strokeWidth={1.25}/></div>
                <div className="floating-chip chip-top"><CheckCircle2 size={16}/> Preparedness</div>
                <div className="floating-chip chip-bottom"><LifeBuoy size={16}/> Safety for everyone</div>
              </div>
            </section>

            <section className="stat-grid">
              <Stat icon={Siren} label="Active alerts" value="—" foot="Connect verified alert source" color="red"/>
              <Stat icon={GraduationCap} label="Learning modules" value="04" foot={`${completed.length} completed on this device`} color="blue"/>
              <Stat icon={ClipboardCheck} label="Preparedness tasks" value="06" foot="Sample checklist items" color="green"/>
              <Stat icon={FileText} label="Local reports" value={String(reports.length).padStart(2,'0')} foot="Saved on this device" color="purple"/>
            </section>

            <section className="section-grid">
              <div className="panel learning-panel">
                <div className="panel-head"><div><span className="section-kicker">LEARN & PREPARE</span><h3>Continue your learning</h3></div><button className="text-link" onClick={() => setActive('Learning Modules')}>All modules <ArrowUpRight size={14}/></button></div>
                <div className="module-list">
                  {modules.slice(0,3).map(m => <ModuleRow key={m.n} module={m} completed={completed.includes(m.n)} onToggle={() => toggleModule(m.n)}/>)}
                </div>
              </div>
              <div className="panel alerts-panel">
                <div className="panel-head"><div><span className="section-kicker">STAY INFORMED</span><h3>Safety notices</h3></div><button className="icon-btn subtle" onClick={() => setActive('Emergency Alerts')} aria-label="All alerts"><ArrowUpRight size={17}/></button></div>
                <div className="alert-list">
                  {initialAlerts.map((a, i) => <div className="notice-row" key={a.title}><div className={`notice-icon ${a.color}`}>{i === 0 ? <CalendarDays size={17}/> : i === 1 ? <CloudLightning size={17}/> : <AlertTriangle size={17}/>}</div><div className="notice-copy"><strong>{a.title}</strong><p>{a.detail}</p><span>{a.time}</span></div><span className={`status status-${a.color}`}>{a.status}</span></div>)}
                </div>
                <div className="verified-note"><ShieldCheck size={15}/> Demo notices only. Not a live government alert feed.</div>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="panel quick-panel">
                <div className="panel-head"><div><span className="section-kicker">QUICK ACCESS</span><h3>What do you need?</h3></div></div>
                <div className="quick-actions">
                  <QuickAction icon={ShieldAlert} label="Report a hazard" desc="Submit a safety concern" color="red" onClick={() => setShowReport(true)}/>
                  <QuickAction icon={Map} label="Evacuation map" desc="View routes and assembly points" color="blue" onClick={() => setActive('Hazard Map')}/>
                  <QuickAction icon={Package} label="Go-bag checklist" desc="Review essential supplies" color="orange" onClick={() => setActive('Resources & Go-bag')}/>
                  <QuickAction icon={RadioTower} label="Emergency contacts" desc="School and official channels" color="green" onClick={() => setActive('Emergency Alerts')}/>
                </div>
              </div>
              <div className="panel checklist-panel">
                <div className="panel-head"><div><span className="section-kicker">YOUR READINESS</span><h3>Preparedness checklist</h3></div><ListChecks size={19} className="muted-icon"/></div>
                <CheckItem text="Know your evacuation assembly point"/>
                <CheckItem text="Save school emergency contact details"/>
                <CheckItem text="Review the family communication plan"/>
                <CheckItem text="Know how to report a hazard"/>
                <p className="small-note">Checklist is a local demo; progress is stored in this browser only.</p>
              </div>
            </section>
          </>}

          {active === 'Learning Modules' && <section className="panel page-panel">
            <div className="panel-head"><div><span className="section-kicker">ZERO TO HERO</span><h3>DRRM learning modules</h3><p className="panel-description">Short, accessible lessons that can be saved for offline review.</p></div><BookOpen className="muted-icon" size={24}/></div>
            <div className="module-grid">{modules.map(m => <div className="module-card" key={m.n}><div className={`module-symbol ${m.color}`}><BookOpen size={21}/></div><span className="module-number">MODULE {m.n}</span><h4>{m.title}</h4><p>{m.sub}</p><div className="progress-track"><span style={{width: `${completed.includes(m.n) ? 100 : m.progress}%`}}/></div><div className="module-foot"><span>{completed.includes(m.n) ? 'Completed on this device' : `${m.progress}% sample progress`}</span><button className="btn btn-small btn-primary" onClick={() => toggleModule(m.n)}>{completed.includes(m.n) ? 'Mark incomplete' : 'Mark complete'}</button></div></div>)}</div>
            <div className="info-callout"><CircleHelp size={19}/><p>Educational content must be reviewed against current official guidance and the school's approved emergency plan before deployment.</p></div>
          </section>}

          {active === 'Emergency Alerts' && <section className="panel page-panel"><div className="panel-head"><div><span className="section-kicker">VERIFIED INFORMATION</span><h3>Emergency alerts & contacts</h3><p className="panel-description">This prototype does not receive live alerts or dispatch emergency services.</p></div><Siren className="muted-icon" size={24}/></div><div className="info-callout warning"><AlertTriangle size={19}/><p>For an immediate threat, follow the school emergency plan and contact the appropriate official emergency service directly. Do not rely on this demo app as the sole channel.</p></div><div className="alert-list full">{initialAlerts.map((a,i)=><div className="notice-row" key={a.title}><div className={`notice-icon ${a.color}`}>{i===0?<CalendarDays size={17}/>:i===1?<CloudLightning size={17}/>:<AlertTriangle size={17}/>}</div><div className="notice-copy"><strong>{a.title}</strong><p>{a.detail}</p><span>{a.time}</span></div><span className={`status status-${a.color}`}>{a.status}</span></div>)}</div><h4 className="subheading">School emergency contacts</h4><div className="contact-placeholder"><LifeBuoy size={20}/><div><strong>Contacts must be configured by the school administrator</strong><span>Add verified school and local emergency contact details before actual use.</span></div></div></section>}

          {active === 'Reports' && <section className="panel page-panel"><div className="panel-head"><div><span className="section-kicker">LOCAL RECORDS</span><h3>Hazard reports</h3><p className="panel-description">Reports entered here remain on this browser and are not sent to responders.</p></div><button className="btn btn-primary" onClick={() => setShowReport(true)}>+ New report</button></div>{reports.length === 0 ? <div className="empty-state"><FileText size={30}/><h4>No local reports yet</h4><p>Use “New report” to test the offline reporting interface.</p></div> : <div className="report-list">{reports.map(r=><div className="report-card" key={r.id}><div className="report-icon"><AlertTriangle size={18}/></div><div className="report-body"><strong>{r.type}</strong><p>{r.details}</p><span>{r.id} · {r.createdAt}</span><small>{r.sync}</small></div><span className="status status-blue">Local draft</span></div>)}</div>}</section>}

          {active !== 'Dashboard' && active !== 'Learning Modules' && active !== 'Emergency Alerts' && active !== 'Reports' && <section className="panel page-panel"><div className="panel-head"><div><span className="section-kicker">SCHOOL SAFETY WORKSPACE</span><h3>{active}</h3><p className="panel-description">This screen is a starter placeholder. School-specific records and workflows must be added and verified before real-world use.</p></div><ShieldCheck className="muted-icon" size={24}/></div><div className="placeholder-grid"><div className="placeholder-card"><Map size={22}/><strong>Verified school information</strong><span>Add approved maps, plans and location details.</span></div><div className="placeholder-card"><Users size={22}/><strong>Authorized access</strong><span>Connect this module to role-based permissions.</span></div><div className="placeholder-card"><FileCheck2 size={22}/><strong>Records and review</strong><span>Define responsible officers, review dates and audit history.</span></div></div><div className="info-callout"><CheckCircle2 size={19}/><p>Built as a UI starter. No real student database, dispatch integration or official advisory feed is connected.</p></div></section>}

          <footer className="footer"><div><ShieldCheck size={15}/> <strong>School DRRM Hub</strong><span>Offline-first UI starter</span></div><span>Protect people. Prepare together.</span></footer>
        </div>
      </main>

      {showReport && <div className="modal-backdrop" role="presentation" onMouseDown={e => { if (e.target === e.currentTarget) setShowReport(false) }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="report-title"><div className="modal-head"><div><span className="section-kicker">SAFETY REPORT</span><h3 id="report-title">Report a hazard</h3></div><button className="icon-btn" onClick={() => setShowReport(false)} aria-label="Close"><X size={19}/></button></div><div className="info-callout warning"><AlertTriangle size={18}/><p>This starter saves the report only on this device. It does not notify school responders.</p></div><form onSubmit={saveReport}><label>Report category<select value={reportType} onChange={e=>setReportType(e.target.value)}><option>Blocked exit / hazard</option><option>Building or facility damage</option><option>Flooding / water hazard</option><option>Fire or smoke concern</option><option>Medical assistance needed</option><option>Other safety concern</option></select></label><label>Location and description<textarea value={reportDetails} onChange={e=>setReportDetails(e.target.value)} placeholder="Describe the location and what you observed. Do not include unnecessary personal or medical details." required rows="4"/></label><div className="modal-actions"><button type="button" className="btn btn-ghost" onClick={()=>setShowReport(false)}>Cancel</button><button type="submit" className="btn btn-primary">Save local report</button></div></form></section></div>}

      {notice && <div className="toast"><CheckCircle2 size={17}/>{notice}</div>}
    </div>
  )
}

function Stat({icon: Icon, label, value, foot, color}) {
  return <div className="stat-card"><div className={`stat-icon ${color}`}><Icon size={19}/></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><span className="stat-foot">{foot}</span></div>
}
function ModuleRow({module:m, completed, onToggle}) {
  return <div className="module-row"><div className={`module-symbol ${m.color}`}><BookOpen size={18}/></div><div className="module-info"><div className="module-title-line"><strong>{m.title}</strong><span>{completed ? 'Completed' : m.progress === 0 ? 'Not started' : 'In progress'}</span></div><p>{m.sub}</p><div className="progress-track"><span style={{width: `${completed ? 100 : m.progress}%`}}/></div></div><button className={`round-check ${completed ? 'done' : ''}`} onClick={onToggle} title="Toggle local completion"><CheckCircle2 size={18}/></button></div>
}
function QuickAction({icon:Icon,label,desc,color,onClick}) {
  return <button className="quick-action" onClick={onClick}><div className={`quick-icon ${color}`}><Icon size={19}/></div><span><strong>{label}</strong><small>{desc}</small></span><ArrowUpRight size={15} className="quick-arrow"/></button>
}
function CheckItem({text}) {
  const [checked,setChecked] = useState(false)
  return <label className="check-item"><input type="checkbox" checked={checked} onChange={e=>setChecked(e.target.checked)}/><span className="custom-check"><CheckCircle2 size={16}/></span><span className={checked ? 'checked-text' : ''}>{text}</span></label>
}

createRoot(document.getElementById('root')).render(<App />)
