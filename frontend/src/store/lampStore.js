import { create } from 'zustand';

const KEY = 'ny-lamp';

const read = () => {
  try { return localStorage.getItem(KEY) !== 'off'; } catch { return true; } // default: lamp on
};
const write = (on) => {
  try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch { /* private mode: keep it in memory only */ }
};

/** "Lamp mode": the page is dark and the visitor's cursor is a lantern. On by default; the visitor can switch it off. */
const useLampStore = create((set, get) => ({
  on: read(),
  toggle: () => { const on = !get().on; write(on); set({ on }); },
  setOn: (on) => { write(on); set({ on }); },
}));

export default useLampStore;
