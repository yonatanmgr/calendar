/* eslint-disable no-restricted-globals */
import React from "react";
import FullCalendar, { formatDate } from '@fullcalendar/react'
import timeGridPlugin from '@fullcalendar/timegrid'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
// import moment from 'moment'
import heLocale from '@fullcalendar/core/locales/he';
import axios from 'axios'


function genColor(){
  let hue = 360 * Math.random()
  let stauration = 25 + 50 * Math.random()
  let lightness = 78 + 4 * Math.random()
  return {hue: hue, stauration: stauration, lightness: lightness}
}

const hsl2rgb = (h, s, l) => {
  s /= 100;
  l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [255 * f(0), 255 * f(8), 255 * f(4)];
};

class User{
  blocked;
  admin;
  userColor = genColor()
  
  constructor(phone, blocked = false, admin = false){
    this.phone = phone;
    this.blocked = blocked;
    this.admin = admin;
  }

  block(){ this.blocked = true; console.log("נחסם") }
  unblock(){ this.blocked = false; console.log("בוטלה החסימה")}
}

class WorkDay{
  constructor(date, startTime, endTime, workers, slots=[]){
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.workers = workers;
    this.slots = slots;
  }

  clearSlots(){
    this.slots = []
  }
}




let date1 = new Date(2022, 8, 5);
let date2 = new Date(2022, 8, 6);
let date3 = new Date(2022, 8, 7);
let date4 = new Date(2022, 8, 9);
let date5 = new Date(2022, 8, 21);
let date6 = new Date(2022, 8, 10);

let days = [date1, date2, date3, date4, date5, date6] 
let allowedDays = days.map(date => date.setHours(0, 0, 0, 0))

let adminUser = new User("0502240010", false, true)

const phoneRegex = new RegExp('^05[0-9]-?[0-9]{7}$')


function setColors(user){
  var r = document.querySelector(':root');

  let color = `hsl(${user.userColor.hue}, ${user.userColor.stauration}%, ${user.userColor.lightness}%)`
  r.style.setProperty('--user-color', color);
  
  let lightercolor = `hsl(${user.userColor.hue}, ${user.userColor.stauration-7}%, ${user.userColor.lightness+13}%)`
  r.style.setProperty('--lighter-user-color', lightercolor);
}
 
export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
  }

  state = {
    // eventId: 0,
    weekendsVisible: true,
    currentEvents: [],
    businessHours: {
      startTime: '08:00', endTime: '18:00'
    },
    slotDuration: {minutes:30},
    isLoggedIn: false,
    adminState: false,
    currentUser: "",
    signUp: true,
    users: [],
  }

  componentDidMount() {
    window.addEventListener('load', this.handleLoad);
  }

  handleLoad() {
    this.handleLogin() 
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

  async handleLogin() {
    if (!this.state.isLoggedIn) {
      let loginPhone = prompt('מה מספר הטלפון שלך?')
      if (phoneRegex.test(loginPhone)) {

        let loggingUser = new User(loginPhone.replace("-", ""))

        await axios.request({
          url: `http://localhost:3001/users/${loggingUser.phone}`,
          method: "GET",
          headers: {"Content-Type": "application/json"}
        })
        .then(async res => {
          if (res.data == "none"){
            await axios.request({
              url: "http://localhost:3001/users",
              method: "POST",
              headers: {"Content-Type": "application/json"},
              data: JSON.stringify(loggingUser)
            })
            .then(res=>{this.setState({currentUser: res.data, isLoggedIn: true}); setColors(res.data)})
          }
          else{
            this.setState({currentUser: res.data, isLoggedIn: true}, setColors(res.data))
          }
          }
        )
      }
  
      else {
        alert('נא להכניס מספר טלפון תקין!')
        this.handleLogin()
      }

    }
    
    else {
      setColors(this.state.currentUser);
      return {}
    }

  }

  render() { 
    return(
      <div className='app'>
        
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
    if (!this.state.adminState){
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
                this.setState({ adminState: false })
                this.adminTheme()
              }
          },
          admin: {
            text: 'מנהל 😎',
            click: () => {
              if (this.state.currentUser.admin) {
                this.setState({ adminState: true })
                this.adminTheme()
              } else {
                alert('אתם לא מנהלים!')
              }
            }
          }
        }}

        // selectConstraint={this.state.businessHours}
        initialView='timeGridWeek'
        editable={true}
        // businessHours={this.state.businessHours}
        nowIndicator={true}
        allDaySlot={false}
        titleFormat={{ year: 'numeric', month: 'long' , day: 'numeric'}}
        titleRangeSeparator={" עד "}
        selectable={true}
        slotDuration={this.state.slotDuration}
        defaultTimedEventDuration={this.state.slotDuration}
        // scrollTime={this.state.businessHours.startTime}
        locale={heLocale}
        selectMirror={true}
        dayMaxEvents={true}
        eventSources={[`http://localhost:3001/users/${this.state.currentUser.phone}/events`]}
        eventDurationEditable={false}
        eventStartEditable={false}
        forceEventDuration={true}
        eventBorderColor={"transparent"}
        // eventConstraint={this.state.businessHours}
        displayEventTime={false}
        events={this.state.events} // alternatively, use the `events` setting to fetch from a feed
        select={this.handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={this.handleEventClick}
        eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
        
        eventAdd={
          async function (addInfo) {
            await axios.request({
              url: "http://localhost:3001/events",
              method: "POST",
              headers: {"Content-Type": "application/json"},
              data: JSON.stringify(addInfo.event),
            });
          }
        }
        eventChange={function(){}}
        eventRemove={
          async function (removeInfo) {
            await axios.request({
              url: "http://localhost:3001/events",
              method: "DELETE",
              headers: {"Content-Type": "application/json"},
              data: JSON.stringify(removeInfo.event),
            });
          }
        }
      />
    )}
    else return (
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
        headerToolbar={{
          start: 'prev,next today blockUser,newDay',
          center: 'title',
          end: 'user admin'
        }}
        customButtons={{
          user: {
              text: 'משתמש 🙂',
              click: () => {
                this.adminTheme()
                this.setState({
                  adminState: false
                })
              }
          },
          admin: {
            text: 'מנהל 😎',
            click: () => {
                this.adminTheme()
                alert('תצוגת מנהל כבר מופעלת!')
              }
          },
          blockUser: {
            text: 'חסימת משתמש 🚫',
            click: async () => {
              let blockedPhone = prompt("את מי תרצו לחסום?")
              await axios.request({
                url: `http://localhost:3001/users/${blockedPhone}`,
                method: "GET",
                headers: {"Content-Type": "application/json"}
              }).then(
                async res => {
                  if (res.data.blocked == true){
                    let unBlockedPhone = prompt("כדי לבטל את חסימת המשתמש, נא כתבו את מספרו שנית")
                    if(unBlockedPhone==blockedPhone){
                      await axios.request({
                        url: `http://localhost:3001/users/${blockedPhone}`,
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        params: {phone: unBlockedPhone},
                        data: {blocked: false}
                      })
                    }
                    alert(`החסימה עבור המשתמש ${blockedPhone} בוטלה!`)

                  }
                  else{
                    await axios.request({
                      url: `http://localhost:3001/users/${blockedPhone}`,
                      method: "PUT",
                      headers: {"Content-Type": "application/json"},
                      params: {phone: blockedPhone},
                      data: {blocked: true}
                    })
                    alert(`המשתמש ${blockedPhone} נחסם בהצלחה!`)
                  }
                }
              )
              
            }
          },
          newDay: {
            text: 'יום חדש להרשמה ✏️',
            click: () => {

            }
          }
        }}

        // selectConstraint={this.state.businessHours}
        initialView='timeGridWeek'
        editable={true}
        // businessHours={this.state.businessHours}
        nowIndicator={true}
        allDaySlot={false}
        titleFormat={{ year: 'numeric', month: 'long' , day: 'numeric'}}
        titleRangeSeparator={" עד "}
        selectable={true}
        slotDuration={this.state.slotDuration}
        defaultTimedEventDuration={this.state.slotDuration}
        // scrollTime={this.state.businessHours.startTime}
        locale={heLocale}
        selectMirror={true}
        dayMaxEvents={true}
        eventSources={['http://localhost:3001/events']}
        eventDurationEditable={false}
        eventStartEditable={false}
        forceEventDuration={true}
        eventBorderColor={"transparent"}
        // eventConstraint={this.state.businessHours}
        displayEventTime={false}
        events={this.state.events} // alternatively, use the `events` setting to fetch from a feed
        select={this.handleDateSelect}
        eventContent={renderEventContent} // custom render function
        eventClick={this.handleEventClick}
        eventsSet={this.handleEvents} // called after events are initialized/added/changed/removed
        
        eventAdd={
          async function (addInfo) {
            await axios.request({
              url: "http://localhost:3001/events",
              method: "POST",
              headers: {"Content-Type": "application/json"},
              data: JSON.stringify(addInfo.event),
            });
          }
        }
        eventChange={function(){}}
        eventRemove={
          async function (removeInfo) {
            await axios.request({
              url: "http://localhost:3001/events",
              method: "DELETE",
              headers: {"Content-Type": "application/json"},
              data: JSON.stringify(removeInfo.event),
            });
          }
        }
      />
    )
  }

  renderActions(){
    if (this.state.adminState){
      return (
        <div dir='rtl' className='actions'>
          <h1>📆 כל האירועים <span class='counter'> {this.state.currentEvents.length} </span></h1>
        </div>
      )  
    }
    else{
      return (
        <div dir='rtl' className='actions'>
          <h1>📆 האירועים שלי  <span class='counter'> {this.state.currentEvents.length} </span></h1>
        </div>
      )
  }}

  renderSidebar() {
    return (
      <div dir='rtl' className="eventList">
        {this.state.currentEvents.map(renderSidebarEvent)}
      </div>
    )
  }

  handleDateSelect = (selectInfo) => {
    if (!this.state.currentUser.blocked){
      if (allowedDays.includes(selectInfo.start.setHours(0, 0, 0, 0))){
        let current_state = this.state
        let calendarApi = selectInfo.view.calendar
        calendarApi.unselect()

        let name = prompt('נא להכניס שם מלא')
        let title = prompt('הערות?')

        
        if (name) {
          calendarApi.addEvent({
            extendedProps: {
              name: name,
              user: current_state.currentUser
            },
            backgroundColor: `rgb(${hsl2rgb(current_state.currentUser.userColor.hue, current_state.currentUser.userColor.stauration, current_state.currentUser.userColor.lightness)})`,
            title: title,
            start: selectInfo.startStr,
            end: selectInfo.startStr + current_state.slotDuration
          })
        }

      }
      else{
        selectInfo.view.calendar.unselect(); alert("יום זה אינו פתוח להרשמה")
      }
    }
    else{selectInfo.view.calendar.unselect(); alert("המשתמש חסום - אין באפשרותך להירשם לאירועים נוספים")}
  }
  handleNewWorkDay = (selectInfo) => {
    // let current_state = this.state
    let calendarApi = selectInfo.view.calendar
    calendarApi.unselect()

    let workers = prompt('מהו מספר העובדים?')
    
    if (workers) {
      calendarApi.addEvent({
        extendedProps: {
          workerNum: workers,
        },
        groupId: 'workDay',
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        display: 'inverse-background'
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
      <div key={event.id} className="eventCard" style={{backgroundColor: event.backgroundColor}}>
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
    <div key={event.id} className="eventCard" style={{backgroundColor: event.backgroundColor}}>
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

