// 50 daqiqalik dars rejasi — 4 blokli vizual timeline
export default function Reja({ reja }){
  if(!reja || !reja.length) return null
  return (
    <section>
      <div className="eyebrow">⏱️ 50 daqiqalik reja</div>
      <div className="rk-reja">
        {reja.map((b, i) => (
          <div className="rk-reja-blok" key={i}>
            <div className="rk-reja-vaqt"><b>{b.vaqt}</b><span>daqiqa</span></div>
            <div className="rk-reja-body">
              <div className="rk-reja-nom">{b.ikon} {b.nom}</div>
              <div className="rk-reja-nima">{b.nima}</div>
              {b.ustoz && (
                <div className="rk-reja-ustoz"><b>O'qituvchiga:</b> {b.ustoz}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
