import React, { useState, useEffect } from 'react';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import someEvents from './events';
import classes from './styles/Schedule.module.scss'
import { EventsScheduleProps, Events } from './Schedule.types'

moment.locale('en-GB');

const localizer = momentLocalizer(moment);

const EventsSchedule: React.FC<EventsScheduleProps> = ({ date, changeDate }) => {
  const [events, setEvents] = useState<Events[]>(someEvents);
  const [holidays, setHolidays] = useState<Events[]>([]);
  const [isHolidaysSelected, changeIsHolidaysSelected] = useState<boolean>(false);

  const getHolidays = () => {
    const url = 'https://holidayapi.com/v1/holidays?pretty&key=79470c0f-95f1-4988-9261-54417f3e6da3&country=BY&year=2020';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.holidays.map((holiday: any) => {
          return setHolidays(prev => [...prev, {
            start: holiday.date,
            end: holiday.observed,
            title: holiday.name
          }])
        })
      })
      .catch(Error)
  }

  useEffect(() => {
    getHolidays();
  }, []);
 

  const toggleHolidays = () => {
    changeIsHolidaysSelected(prev => !prev)
  }

  const getAllEvents = () => {
    if (isHolidaysSelected) {
      return [...events, ...holidays];
    } else {
      return events;
    }
  }

  const handleSelect = ({ start, end } : { start: object | string, end :object | string}) => {
    const title = window.prompt('New Event name');
    if (title)
     setEvents(prev => [...prev, {
            start,
            end,
            title,
     }]);
  };
    return (
      <div className={classes.schedule}>
        <input type='checkbox' onChange={toggleHolidays} checked={isHolidaysSelected} />
        <span>Belarus's Holidays</span>
        <Calendar
          style={{ height: '90vh' }}
          localizer={localizer}
          events={getAllEvents()}
          startAccessor="start"
          date={date}
          endAccessor="end"
          selectable
          onNavigate={changeDate}
          onSelectSlot={handleSelect}
          onSelectEvent={event => alert(event.title)}
          popup
          step={15}
          timeslots={8}
          toolbar
        />
      </div>
    );
  }

export default EventsSchedule;
