import { useState } from 'react'
import { progress } from './useProgress.js'

function yangiSon(){ return Math.floor(Math.random() * 100) + 1 } // 1..100

export default function GuessGame(){
  const [secret, setSecret] = useState(yangiSon)
  const [qiymat, setQiymat] = useState('')
  const [tarix, setTarix] = useState([])   // {son, natija}
  const [yutdi, setYutdi] = useState(false)

  function taxmin(){
    const n = parseInt(qiymat, 10)
    if(isNaN(n) || n < 1 || n > 100) return
    let natija
    if(n === secret) natija = 'topildi'
    else if(n < secret) natija = 'katta'   // o'ylangan son kattaroq
    else natija = 'kichik'
    const yangi = [{ son: n, natija }, ...tarix]
    setTarix(yangi)
    setQiymat('')
    if(natija === 'topildi'){
      setYutdi(true)
      progress.addXp(20)
    }
  }
  function qayta(){ setSecret(yangiSon()); setTarix([]); setYutdi(false); setQiymat('') }
  function onKey(e){ if(e.key === 'Enter') taxmin() }

  return (
    <div className="rk-game">
      <div className="rk-game-head"><span className="rk-game-badge">🎮 Son topish o‘yini</span>
        <span className="rk-game-tries">Urinishlar: {tarix.length}</span></div>
      <div className="rk-game-say">Men 1 dan 100 gacha son o‘yladim. Toping!</div>

      {!yutdi ? (
        <div className="rk-game-input">
          <input type="number" min="1" max="100" value={qiymat} onKeyDown={onKey}
            onChange={e => setQiymat(e.target.value)} placeholder="1–100" />
          <button className="rk-game-btn" onClick={taxmin}>Taxmin</button>
        </div>
      ) : (
        <div className="rk-game-win">🎯 Topdingiz! {tarix.length} urinishda · +20 ball
          <button className="rk-game-btn again" onClick={qayta}>↻ Qayta o‘ynash</button></div>
      )}

      <div className="rk-game-log">
        {tarix.map((h, k) => (
          <div className={'rk-game-row ' + h.natija} key={k}>
            <b>{h.son}</b>
            <span>{h.natija === 'katta' ? '⬆ Kattaroq son o‘yladim' : h.natija === 'kichik' ? '⬇ Kichikroq son o‘yladim' : '✅ Topildi!'}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
