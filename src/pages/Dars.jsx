import { useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import darsCss from '../styles/dars.css?raw'
import shellHtml from '../html/darsShell.html?raw'
import { DARSLAR, KETMA } from '../data/darslar.js'

function esc(s){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

// Dars detail'ini chizadi (asl dars.html mantig'i, faqat havolalar /dars/ + data-route)
function buildDars(k){
  var d = DARSLAR[k]
  if(!d){
    return '<div class="err"><h1>Dars topilmadi</h1><p>Bu dars hali mavjud emas. '
         + '<a data-route href="/">Sillabusga qaytish</a></p></div>'
  }
  var idx = KETMA.indexOf(k)
  var oldingi = idx > 0 ? KETMA[idx-1] : null
  var keyingi = idx < KETMA.length-1 ? KETMA[idx+1] : null
  var html = ''

  if(d.imtihon){
    html += '<header><div class="crumb"><span>'+esc(d.modul)+'</span><span class="b">•</span>'
          + '<span class="b" style="color:var(--acc2)">🎓 Oylik imtihon</span></div>'
    html += '<h1>'+esc(d.nom)+'</h1>'
    html += '<div class="natija" style="color:var(--acc2);border-color:var(--acc2)">📚 '+esc(d.qamrov)+' — '+esc(d.mavzu)+'</div></header>'
    html += '<section><div class="eyebrow">Kirish</div><div class="kirish">'+esc(d.kirish)+'</div></section>'
    if(d.vizual && d.vizual.length && d.vizual[0].svg){ html += '<section><div class="vz-wrap">'+d.vizual[0].svg+'</div></section>' }
    html += '<section><div class="eyebrow">📝 Nazariy savollar</div><ol class="imt-naz">'
    d.nazariy.forEach(function(q){ html += '<li>'+esc(q)+'</li>' })
    html += '</ol></section>'
    html += '<section><div class="eyebrow">🛠 Amaliy topshiriq</div><div class="kirish">'+esc(d.amaliy)+'</div>'
    html += '<div class="imt-mtitle">Baholash mezoni:</div><ul class="vazifa">'
    d.mezon.forEach(function(m){ html += '<li><span class="box"></span><span>'+esc(m)+'</span></li>' })
    html += '</ul></section>'
    html += '<section><div class="eyebrow">Baholash</div><div class="imt-ball">'+esc(d.ball)+'</div></section>'
    html += '<div class="navrow">'
    if(oldingi){ var od0 = DARSLAR[oldingi]; html += '<a class="navbtn" data-route href="/dars/'+oldingi+'"><div class="l">← Oldingi</div><div class="t">'+esc(od0.nom)+'</div></a>' }
    else { html += '<span class="navbtn dis"><div class="l">← Oldingi</div><div class="t">Boshi</div></span>' }
    if(keyingi){ var nd0 = DARSLAR[keyingi]; html += '<a class="navbtn next" data-route href="/dars/'+keyingi+'"><div class="l">Keyingi →</div><div class="t">'+esc(nd0.nom)+'</div></a>' }
    else { html += '<span class="navbtn next dis"><div class="l">Keyingi →</div><div class="t">Yakun</div></span>' }
    html += '</div>'
    return html
  }

  var jami = KETMA.filter(function(x){ return DARSLAR[x].modul === d.modul && !DARSLAR[x].imtihon }).length
  var progres = Math.round(d.n / jami * 100)
  html += '<header>'
  html += '<div class="crumb"><span>'+esc(d.modul)+'</span><span class="b">•</span><span class="b">'+esc(d.blok)+'</span></div>'
  html += '<div class="progress"><span class="n">Dars '+d.n+' / '+jami+'</span>'
        + '<div class="track"><div class="fill" style="width:'+progres+'%"></div></div></div>'
  html += '<h1>'+esc(d.nom)+'</h1>'
  html += '<div class="natija">🎯 Natija: '+esc(d.natija)+'</div>'
  html += '</header>'

  html += '<section><div class="eyebrow">Kirish</div>'
  html += '<div class="kirish">'+esc(d.kirish)+'</div></section>'

  html += '<section><div class="eyebrow">Mavzular ketma-ketligi</div>'
  d.mavzular.forEach(function(m, i){
    html += '<div class="mavzu"><div class="i">'+(i+1)+'</div>'
          + '<div><b>'+esc(m.s)+'</b><span>'+esc(m.i)+'</span></div></div>'
  })
  html += '</section>'

  if(d.material && d.material.length){
    html += '<section><div class="eyebrow">Darslik — to\'liq tushuntirish</div>'
    d.material.forEach(function(it){
      if(it.kod){
        html += '<div style="margin:6px 0 16px">'
        if(it.kod.izoh){ html += '<div class="kodizoh">'+esc(it.kod.izoh)+'</div>' }
        html += '<div class="editor"><div class="top">'
              + '<span class="dot" style="background:#ff5f57"></span>'
              + '<span class="dot" style="background:#febc2e"></span>'
              + '<span class="dot" style="background:#28c840"></span>'
              + '<span class="fn">misol.'+esc(it.kod.til||'js')+'</span></div>'
              + '<pre>'+esc(it.kod.matn)+'</pre></div></div>'
      } else {
        html += '<div class="mat">'
        if(it.s){ html += '<div class="mat-s">'+esc(it.s)+'</div>' }
        var ps = Array.isArray(it.p) ? it.p : [it.p]
        ps.forEach(function(p){ html += '<p class="mat-p">'+esc(p)+'</p>' })
        html += '</div>'
      }
    })
    html += '</section>'
  }

  if(d.vizual && d.vizual.length){
    html += '<section><div class="eyebrow">🎨 Vizual misol</div>'
    d.vizual.forEach(function(v){
      html += '<div class="vz-wrap">' + v.svg
            + '<div class="vz-cap"><div class="s"><span class="tag">'+esc(v.tur)+'</span>'+esc(v.sarlavha)+'</div>'
            + (v.izoh ? '<div class="i">'+esc(v.izoh)+'</div>' : '')
            + '</div></div>'
    })
    html += '</section>'
  }

  if(d.hayotiy && d.hayotiy.length){
    html += '<section><div class="eyebrow">Hayotiy misollar</div><div class="hayot">'
    d.hayotiy.forEach(function(h){
      html += '<div class="hcard"><div class="s"><span class="em">💡</span>'+esc(h.s)+'</div>'
            + '<div class="i">'+esc(h.i)+'</div></div>'
    })
    html += '</div></section>'
  }

  if(d.kod){
    html += '<section><div class="eyebrow">Kod misoli</div>'
    if(d.kod.izoh){ html += '<div class="kodizoh">'+esc(d.kod.izoh)+'</div>' }
    html += '<div class="editor"><div class="top">'
          + '<span class="dot" style="background:#ff5f57"></span>'
          + '<span class="dot" style="background:#febc2e"></span>'
          + '<span class="dot" style="background:#28c840"></span>'
          + '<span class="fn">misol.'+esc(d.kod.til||'js')+'</span></div>'
          + '<pre>'+esc(d.kod.matn)+'</pre></div></section>'
  }

  html += '<section><div class="eyebrow">Uy vazifasi</div><ul class="vazifa">'
  d.vazifa.forEach(function(v){
    html += '<li><span class="box"></span><span>'+esc(v)+'</span></li>'
  })
  html += '</ul>'
  if(d.vazifaVizual){
    html += '<div class="vz-wrap" style="margin-top:16px">' + d.vazifaVizual.svg
          + '<div class="vz-cap"><div class="s"><span class="tag hedef">🎯 Natija</span>Uy vazifasi bajarilganda shunday ko\'rinishi kerak</div>'
          + (d.vazifaVizual.izoh ? '<div class="i">'+esc(d.vazifaVizual.izoh)+'</div>' : '')
          + '</div></div>'
  }
  html += '</section>'

  html += '<div class="navrow">'
  if(oldingi){
    var od = DARSLAR[oldingi]
    html += '<a class="navbtn" data-route href="/dars/'+oldingi+'"><div class="l">← Oldingi</div>'
          + '<div class="t">'+esc(od.nom)+'</div></a>'
  } else { html += '<span class="navbtn dis"><div class="l">← Oldingi</div><div class="t">Boshi</div></span>' }
  if(keyingi){
    var nd = DARSLAR[keyingi]
    html += '<a class="navbtn next" data-route href="/dars/'+keyingi+'"><div class="l">Keyingi →</div>'
          + '<div class="t">'+esc(nd.nom)+'</div></a>'
  } else { html += '<span class="navbtn next dis"><div class="l">Keyingi →</div><div class="t">Yakun</div></span>' }
  html += '</div>'

  return html
}

export default function Dars(){
  const { k } = useParams()
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    const root = ref.current.querySelector('#root')
    if(root) root.innerHTML = buildDars(k)
    const d = DARSLAR[k]
    document.title = d ? (d.modul + ' · Dars ' + d.n + ' — ' + d.nom) : 'Dars topilmadi'
  }, [k])

  useEffect(() => {
    const el = ref.current
    function onClick(e){
      const a = e.target.closest('a[data-route]')
      if(a){ e.preventDefault(); navigate(a.getAttribute('href')) }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [navigate])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: darsCss }} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: shellHtml }} />
    </>
  )
}
