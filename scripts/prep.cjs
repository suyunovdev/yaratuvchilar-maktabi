// Asl statik saytdan (metodika-it-kurs) CSS, HTML va ma'lumotni
// AYNAN ko'chirib React manbasiga joylaydi. Kontent o'zgармайди.
const fs = require('fs')
const path = require('path')

const SRC = '/Users/ilyossuyunov/metodika-it-kurs'
const OUT = '/Users/ilyossuyunov/metodika-react'

function rd(f){ return fs.readFileSync(path.join(SRC, f), 'utf8') }
function wr(f, c){
  const p = path.join(OUT, f)
  fs.mkdirSync(path.dirname(p), { recursive: true })
  fs.writeFileSync(p, c)
  console.log('  yozildi:', f)
}
function styleInner(html){
  const m = html.match(/<style>([\s\S]*?)<\/style>/)
  return m ? m[1].trim() + '\n' : ''
}
function bodyBeforeScripts(html){
  let b = html.substring(html.indexOf('<body>') + 6)
  b = b.substring(0, b.indexOf('<script'))
  return b.trim() + '\n'
}

console.log('1) CSS (aynan)')
wr('src/styles/home.css', styleInner(rd('index.html')))
wr('src/styles/dars.css', styleInner(rd('dars.html')))

console.log('2) HTML partiallar (skriptlarsiz, havolalar React routingiga)')
let homeBody = bodyBeforeScripts(rd('index.html'))
homeBody = homeBody.replace('href="dars.html?k=p1"', 'data-route href="/dars/p1"')
wr('src/html/home.html', homeBody)

let darsBody = bodyBeforeScripts(rd('dars.html'))
darsBody = darsBody.replace('href="index.html#sillabus"', 'data-route href="/"')
wr('src/html/darsShell.html', darsBody)

console.log('3) Ma\'lumot (84 dars, aynan)')
global.window = {}
require(path.join(SRC, 'darslar-basic.js'))
require(path.join(SRC, 'darslar-pro.js'))
require(path.join(SRC, 'darslar-hayotiy.js'))
require(path.join(SRC, 'darslar-material-basic.js'))
require(path.join(SRC, 'darslar-material-pro.js'))
require(path.join(SRC, 'darslar-vizual-lib.js'))
require(path.join(SRC, 'darslar-vizual-basic.js'))
require(path.join(SRC, 'darslar-vizual-pro.js'))
require(path.join(SRC, 'darslar-vazifa-basic.js'))
require(path.join(SRC, 'darslar-vazifa-pro.js'))
require(path.join(SRC, 'darslar-github.js'))
require(path.join(SRC, 'darslar-imtihon.js'))

// Rus tarjima overlaylari (ru/ru-*.js → window.DARSLAR_RU)
const ruDir = path.join(SRC, 'ru')
if (fs.existsSync(ruDir)) {
  fs.readdirSync(ruDir).filter(function(f){ return f.endsWith('.js'); }).sort().forEach(function(f){
    require(path.join(ruDir, f))
  })
  console.log('   RU overlay:', Object.keys(window.DARSLAR_RU || {}).length, 'dars')
}

const data = 'export const DARSLAR = ' + JSON.stringify(window.DARSLAR, null, 2) + ';\n\n'
           + 'export const DARSLAR_RU = ' + JSON.stringify(window.DARSLAR_RU || {}, null, 2) + ';\n\n'
           + 'export const KETMA = ' + JSON.stringify(window.KETMA) + ';\n'
wr('src/data/darslar.js', data)

console.log('Tayyor. Darslar:', window.KETMA.length)
