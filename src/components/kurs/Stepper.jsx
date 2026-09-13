import { useEffect, useState } from 'react'

// data: { sarlavha, ozgaruvchilar:[nom...], qadamlar:[{izoh, holat:{}, chiqish:[]}] }
export default function Stepper({ data }){
  const qadamlar = data.qadamlar || []
  const [i, setI] = useState(0)
  const [play, setPlay] = useState(false)
  const oxirgi = qadamlar.length - 1
  const q = qadamlar[i] || { holat: {}, chiqish: [], izoh: '' }

  useEffect(() => {
    if(!play) return
    if(i >= oxirgi){ setPlay(false); return }
    const t = setTimeout(() => setI(v => Math.min(v + 1, oxirgi)), 1100)
    return () => clearTimeout(t)
  }, [play, i, oxirgi])

  function back(){ setPlay(false); setI(v => Math.max(0, v - 1)) }
  function fwd(){ setPlay(false); setI(v => Math.min(oxirgi, v + 1)) }
  function restart(){ setPlay(false); setI(0) }

  return (
    <div className="rk-step">
      <div className="rk-step-head">
        <span className="rk-step-badge">▶ Qadam-baqadam</span>
        <span className="rk-step-title">{data.sarlavha}</span>
      </div>

      <div className="rk-step-vars">
        {(data.ozgaruvchilar || []).map(nom => {
          const bor = Object.prototype.hasOwnProperty.call(q.holat || {}, nom)
          return (
            <div className={'rk-var' + (bor ? ' set' : '')} key={nom}>
              <div className="rk-var-nom">{nom}</div>
              <div className="rk-var-val" key={String(q.holat && q.holat[nom])}>
                {bor ? String(q.holat[nom]) : '—'}
              </div>
            </div>
          )
        })}
      </div>

      {q.chiqish && q.chiqish.length > 0 && (
        <div className="rk-step-term">
          <div className="rk-term-bar"><i></i><i></i><i></i><span>natija</span></div>
          <div className="rk-term-body">
            {q.chiqish.map((c, k) => <div className="rk-term-line" key={k}>{c}</div>)}
          </div>
        </div>
      )}

      <div className="rk-step-izoh">{q.izoh}</div>

      <div className="rk-step-ctrl">
        <button className="rk-step-btn" onClick={back} disabled={i === 0}>◀ Orqaga</button>
        <span className="rk-step-count">{i + 1} / {qadamlar.length}</span>
        {i < oxirgi
          ? <button className="rk-step-btn play" onClick={() => setPlay(p => !p)}>{play ? '⏸ To‘xtat' : '▶ Avtomatik'}</button>
          : <button className="rk-step-btn" onClick={restart}>↻ Qayta</button>}
        <button className="rk-step-btn next" onClick={fwd} disabled={i === oxirgi}>Oldinga ▶</button>
      </div>
    </div>
  )
}
