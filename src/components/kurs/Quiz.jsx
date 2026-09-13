import { useState } from 'react'
import { progress } from './useProgress.js'

function QuizItem({ q, onAnswer }){
  const [sel, setSel] = useState(null)
  function pick(i){
    if(sel != null) return
    setSel(i)
    onAnswer(i === q.togri)
  }
  return (
    <div className="rk-q">
      <div className="rk-q-savol">{q.savol}</div>
      <div className="rk-q-variantlar">
        {q.variantlar.map((v, i) => {
          let cls = 'rk-q-opt'
          if(sel != null){
            if(i === q.togri) cls += ' togri'
            else if(i === sel) cls += ' xato'
          }
          return (
            <button key={i} className={cls} disabled={sel != null} onClick={() => pick(i)}>
              <span className="rk-q-harf">{String.fromCharCode(65 + i)}</span>{v}
            </button>
          )
        })}
      </div>
      {sel != null && (
        <div className={'rk-q-izoh ' + (sel === q.togri ? 'ok' : 'no')}>
          {sel === q.togri ? '✅ To\'g\'ri! ' : '❌ Noto\'g\'ri. '}{q.izoh}
        </div>
      )}
    </div>
  )
}

// data: { sarlavha, savollar:[{savol,variantlar,togri,izoh}] }
export default function Quiz({ data, lessonKey, markDoneOnFinish }){
  const total = data.savollar.length
  const [res, setRes] = useState({})   // index -> bool(correct)
  const doneN = Object.keys(res).length
  const correctN = Object.values(res).filter(Boolean).length

  function onAnswer(idx, correct){
    setRes(prev => {
      if(prev[idx] != null) return prev
      const next = { ...prev, [idx]: correct }
      if(correct) progress.addXp(10)
      if(Object.keys(next).length === total && markDoneOnFinish && lessonKey){
        progress.markDone(lessonKey)
      }
      return next
    })
  }

  const finished = doneN === total
  return (
    <div className="rk-quiz">
      <div className="rk-quiz-head">
        <span className="rk-quiz-badge">❓ {data.sarlavha || 'Savol-javob'}</span>
        <span className="rk-quiz-score">{doneN}/{total} · to‘g‘ri: {correctN}</span>
      </div>
      {data.savollar.map((q, i) => (
        <QuizItem key={i} q={q} onAnswer={(c) => onAnswer(i, c)} />
      ))}
      {finished && (
        <div className="rk-quiz-natija">
          🎉 Yakunlandi! {correctN}/{total} to‘g‘ri · +{correctN * 10} ball
          {markDoneOnFinish && <span className="rk-quiz-done"> · dars belgilandi ✓</span>}
        </div>
      )}
    </div>
  )
}
