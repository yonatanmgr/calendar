let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'אירוע ב',
    name: 'אאאא',
    start: todayStr + 'T14:00:00'
  },
  {
    id: createEventId(),
    title: 'אירוע ב',
    name: 'אאאא',
    start: todayStr + 'T02:00:00'
  },
  {
    id: createEventId(),
    title: 'אירוע ב',
    name: 'אאאא',
    start: todayStr + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'אירוע ב',
    name: 'אאאא',
    start: todayStr + 'T20:00:00'
  },
  {
    id: createEventId(),
    title: 'אירוע ב',
    name: 'אאאא',
    start: todayStr + 'T22:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}