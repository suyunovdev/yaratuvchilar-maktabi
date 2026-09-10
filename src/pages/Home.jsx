import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import homeCss from '../styles/home.css?raw'
import homeHtml from '../html/home.html?raw'
import { DARSLAR, KETMA } from '../data/darslar.js'

function esc(s){ return (s+'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

// Sillabusni ma'lumotdan chizadi (asl index.html mantig'i, faqat data-k bilan)
function buildSyllabus(){
  var html = '', joriyModul = null, joriyBlok = null, ochiqTbl = false
  function tblYop(){ if(ochiqTbl){ html += '</table></div></div>'; ochiqTbl = false } }
  KETMA.forEach(function(k){
    var d = DARSLAR[k]
    if(d.imtihon){
      html += '<tr class="dars imt-row" data-k="'+d.k+'">'
            + '<td>🎓</td><td colspan="2"><b>OYLIK IMTIHON</b> — '+esc(d.mavzu)+'</td>'
            + '<td class="arrow">→</td></tr>'
      return
    }
    if(d.modul !== joriyModul){
      tblYop()
      var pro = d.modul === 'Pro'
      var jami = KETMA.filter(function(x){ return DARSLAR[x].modul === d.modul && !DARSLAR[x].imtihon }).length
      var nom = pro ? 'MODUL 2 — PRO · &quot;Ilova muhandisi&quot;' : 'MODUL 1 — BASIC · &quot;Yaratuvchi&quot;'
      var hafta = pro ? '16 hafta' : '12 hafta'
      html += '<div class="modhead" style="margin-top:'+(pro?'40px':'10px')+'">'
            + '<span class="badge'+(pro?' pro':'')+'">'+nom+'</span>'
            + '<span style="color:var(--mut)">'+jami+' dars · '+hafta+'</span></div>'
      joriyModul = d.modul; joriyBlok = null
    }
    if(d.blok !== joriyBlok){
      tblYop()
      html += '<div class="block"><div class="bt">'+esc(d.blok)+'</div>'
            + '<div class="tbl-wrap"><table>'
            + '<tr><th>#</th><th>Mavzu</th><th>Natija</th><th></th></tr>'
      ochiqTbl = true; joriyBlok = d.blok
    }
    var cls = 'dars' + (d.tur === 'cap' ? ' cap' : d.tur === 'hot' ? ' hot' : '')
    html += '<tr class="'+cls+'" data-k="'+d.k+'">'
          + '<td>'+d.n+'</td><td>'+esc(d.nom)+'</td><td>'+esc(d.natija)+'</td>'
          + '<td class="arrow">→</td></tr>'
  })
  tblYop()
  return html
}

export default function Home(){
  const ref = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = ref.current
    const root = el.querySelector('#syllabus-root')
    if(root) root.innerHTML = buildSyllabus()

    // Rejim: o'quvchi ko'rinishi (?rejim=oquvchi)
    var m = /[?&]rejim=([^&]+)/.exec(window.location.search)
    var oquvchi = m && decodeURIComponent(m[1]) === 'oquvchi'
    document.title = oquvchi ? 'IT Kurs — O\'quv dasturi' : 'IT Kurs Metodikasi — 13-16 yosh'
    if(oquvchi){
      el.querySelectorAll('.teacher-only').forEach(function(x){ x.remove() })
      el.querySelectorAll('[data-student]').forEach(function(x){ x.textContent = x.getAttribute('data-student') })
    }

    function onClick(e){
      const tr = e.target.closest('tr.dars')
      if(tr && tr.getAttribute('data-k')){ navigate('/dars/' + tr.getAttribute('data-k')); return }
      const a = e.target.closest('a[data-route]')
      if(a){ e.preventDefault(); navigate(a.getAttribute('href')) }
    }
    el.addEventListener('click', onClick)
    return () => el.removeEventListener('click', onClick)
  }, [navigate])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: homeCss }} />
      <div ref={ref} dangerouslySetInnerHTML={{ __html: homeHtml }} />
    </>
  )
}
