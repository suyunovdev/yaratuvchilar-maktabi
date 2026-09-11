import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import darsCss from '../styles/dars.css?raw'
import shellHtml from '../html/darsShell.html?raw'
import { DARSLAR, DARSLAR_RU, KETMA } from '../data/darslar.js'
import { LABELS, BLOK_RU, mergeRu, getTil, setTil } from '../data/i18n.js'
import LangToggle from '../components/LangToggle.jsx'

function esc(s){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function ru(k, til){ return til==='ru' ? (DARSLAR_RU[k]||null) : null }
function nameOf(k, til){ var r = ru(k, til); return (r && r.nom) || DARSLAR[k].nom }

function buildDars(k, til){
  var L = LABELS[til] || LABELS.uz
  var d0 = DARSLAR[k]
  if(!d0){
    return '<div class="err"><h1>—</h1><p><a data-route href="/">'+L.oldingi+'</a></p></div>'
  }
  var d = mergeRu(d0, ru(k, til))
  var idx = KETMA.indexOf(k)
  var oldingi = idx > 0 ? KETMA[idx-1] : null
  var keyingi = idx < KETMA.length-1 ? KETMA[idx+1] : null
  var html = ''

  function nav(){
    var h = '<div class="navrow">'
    if(oldingi){ h += '<a class="navbtn" data-route href="/dars/'+oldingi+'"><div class="l">'+L.oldingi+'</div><div class="t">'+esc(nameOf(oldingi,til))+'</div></a>' }
    else { h += '<span class="navbtn dis"><div class="l">'+L.oldingi+'</div><div class="t">'+L.boshi+'</div></span>' }
    if(keyingi){ h += '<a class="navbtn next" data-route href="/dars/'+keyingi+'"><div class="l">'+L.keyingi+'</div><div class="t">'+esc(nameOf(keyingi,til))+'</div></a>' }
    else { h += '<span class="navbtn next dis"><div class="l">'+L.keyingi+'</div><div class="t">'+L.yakun+'</div></span>' }
    return h + '</div>'
  }

  if(d.imtihon){
    html += '<header><div class="crumb"><span>'+esc(d.modul)+'</span><span class="b">•</span>'
          + '<span class="b" style="color:var(--acc2)">'+L.imtihon+'</span></div>'
    html += '<h1>'+esc(d.nom)+'</h1>'
    html += '<div class="natija" style="color:var(--acc2);border-color:var(--acc2)">📚 '+esc(d.qamrov)+' — '+esc(d.mavzu)+'</div></header>'
    html += '<section><div class="eyebrow">'+L.kirish+'</div><div class="kirish">'+esc(d.kirish)+'</div></section>'
    if(d.vizual && d.vizual.length && d.vizual[0].svg){ html += '<section><div class="vz-wrap">'+d.vizual[0].svg+'</div></section>' }
    html += '<section><div class="eyebrow">'+L.nazariy+'</div><ol class="imt-naz">'
    d.nazariy.forEach(function(q){ html += '<li>'+esc(q)+'</li>' })
    html += '</ol></section>'
    html += '<section><div class="eyebrow">'+L.amaliy+'</div><div class="kirish">'+esc(d.amaliy)+'</div>'
    html += '<div class="imt-mtitle">'+L.mezonTitle+'</div><ul class="vazifa">'
    d.mezon.forEach(function(m){ html += '<li><span class="box"></span><span>'+esc(m)+'</span></li>' })
    html += '</ul></section>'
    html += '<section><div class="eyebrow">'+L.baholash+'</div><div class="imt-ball">'+esc(d.ball)+'</div></section>'
    html += nav()
    return html
  }

  var blok = (til==='ru' && BLOK_RU[d.blok]) ? BLOK_RU[d.blok] : d.blok
  if(d.intro){
    html += '<header><div class="crumb"><span>'+esc(d.modul)+'</span><span class="b">•</span>'
          + '<span class="b" style="color:var(--lime)">'+L.introBadge+'</span></div>'
    html += '<h1>'+esc(d.nom)+'</h1>'
    html += '<div class="natija" style="color:var(--lime);border-color:var(--lime)">'+L.natija+': '+esc(d.natija)+'</div></header>'
  } else {
    var jami = KETMA.filter(function(x){ return DARSLAR[x].modul === d.modul && !DARSLAR[x].imtihon && !DARSLAR[x].intro }).length
    var progres = Math.round(d.n / jami * 100)
    html += '<header>'
    html += '<div class="crumb"><span>'+esc(d.modul)+'</span><span class="b">•</span><span class="b">'+esc(blok)+'</span></div>'
    html += '<div class="progress"><span class="n">'+L.dars+' '+d.n+' / '+jami+'</span>'
          + '<div class="track"><div class="fill" style="width:'+progres+'%"></div></div></div>'
    html += '<h1>'+esc(d.nom)+'</h1>'
    html += '<div class="natija">'+L.natija+': '+esc(d.natija)+'</div>'
    html += '</header>'
  }

  html += '<section><div class="eyebrow">'+L.kirish+'</div>'
  html += '<div class="kirish">'+esc(d.kirish)+'</div></section>'

  html += '<section><div class="eyebrow">'+L.mavzular+'</div>'
  d.mavzular.forEach(function(m, i){
    html += '<div class="mavzu"><div class="i">'+(i+1)+'</div>'
          + '<div><b>'+esc(m.s)+'</b><span>'+esc(m.i)+'</span></div></div>'
  })
  html += '</section>'

  if(d.material && d.material.length){
    html += '<section><div class="eyebrow">'+L.darslik+'</div>'
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
    html += '<section><div class="eyebrow">'+L.vizual+'</div>'
    d.vizual.forEach(function(v){
      html += '<div class="vz-wrap">' + v.svg
            + '<div class="vz-cap"><div class="s"><span class="tag">'+esc(v.tur)+'</span>'+esc(v.sarlavha)+'</div>'
            + (v.izoh ? '<div class="i">'+esc(v.izoh)+'</div>' : '')
            + '</div></div>'
    })
    html += '</section>'
  }

  if(d.hayotiy && d.hayotiy.length){
    html += '<section><div class="eyebrow">'+L.hayotiy+'</div><div class="hayot">'
    d.hayotiy.forEach(function(h){
      html += '<div class="hcard"><div class="s"><span class="em">💡</span>'+esc(h.s)+'</div>'
            + '<div class="i">'+esc(h.i)+'</div></div>'
    })
    html += '</div></section>'
  }

  if(d.kod){
    html += '<section><div class="eyebrow">'+L.kod+'</div>'
    if(d.kod.izoh){ html += '<div class="kodizoh">'+esc(d.kod.izoh)+'</div>' }
    html += '<div class="editor"><div class="top">'
          + '<span class="dot" style="background:#ff5f57"></span>'
          + '<span class="dot" style="background:#febc2e"></span>'
          + '<span class="dot" style="background:#28c840"></span>'
          + '<span class="fn">misol.'+esc(d.kod.til||'js')+'</span></div>'
          + '<pre>'+esc(d.kod.matn)+'</pre></div></section>'
  }

  html += '<section><div class="eyebrow">'+L.vazifa+'</div><ul class="vazifa">'
  d.vazifa.forEach(function(v){
    html += '<li><span class="box"></span><span>'+esc(v)+'</span></li>'
  })
  html += '</ul>'
  if(d.vazifaVizual){
    html += '<div class="vz-wrap" style="margin-top:16px">' + d.vazifaVizual.svg
          + '<div class="vz-cap"><div class="s"><span class="tag hedef">'+L.natija+'</span>'+L.natijaHedef+'</div>'
          + (d.vazifaVizual.izoh ? '<div class="i">'+esc(d.vazifaVizual.izoh)+'</div>' : '')
          + '</div></div>'
  }
  if(!d.intro){
    html += '<div class="gh-note"><span class="e">📤</span><span>'+L.ghReminder
          + ' <a data-route href="/dars/b-gh">'+L.ghLink+'</a></span></div>'
  }
  html += '</section>'

  html += nav()
  return html
}

export default function Dars(){
  const { k } = useParams()
  const ref = useRef(null)
  const navigate = useNavigate()
  const [til, setTilState] = useState(getTil())

  useEffect(() => {
    window.scrollTo(0, 0)
    const root = ref.current.querySelector('#root')
    if(root) root.innerHTML = buildDars(k, til)
    const d = DARSLAR[k]
    const L = LABELS[til] || LABELS.uz
    document.title = d ? (d.modul + ' · ' + L.dars + ' ' + (d.n||'') + ' — ' + (nameOf(k,til))) : '—'
  }, [k, til])

  useEffect(() => {
    const el = ref.current
    function onClick(e){
      const a = e.target.closest('a[data-route]')
      if(a){ e.preventDefault(); navigate(a.getAttribute('href')) }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [navigate])

  function change(t){ setTil(t); setTilState(t) }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: darsCss }} />
      <LangToggle til={til} onChange={change} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: shellHtml }} />
    </>
  )
}
