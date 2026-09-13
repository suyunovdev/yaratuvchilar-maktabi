import Reja from './Reja.jsx'
import Quiz from './Quiz.jsx'
import Stepper from './Stepper.jsx'
import GuessGame from './GuessGame.jsx'
import DragOrder from './DragOrder.jsx'
import HomeworkList from './HomeworkList.jsx'

function renderWidget(w, idx, lessonKey){
  if(w.tur === 'quiz')    return <Quiz key={idx} data={w} lessonKey={lessonKey} markDoneOnFinish={w.anchor === 'yakun'} />
  if(w.tur === 'stepper') return <Stepper key={idx} data={w} />
  if(w.tur === 'drag')    return <DragOrder key={idx} data={w} />
  if(w.tur === 'game')    return <GuessGame key={idx} />
  return null
}

export default function LessonView({ d, oy }){
  if(!d) return <div className="err"><h1>—</h1></div>

  if(!oy.tayyor){
    return (
      <>
        <header>
          <div className="crumb"><span>{oy.oy}-OY</span><span className="b">•</span><span className="b">{oy.nom}</span></div>
          <h1>{d.nom}</h1>
        </header>
        <section>
          <div className="soon">
            <div className="soon-em">🛠️</div>
            <div className="soon-t">Bu dars tayyorlanmoqda</div>
            <div className="soon-p">1-oy to‘liq interaktiv namuna sifatida tayyor. Qolgan oylar shu sifatda bosqichma-bosqich qo‘shilmoqda.</div>
          </div>
        </section>
      </>
    )
  }

  const jami = oy.darslar.length
  const progres = Math.round(d.n / jami * 100)
  const inter = d.interaktiv || []
  const byAnchor = a => inter.filter(w => w.anchor === a)
  const steppers = byAnchor('stepper')
  const amaliyot = byAnchor('amaliyot')
  const yakun = byAnchor('yakun')

  return (
    <>
      <header>
        <div className="crumb"><span>{oy.oy}-OY</span><span className="b">•</span><span className="b">{oy.nom}</span></div>
        <div className="progress">
          <span className="n">Dars {d.n} / {jami}</span>
          <div className="track"><div className="fill" style={{ width: progres + '%' }} /></div>
        </div>
        <h1>{d.nom}</h1>
        {d.natija && <div className="natija">Natija: {d.natija}</div>}
      </header>

      <Reja reja={d.reja} />

      {d.kirish && (
        <section><div className="eyebrow">Kirish</div><div className="kirish">{d.kirish}</div></section>
      )}

      {d.mavzular && d.mavzular.length > 0 && (
        <section>
          <div className="eyebrow">Mavzular</div>
          {d.mavzular.map((m, i) => (
            <div className="mavzu" key={i}>
              <div className="i">{i + 1}</div>
              <div><b>{m.s}</b><span>{m.i}</span></div>
            </div>
          ))}
        </section>
      )}

      {d.material && d.material.length > 0 && (
        <section>
          <div className="eyebrow">Batafsil darslik</div>
          {d.material.map((it, i) => (
            <div className="mat" key={i}>
              {it.s && <div className="mat-s">{it.s}</div>}
              {(Array.isArray(it.p) ? it.p : [it.p]).map((p, k) => <p className="mat-p" key={k}>{p}</p>)}
            </div>
          ))}
        </section>
      )}

      {d.vizual && d.vizual.length > 0 && d.vizual[0].svg && (
        <section>
          <div className="eyebrow">🎨 Vizual misol</div>
          {d.vizual.map((v, i) => (
            <div className="vz-wrap" key={i}>
              <div dangerouslySetInnerHTML={{ __html: v.svg }} />
              <div className="vz-cap">
                <div className="s"><span className="tag">SXEMA</span>{v.sarlavha}</div>
                {v.izoh && <div className="i">{v.izoh}</div>}
              </div>
            </div>
          ))}
        </section>
      )}

      {steppers.length > 0 && (
        <section>
          <div className="eyebrow">🎬 Jonli namoyish</div>
          {steppers.map((w, i) => renderWidget(w, i, d.k))}
        </section>
      )}

      {amaliyot.length > 0 && (
        <section>
          <div className="eyebrow">✍️ Amaliyot</div>
          {amaliyot.map((w, i) => renderWidget(w, i, d.k))}
        </section>
      )}

      {d.vazifa && d.vazifa.length > 0 && (
        <section>
          <div className="eyebrow">Uy vazifasi</div>
          <HomeworkList vazifa={d.vazifa} lessonKey={d.k} />
          {d.vazifaVizual && d.vazifaVizual.svg && (
            <div className="vz-wrap" style={{ marginTop: 16 }}>
              <div dangerouslySetInnerHTML={{ __html: d.vazifaVizual.svg }} />
              <div className="vz-cap"><div className="s"><span className="tag hedef">NATIJA</span>{d.vazifaVizual.s || 'Kutilgan natija'}</div></div>
            </div>
          )}
          <div className="gh-note">
            <span className="e">📤</span>
            <span>{oy.oy >= 2
              ? 'Bajarilgan vazifani GitHub‘ga yuklab, havolasini o‘qituvchiga yuboring.'
              : 'Bajarilgan vazifani Google Drive yoki Telegram havolasi orqali o‘qituvchiga yuboring. (GitHub bilan 2-oyda ishlaymiz.)'}</span>
          </div>
        </section>
      )}

      {yakun.length > 0 && (
        <section>
          <div className="eyebrow">✅ Yakun — bilimni tekshir</div>
          {yakun.map((w, i) => renderWidget(w, i, d.k))}
        </section>
      )}
    </>
  )
}
