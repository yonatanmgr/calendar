/* eslint-disable no-restricted-globals */
import React from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
// import moment from 'moment'
import heLocale from '@fullcalendar/core/locales/he';
// const { MongoClient } = require('mongodb');

// const uri =
//   "mongodb+srv://Yonatan:Z1x2c3v4y@calendar.x0xgfz3.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri);
// async function run(p) {
//   try {
//     const database = client.db('sample_mflix');
//     const users = database.collection('users');
//     // Query for a movie that has the title 'Back to the Future'
//     const doc = { phone: p };
//     const user = await users.insertOne(doc);
//     console.log(user);
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

let adminPhones = ["123", "456"]
var adminState = false
const phoneRegex = new RegExp('^05[0-9]-?[0-9]{7}$')
var isLoggedIn = false

function adminTheme(){
  var r = document.querySelector(':root');

  if(adminState){
    r.style.setProperty('--admin-state', 'var(--user-color)');
    r.style.setProperty('--user-state', 'var(--disabled)');
  }
  else{
    r.style.setProperty('--user-state', 'var(--user-color)');
    r.style.setProperty('--admin-state', 'var(--disabled)');
  }
}

function login(){
  if (isLoggedIn === false){
    let loginPhone = prompt('מה מספר הטלפון שלך?').replace("-", "")
    if (phoneRegex.test(loginPhone) === true){
      alert('התחברת בהצלחה!')
      isLoggedIn = true
      console.log(loginPhone)
    }
    else{
      alert('נא להכניס מספר טלפון תקין!')
    }
  }
  else return
}

export default class DemoApp extends React.Component {
  state = {
    weekendsVisible: true,
    currentEvents: [],
    businessHours: {
      startTime: '08:00', endTime: '18:00'
    },
    slotDuration: {minutes:30},
  }
  
  render() {
    login()  

    return(
    <div className='app'>
        {this.renderCalendar()}
        <div className='sidebar'>
          {this.renderActions()}
          {this.renderSidebar()}
        </div>
      </div>
  )
  }

  renderCalendar(){
    return (
        <div className='calendar'>
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              start: 'prev,next today',
              center: 'title',
              end: 'user admin'
            }}
            customButtons={{
              user: {
                  text: 'משתמש 🙂',
                  click: () => {
                    adminState = false;
                    adminTheme()
                  }
              },
              admin: {
                text: 'מנהל 😎',
                click: () => {
                  if (adminPhones.includes(prompt('הכניסו מספר טלפון'))) {
                    adminState = true;
                    adminTheme()
                  } else {
                    alert('אתה לא מנהל!')
                  }
                }
              }
            }}
            initialView='timeGridWeek'
            editable={true}
            businessHours={this.state.businessHours}
            nowIndicator={true}
            allDaySlot={false}
            titleFormat={{ year: 'numeric', month: 'long' , day: 'numeric'}}
            titleRangeSeparator={" עד "}
            selectable={true}
            slotDuration={this.state.slotDuration}
            defaultTimedEventDuration={this.state.slotDuration}
            scrollTime={this.state.businessHours.startTime}
            locale={heLocale}
            selectMirror={true}
            dayMaxEvents={true}
            eventDurationEditable={false}
            eventStartEditable={false}
            forceEventDuration={true}
            eventBorderColor={"transparent"}
            eventConstraint={this.state.businessHours}
            weekends={this.state.weekendsVisible}
            displayEventTime={false}
            initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
            select={this.handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={this.handleEventClick}
            eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
            
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      )
  }

  renderActions(){
    return (
      <div dir='rtl' className='actions'>
        <h1>📆 האירועים שלי  <span class='counter'> {this.state.currentEvents.length} </span></h1>
      </div>
    )
  }

  renderSidebar() {
    return (
      <div dir='rtl' className="eventList">
        {this.state.currentEvents.map(renderSidebarEvent)}
      </div>
    )
  }

  handleDateSelect = (selectInfo) => {
    let title = prompt('מה שם האירוע?')
    let calendarApi = selectInfo.view.calendar
     
    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.startStr + {minutes:30}
      })
    }
  }

  handleEventClick = (clickInfo) => {
    if (confirm(`בטוחים שתרצו למחוק את האירוע '${clickInfo.event.title}'?`)) {
      clickInfo.event.remove()
    }
  }

  handleEvents = (events) => {
    this.setState({
      currentEvents: events
    })
  }
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

function renderSidebarEvent(event) {
  return (
    <div key={event.id} className="eventCard">
      <div className="cardContent">
        <p>{formatDate(event.start, {locale: 'he', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute:'numeric'})}</p>
        <p>הערה:<b>{event.title}</b></p>
      </div>
    </div>
  )
}