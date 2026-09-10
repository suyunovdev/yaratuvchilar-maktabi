# IT Kurs Metodikasi — React versiyasi

Statik sayt (`~/metodika-it-kurs`) **hech narsa o'zgartirmasdan** React'ga (Vite)
ko'chirildi. Bir xil dizayn, bir xil kontent, bir xil 84 dars, bir xil hayotiy
misollar — faqat routing va tuzilma React'ga o'tdi.

## Ishga tushirish

```bash
cd ~/metodika-react
npm install        # bir marta
npm run dev        # http://localhost:5173
```

Production build:
```bash
npm run build      # dist/ ga yig'adi
npm run preview    # build'ni ko'rish
```

## Tuzilma

| Fayl | Vazifa |
|------|--------|
| `src/main.jsx` | React kirish + routing (`/` va `/dars/:k`) |
| `src/pages/Home.jsx` | Bosh sahifa + bosiladigan sillabus |
| `src/pages/Dars.jsx` | Dars detail (kirish, mavzular, hayotiy misollar, kod, uy vazifasi) |
| `src/data/darslar.js` | 84 dars ma'lumoti (asl fayllardan aynan generatsiya) |
| `src/styles/home.css`, `dars.css` | Asl CSS (aynan ko'chirilgan) |
| `src/html/home.html`, `darsShell.html` | Asl HTML tuzilishi (aynan) |
| `scripts/prep.cjs` | Asl saytdan CSS/HTML/ma'lumotni qayta generatsiya qiladi |

## Muhim tamoyil

Dizayn va kontent asl `~/metodika-it-kurs` bilan **bir xil**. CSS va HTML asl
fayllardan `scripts/prep.cjs` orqali aynan ko'chirildi; o'zgargani — statik
`dars.html?k=...` havolalari React routing (`/dars/...`) ga aylandi.

Asl saytni yangilasangiz, `npm run prep` bilan React manbasini qayta
generatsiya qilishingiz mumkin.

## Marshrutlar

- `/` — bosh sahifa (falsafa, farq, struktura, sillabus)
- `/dars/b1` … `/dars/b36` — Basic darslari
- `/dars/p1` … `/dars/p48` — Pro darslari
