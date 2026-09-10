import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import homeCss from '../styles/home.css?raw'
import homeHtml from '../html/home.html?raw'
import { DARSLAR, DARSLAR_RU, KETMA } from '../data/darslar.js'
import { LABELS, BLOK_RU, getTil, setTil } from '../data/i18n.js'
import LangToggle from '../components/LangToggle.jsx'

function esc(s){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }
function ru(k, til){ return til==='ru' ? (DARSLAR_RU[k]||null) : null }
function fld(k, til, f){ var r = ru(k,til); return (r && r[f]!=null) ? r[f] : DARSLAR[k][f] }

function buildSyllabus(til){
  var L = LABELS[til] || LABELS.uz
  var html = '', joriyModul = null, joriyBlok = null, ochiqTbl = false
  function tblYop(){ if(ochiqTbl){ html += '</table></div></div>'; ochiqTbl = false } }
  KETMA.forEach(function(k){
    var d = DARSLAR[k]
    if(d.imtihon){
      html += '<tr class="dars imt-row" data-k="'+d.k+'">'
            + '<td>🎓</td><td colspan="2"><b>'+L.imtihonRow+'</b> — '+esc(fld(k,til,'mavzu'))+'</td>'
            + '<td class="arrow">→</td></tr>'
      return
    }
    if(d.modul !== joriyModul){
      tblYop()
      var pro = d.modul === 'Pro'
      var jami = KETMA.filter(function(x){ return DARSLAR[x].modul === d.modul && !DARSLAR[x].imtihon }).length
      var nom = pro ? L.modulPro : L.modulBasic
      var hafta = pro ? L.haftaPro : L.haftaBasic
      html += '<div class="modhead" style="margin-top:'+(pro?'40px':'10px')+'">'
            + '<span class="badge'+(pro?' pro':'')+'">'+nom+'</span>'
            + '<span style="color:var(--mut)">'+jami+' '+L.darsUnit+' · '+hafta+'</span></div>'
      joriyModul = d.modul; joriyBlok = null
    }
    if(d.blok !== joriyBlok){
      tblYop()
      var blokNom = (til==='ru' && BLOK_RU[d.blok]) ? BLOK_RU[d.blok] : d.blok
      html += '<div class="block"><div class="bt">'+esc(blokNom)+'</div>'
            + '<div class="tbl-wrap"><table>'
            + '<tr><th>#</th><th>'+L.thMavzu+'</th><th>'+L.thNatija+'</th><th></th></tr>'
      ochiqTbl = true; joriyBlok = d.blok
    }
    var cls = 'dars' + (d.tur === 'cap' ? ' cap' : d.tur === 'hot' ? ' hot' : '')
    html += '<tr class="'+cls+'" data-k="'+d.k+'">'
          + '<td>'+d.n+'</td><td>'+esc(fld(k,til,'nom'))+'</td><td>'+esc(fld(k,til,'natija'))+'</td>'
          + '<td class="arrow">→</td></tr>'
  })
  tblYop()
  return html
}

export default function Home(){
  const ref = useRef(null)
  const navigate = useNavigate()
  const [til, setTilState] = useState(getTil())

  useEffect(() => {
    const el = ref.current
    const root = el.querySelector('#syllabus-root')
    if(root) root.innerHTML = buildSyllabus(til)

    // Til: ruscha bo'lsa homepage matnlarini almashtirish (data-ru)
    if(til === 'ru'){
      el.querySelectorAll('[data-ru]').forEach(function(x){ x.textContent = x.getAttribute('data-ru') })
    }

    // Rejim: o'quvchi ko'rinishi (?rejim=oquvchi)
    var m = /[?&]rejim=([^&]+)/.exec(window.location.search)
    var oquvchi = m && decodeURIComponent(m[1]) === 'oquvchi'
    document.title = oquvchi
      ? (til==='ru' ? 'IT Курс — Учебная программа' : 'IT Kurs — O\'quv dasturi')
      : (til==='ru' ? 'IT Курс — Методика (13-16 лет)' : 'IT Kurs Metodikasi — 13-16 yosh')
    if(oquvchi){
      el.querySelectorAll('.teacher-only').forEach(function(x){ x.remove() })
      el.querySelectorAll('[data-student]').forEach(function(x){
        var alt = (til==='ru' && x.getAttribute('data-student-ru')) ? x.getAttribute('data-student-ru') : x.getAttribute('data-student')
        x.textContent = alt
      })
    }
  }, [til])

  useEffect(() => {
    const el = ref.current
    function onClick(e){
      const tr = e.target.closest('tr.dars')
      if(tr && tr.getAttribute('data-k')){ navigate('/dars/' + tr.getAttribute('data-k')); return }
      const a = e.target.closest('a[data-route]')
      if(a){ e.preventDefault(); navigate(a.getAttribute('href')) }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [navigate])

  function change(t){ setTil(t); setTilState(t) }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: homeCss }} />
      <LangToggle til={til} onChange={change} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: homeHtml }} />
    </>
  )
}
