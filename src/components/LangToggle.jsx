export default function LangToggle({ til, onChange }){
  const base = { fontFamily:'ui-monospace,Menlo,monospace', fontSize:'13px', padding:'5px 12px',
    border:'1px solid #2a2c4e', background:'transparent', color:'#9a9cc4', cursor:'pointer',
    borderRadius:'8px', fontWeight:700 }
  const on = { ...base, background:'#7c5cff', color:'#fff', borderColor:'#7c5cff' }
  return (
    <div style={{ position:'fixed', top:'12px', right:'14px', zIndex:200, display:'flex', gap:'6px',
      background:'rgba(15,16,32,.85)', padding:'4px', borderRadius:'10px', border:'1px solid #2a2c4e',
      backdropFilter:'blur(8px)' }}>
      <button style={til==='uz'?on:base} onClick={()=>onChange('uz')}>UZ</button>
      <button style={til==='ru'?on:base} onClick={()=>onChange('ru')}>RU</button>
    </div>
  )
}
