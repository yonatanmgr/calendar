let eventGuid = 0
let todayStr = new Date().toISOString().replace(/T.*$/, '') // YYYY-MM-DD of today

export const INITIAL_EVENTS = [
  {
    id: createEventId(),
    title: 'יא וולי',
    name: 'יונתן  ',
    start: todayStr + 'T14:00:00'
  },
  {
    id: createEventId(),
    title: 'איזה אירועים',
    name: 'יונתן',
    start: todayStr + 'T02:00:00'
  },
  {
    id: createEventId(),
    title: 'אירועעע',
    name: 'נדב',
    start: todayStr + 'T12:00:00'
  },
  {
    id: createEventId(),
    title: 'אירוע ב',
    name: 'יועד',
    start: todayStr + 'T20:00:00'
  },
  {
    id: createEventId(),
    title: 'אירועשדגב',
    name: 'שקד',
    start: todayStr + 'T22:00:00'
  }
]

export function createEventId() {
  return String(eventGuid++)
}