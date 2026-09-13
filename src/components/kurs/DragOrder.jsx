import { useRef, useState } from 'react'
import { progress } from './useProgress.js'

function aralashtir(arr){
  const a = arr.slice()
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  // to'g'ri tartib bilan bir xil bo'lib qolmasin
  if(a.every((x, k) => x === arr[k]) && a.length > 1){ [a[0], a[1]] = [a[1], a[0]] }
  return a
}

// data: { sarlavha, togriTartib:[...] }
export default function DragOrder({ data }){
  const togri = data.togriTartib || []
  const [order, setOrder] = useState(() => aralashtir(togri))
  const [checked, setChecked] = useState(false)
  const dragI = useRef(null)

  function move(i, dir){
    const j = i + dir
    if(j < 0 || j >= order.length) return
    const a = order.slice();
    [a[i], a[j]] = [a[j], a[i]]
    setOrder(a); setChecked(false)
  }
  function onDrop(i){
    const from = dragI.current
    if(from == null || from === i) return
    const a = order.slice()
    const [it] = a.splice(from, 1)
    a.splice(i, 0, it)
    setOrder(a); setChecked(false); dragI.current = null
  }
  function tekshir(){
    setChecked(true)
    if(order.every((x, k) => x === togri[k])) progress.addXp(15)
  }
  function qayta(){ setOrder(aralashtir(togri)); setChecked(false) }

  const hammasiTogri = checked && order.every((x, k) => x === togri[k])

  return (
    <div className="rk-drag">
      <div className="rk-drag-head"><span className="rk-drag-badge">🔀 Tartiblang</span>
        <span className="rk-drag-title">{data.sarlavha}</span></div>

      <ol className="rk-drag-list">
        {order.map((it, i) => {
          const ok = checked && it === togri[i]
          const no = checked && it !== togri[i]
          return (
            <li key={it}
              className={'rk-drag-item' + (ok ? ' ok' : '') + (no ? ' no' : '')}
              draggable
              onDragStart={() => { dragI.current = i }}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(i)}>
              <span className="rk-drag-num">{i + 1}</span>
              <span className="rk-drag-txt">{it}</span>
              {checked && <span className="rk-drag-mark">{ok ? '✓' : '✗'}</span>}
              <span className="rk-drag-arrows">
                <button onClick={() => move(i, -1)} disabled={i === 0} aria-label="Yuqoriga">▲</button>
                <button onClick={() => move(i, 1)} disabled={i === order.length - 1} aria-label="Pastga">▼</button>
              </span>
            </li>
          )
        })}
      </ol>

      <div className="rk-drag-ctrl">
        {hammasiTogri
          ? <div className="rk-drag-win">✅ To‘g‘ri tartib! +15 ball</div>
          : <button className="rk-drag-btn" onClick={tekshir}>Tekshir</button>}
        <button className="rk-drag-btn ghost" onClick={qayta}>↻ Aralashtir</button>
      </div>
    </div>
  )
}
