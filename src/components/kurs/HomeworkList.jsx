import { progress, useProgress } from './useProgress.js'

// vazifa: [string], lessonKey: string
export default function HomeworkList({ vazifa, lessonKey }){
  const snap = useProgress()
  const checks = (snap.hw && snap.hw[lessonKey]) || {}
  return (
    <ul className="vazifa rk-hw">
      {vazifa.map((v, i) => {
        const on = !!checks[i]
        return (
          <li key={i} className={on ? 'done' : ''} onClick={() => progress.toggleHw(lessonKey, i)}>
            <span className={'box' + (on ? ' on' : '')}>{on ? '✓' : ''}</span>
            <span>{v}</span>
          </li>
        )
      })}
    </ul>
  )
}
