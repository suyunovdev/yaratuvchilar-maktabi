import { useSyncExternalStore } from 'react'

// localStorage'ga tayangan yagona progress do'koni (sidebar + dars sinxron).
const KEY = 'rk-progress-v1'

function safeLoad(){
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch(e){ return {} }
}
function normalize(s){ return { done: s.done || {}, hw: s.hw || {}, xp: s.xp || 0 } }

let state = normalize(typeof localStorage !== 'undefined' ? safeLoad() : {})
const listeners = new Set()

function save(){ try { localStorage.setItem(KEY, JSON.stringify(state)) } catch(e){} }
function set(next){ state = next; save(); listeners.forEach(l => l()) }

export const progress = {
  subscribe(l){ listeners.add(l); return () => listeners.delete(l) },
  get(){ return state },
  markDone(k){ if(!k || state.done[k]) return; set({ ...state, done: { ...state.done, [k]: true } }) },
  addXp(n){ set({ ...state, xp: state.xp + n }) },
  toggleHw(k, i){
    const cur = state.hw[k] || {}
    set({ ...state, hw: { ...state.hw, [k]: { ...cur, [i]: !cur[i] } } })
  }
}

export function useProgress(){
  return useSyncExternalStore(progress.subscribe, progress.get, progress.get)
}
