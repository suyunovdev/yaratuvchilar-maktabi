// Ikki til (uz/ru) qo'llab-quvvatlash: UI yorliqlar, blok nomlari va RU overlay merge.

export const LABELS = {
  uz: {
    kirish:"Kirish", mavzular:"Mavzular ketma-ketligi", darslik:"Darslik — to'liq tushuntirish",
    vizual:"🎨 Vizual misol", hayotiy:"Hayotiy misollar", kod:"Kod misoli", vazifa:"Uy vazifasi",
    natija:"🎯 Natija", natijaHedef:"Uy vazifasi bajarilganda shunday ko'rinishi kerak",
    mezonTitle:"Baholash mezoni:", nazariy:"📝 Nazariy savollar", amaliy:"🛠 Amaliy topshiriq",
    baholash:"Baholash", imtihon:"🎓 Oylik imtihon", oldingi:"← Oldingi", keyingi:"Keyingi →",
    boshi:"Boshi", yakun:"Yakun", dars:"Dars", jami:"", imtihonRow:"OYLIK IMTIHON",
    modulBasic:"MODUL 1 — BASIC · «Yaratuvchi»", modulPro:"MODUL 2 — PRO · «Ilova muhandisi»",
    darsUnit:"dars", haftaBasic:"12 hafta", haftaPro:"16 hafta", thMavzu:"Mavzu", thNatija:"Natija",
    introBadge:"🚀 Boshlang'ich dars",
    ghReminder:"Bajarilgan uy vazifasini GitHub'ga yuklab, havolasini o'qituvchiga yuboring.", ghLink:"Qanday yuborish?",
    skaffoldTitle:"🪜 Bosqichma-bosqich (ko'prik)", skToliq:"1. To'liq misol", skYarim:"2. Yarim misol", skMustaqil:"3. Mustaqil"
  },
  ru: {
    kirish:"Введение", mavzular:"Темы урока", darslik:"Материал урока",
    vizual:"🎨 Визуальный пример", hayotiy:"Примеры из жизни", kod:"Пример кода", vazifa:"Домашнее задание",
    natija:"🎯 Результат", natijaHedef:"Так должно выглядеть выполненное задание",
    mezonTitle:"Критерии оценки:", nazariy:"📝 Теоретические вопросы", amaliy:"🛠 Практическое задание",
    baholash:"Оценивание", imtihon:"🎓 Месячный экзамен", oldingi:"← Назад", keyingi:"Далее →",
    boshi:"Начало", yakun:"Конец", dars:"Урок", jami:"", imtihonRow:"МЕСЯЧНЫЙ ЭКЗАМЕН",
    modulBasic:"МОДУЛЬ 1 — BASIC · «Создатель»", modulPro:"МОДУЛЬ 2 — PRO · «Инженер приложений»",
    darsUnit:"уроков", haftaBasic:"12 недель", haftaPro:"16 недель", thMavzu:"Тема", thNatija:"Результат",
    introBadge:"🚀 Вводный урок",
    ghReminder:"Загрузите выполненное задание на GitHub и отправьте ссылку преподавателю.", ghLink:"Как отправить?",
    skaffoldTitle:"🪜 Шаг за шагом (мостик)", skToliq:"1. Полный пример", skYarim:"2. Половина примера", skMustaqil:"3. Самостоятельно"
  }
}

export const BLOK_RU = {
  "Blok 1 — Web asoslari + yaratuvchilik":"Блок 1 — Основы веба и творчество",
  "Blok 2 — Algoritmik fikrlash + JS mantiq":"Блок 2 — Алгоритмическое мышление и логика JS",
  "Blok 3 — Interaktivlik: sahifani jonlantirish":"Блок 3 — Интерактивность: оживление страницы",
  "Blok 4 — Basic Capstone":"Блок 4 — Капстоун Basic",
  "Blok 1 — Professional daraja + jonli ma'lumot":"Блок 1 — Профессиональный уровень и живые данные",
  "Blok 2 — Dinamik ilova + ma'lumot saqlash":"Блок 2 — Динамическое приложение и хранение данных",
  "Blok 3 — Backend + ma'lumotlar bazasi":"Блок 3 — Backend и база данных",
  "Blok 4 — Full-stack Capstone + AI + deploy":"Блок 4 — Full-stack капстоун + AI + деплой"
}

export function getTil(){
  try {
    var m = /[?&]til=([^&]+)/.exec(window.location.search)
    if(m){ var t = decodeURIComponent(m[1]); if(t==='ru'||t==='uz'){ localStorage.setItem('til', t); return t } }
    var s = localStorage.getItem('til')
    if(s==='ru'||s==='uz') return s
  } catch(e){}
  return 'uz'
}

export function setTil(t){
  try { localStorage.setItem('til', t) } catch(e){}
}

// RU overlay'ni UZ dars obyektiga birlashtiradi (kod/svg UZ'dan, matn RU'dan)
export function mergeRu(d, ru){
  if(!d || !ru) return d
  var out = Object.assign({}, d)
  ;['nom','natija','kirish','amaliy','ball','qamrov','mavzu'].forEach(function(f){ if(ru[f]!=null) out[f]=ru[f] })
  if(ru.mavzular) out.mavzular = ru.mavzular
  if(ru.hayotiy) out.hayotiy = ru.hayotiy
  if(ru.vazifa) out.vazifa = ru.vazifa
  if(ru.nazariy) out.nazariy = ru.nazariy
  if(ru.mezon) out.mezon = ru.mezon
  if(ru.skaffold) out.skaffold = ru.skaffold
  if(ru.material && d.material){
    out.material = d.material.map(function(it, i){
      var r = ru.material[i]; if(!r) return it
      if(it.kod){ return { kod:{ til:it.kod.til, matn:it.kod.matn, izoh:(r.kod&&r.kod.izoh)||it.kod.izoh } } }
      return { s:(r.s!=null?r.s:it.s), p:(r.p!=null?r.p:it.p) }
    })
  }
  if(d.kod){ out.kod = { til:d.kod.til, matn:d.kod.matn, izoh:(ru.kod&&ru.kod.izoh)||d.kod.izoh } }
  if(ru.vizual && d.vizual){
    out.vizual = d.vizual.map(function(it, i){
      var r = ru.vizual[i] || {}
      return { tur:it.tur, svg:it.svg, sarlavha:(r.sarlavha!=null?r.sarlavha:it.sarlavha), izoh:(r.izoh!=null?r.izoh:it.izoh) }
    })
  }
  if(d.vazifaVizual){ out.vazifaVizual = { svg:d.vazifaVizual.svg, izoh:(ru.vazifaVizual&&ru.vazifaVizual.izoh)||d.vazifaVizual.izoh } }
  return out
}
