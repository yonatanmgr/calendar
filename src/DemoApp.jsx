/* eslint-disable no-restricted-globals */
import { React } from 'react'
import FullCalendar, { formatDate } from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './event-utils'
// import moment from 'moment'
import heLocale from '@fullcalendar/core/locales/he';

var db = require('./api/server')
db.postReq(db.newUser("0502240010", true))

class User{
  blocked;
  admin;

  constructor(phone, blocked = false, admin = false){
    this.phone = phone;
    this.blocked = blocked;
    this.admin = admin;
  }

  block(){ this.blocked = true; console.log("נחסם") }
  unblock(){ this.blocked = false; console.log("בוטלה החסימה")}
}

let adminUser = new User("0502240010", false, true)

// let users = [adminUser]
const phoneRegex = new RegExp('^05[0-9]-?[0-9]{7}$')


var genColor = () => {
  let hue = 360 * Math.random()
  let stauration = 25 + 70 * Math.random()
  let lightness = 78 + 4 * Math.random()

  let color = "hsl(" + hue + ',' +
    stauration + '%,' +
    lightness + '%)'

  let lightercolor = "hsl(" + hue + ',' +
    (stauration-7) + '%,' +
    (lightness+13) + '%)'


  var r = document.querySelector(':root');
  r.style.setProperty('--user-color', color);
  r.style.setProperty('--lighter-user-color', lightercolor);
}

genColor()


export default class App extends React.Component {

  state = {
    weekendsVisible: true,
    currentEvents: [],
    businessHours: {
      startTime: '08:00', endTime: '18:00'
    },
    slotDuration: {minutes:30},
    isLoggedIn: false,
    adminState: false,
    currentUser: {}
  }
  
  adminTheme(){
    var r = document.querySelector(':root');
    
    if(this.state.adminState){
      r.style.setProperty('--admin-state', 'var(--user-color)');
      r.style.setProperty('--user-state', "var(--lighter-user-color)");
    }

    else{
      r.style.setProperty('--user-state', 'var(--user-color)');
      r.style.setProperty('--admin-state', "var(--lighter-user-color)");
    }
  }


  
  handleLogin() {
    console.log(this.state.isLoggedIn)
    if (this.state.isLoggedIn === false){
      let loginPhone = prompt('מה מספר הטלפון שלך?').replace("-", "")
      if (phoneRegex.test(loginPhone) === true){
        alert('התחברת בהצלחה!')
        if (loginPhone == adminUser.phone){
          this.setState({ adminState: true })
          this.adminTheme()
        }
        this.setState({ isLoggedIn: true })
        let loggingUser = new User(loginPhone, false, false)
        
        this.setState({ currentUser: loggingUser })
        
      }
      else{
        alert('נא להכניס מספר טלפון תקין!')
        this.handleLogin()
      }
    }
    else {return {}}
    console.log(this.state.currentUser)
  }
  
  render() {
    
    return(
      <div className='app' onLoad={this.handleLogin()}>
        
        <div className='calendar'>
          {this.renderCalendar()}
        </div>
        <div className='sidebar'>
          {this.renderActions()}
          {this.renderSidebar()}
        </div>
      </div>
    )
  }

  renderCalendar(){
    
    return (
          <FullCalendar
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            headerToolbar={{
              start: 'prev,next today',
              center: 'title',
              end: 'user admin'
            }}
            customButtons={{
              user: {
                  text: 'משתמש 🙂',
                  click: () => {
                    this.setState({
                      adminState: false
                    })
                    this.adminTheme()
                  }
              },
              admin: {
                text: 'מנהל 😎',
                click: () => {
                  if (prompt('הכניסו מספר טלפון') == adminUser.phone) {
                    this.setState({ adminState: true })
                    this.adminTheme()
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
            
            eventAdd={function(){console.log("add")}}
            eventChange={function(){}}
            eventRemove={function(){}}
          />
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
    let current_state = this.state
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect() // clear date selection
    let name = prompt('נא להכניס שם מלא')
     

    if (name) {
      calendarApi.addEvent({
        extendedProps: {name: name},
        id: createEventId(),
        title: prompt('הערות?'),
        start: selectInfo.startStr,
        end: selectInfo.startStr + current_state.slotDuration
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
    <div>
      <span dir='rtl'>{formatDate(eventInfo.event.start, {locale: 'he', hour: 'numeric', minute:'numeric'})}:</span>
      <b>{eventInfo.event.title}</b>
  </div>
  )
}

function renderSidebarEvent(event) {
  if (event.title === ""){
    return (
      <div key={event.id} className="eventCard">
        <div className="cardContent">
        <p>
          <b>{event.extendedProps.name} / </b>
          <span dir='rtl'>{formatDate(event.start, {locale: 'he', month: 'long', day: 'numeric', hour: 'numeric', minute:'numeric'})}</span>
        </p>
        </div>
      </div>
    )
  }
  return (
    <div key={event.id} className="eventCard">
      <div className="cardContent">
        <p>
          <b>{event.extendedProps.name} / </b>
          <span dir='rtl'>{formatDate(event.start, {locale: 'he', month: 'long', day: 'numeric', hour: 'numeric',
            minute:'numeric'})}</span>
        </p>
        <p>הערה:<b>{event.title}</b></p>
      </div>
    </div>
  )
}

