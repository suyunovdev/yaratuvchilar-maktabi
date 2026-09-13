import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import darsCss from '../styles/dars.css?raw'
import kursCss from '../styles/react-kurs.css?raw'
import { KURS } from '../data/react-kurs.js'
import LessonView from '../components/kurs/LessonView.jsx'
import { useProgress } from '../components/kurs/useProgress.js'

// Barcha darslar tekis ro'yxati (navigatsiya uchun)
const FLAT = KURS.flatMap(o => (o.darslar || []).map(d => ({ ...d, oy: o.oy, oyNom: o.nom, tayyor: o.tayyor && d.tayyor !== false })))
function findDars(k){ return FLAT.find(d => d.k === k) }

export default function ReactKurs(){
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const prog = useProgress()
  const curKey = params.get('dars') || 'o1-1'
  const cur = findDars(curKey) || FLAT[0]
  const curOy = KURS.find(o => o.oy === cur.oy)

  const [openOy, setOpenOy] = useState(() => ({ [cur.oy]: true }))
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => { setOpenOy(o => ({ ...o, [cur.oy]: true })) }, [cur.oy])
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = curOy.oy + '-oy · ' + cur.nom + ' — React kursi'
  }, [curKey])

  function selectDars(k){ setParams({ dars: k }); setMobileOpen(false) }
  function toggleOy(oy){ setOpenOy(o => ({ ...o, [oy]: !o[oy] })) }

  const doneCount = useMemo(() => KURS.filter(o => o.tayyor).length, [])
  const curIdx = FLAT.indexOf(cur)

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: darsCss }} />
      <style dangerouslySetInnerHTML={{ __html: kursCss }} />

      <nav className="rk-topbar">
        <a className="logo" href="/" onClick={e => { e.preventDefault(); navigate('/') }}><b>&lt;/&gt;</b> React kursi</a>
        <span className="rk-xp" title="Yig'ilgan ballaringiz">⭐ {prog.xp} ball</span>
        <button className="rk-burger" onClick={() => setMobileOpen(v => !v)} aria-label="Menyu">☰ Mavzular</button>
        <a className="back" href="/" onClick={e => { e.preventDefault(); navigate('/') }}>← Bosh sahifa</a>
      </nav>

      <div className="rk-shell">
        <aside className={'rk-side' + (mobileOpen ? ' open' : '')}>
          <div className="rk-side-head">
            <div className="rk-side-title">Dastur</div>
            <div className="rk-side-sub">8 oy · {FLAT.length} dars · ⭐ {prog.xp} ball</div>
          </div>
          <div className="rk-months">
            {KURS.map(oy => {
              const isOpen = !!openOy[oy.oy]
              return (
                <div key={oy.oy} className={'rk-month' + (oy.tayyor ? '' : ' locked')}>
                  <button className="rk-month-h" onClick={() => toggleOy(oy.oy)}>
                    <span className="rk-caret">{isOpen ? '▼' : '▸'}</span>
                    <span className="rk-month-n">{oy.oy}</span>
                    <span className="rk-month-t">{oy.nom}</span>
                    {!oy.tayyor && <span className="rk-soon-tag">tez orada</span>}
                  </button>
                  {isOpen && (
                    <ul className="rk-lessons">
                      {oy.darslar.map(d => {
                        const done = !!prog.done[d.k]
                        return (
                          <li key={d.k}>
                            <button
                              className={'rk-lesson' + (d.k === curKey ? ' active' : '') + (done ? ' done' : '')}
                              onClick={() => selectDars(d.k)}>
                              <span className="rk-l-n">{done ? '✓' : d.n}</span>
                              <span className="rk-l-t">{d.nom}</span>
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              )
            })}
          </div>
        </aside>

        {mobileOpen && <div className="rk-overlay" onClick={() => setMobileOpen(false)} />}

        <main className="rk-main">
          <div className="wrap">
            <LessonView d={cur} oy={curOy} key={curKey} />
          </div>
          <div className="rk-nav">
            <button className="rk-navbtn" disabled={curIdx <= 0}
              onClick={() => { if(curIdx > 0) selectDars(FLAT[curIdx - 1].k) }}>← Oldingi</button>
            <button className="rk-navbtn next" disabled={curIdx >= FLAT.length - 1}
              onClick={() => { if(curIdx < FLAT.length - 1) selectDars(FLAT[curIdx + 1].k) }}>Keyingi →</button>
          </div>
        </main>
      </div>
    </>
  )
}
