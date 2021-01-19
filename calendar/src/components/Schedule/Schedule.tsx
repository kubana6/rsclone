import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import someEvents from './events';
import moment from 'moment';
import { EventsScheduleProps, Events } from './Schedule.types';
import classes from './styles/Schedule.module.scss';
import i18n from '../../i18ns';
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import 'moment/locale/de';
import { FormElement } from '../Form/Forms';
moment.locale(`${i18n.language}`);
const localizer = momentLocalizer(moment);

const EventsSchedule: React.FC<EventsScheduleProps> = ({
  date,
  changeDate,
  t,
}) => {
  const [events, setEvents] = useState<Events[]>(someEvents);
  const [holidays, setHolidays] = useState<Events[]>([]);
  const [isHolidaysSelected, changeIsHolidaysSelected] = useState<boolean>(
    false
  );
  const [modalActive, changeModalActive] = useState(false);

  const getHolidays = () => {
    const url =
      'https://holidayapi.com/v1/holidays?pretty&key=79470c0f-95f1-4988-9261-54417f3e6da3&country=BY&year=2020';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        data.holidays.map((holiday: any) => {
          return setHolidays((prev) => [
            ...prev,
            {
              start: holiday.date,
              end: holiday.observed,
              title: holiday.name,
            },
          ]);
        });
      })
      .catch(Error);
  };

  useEffect(() => {
    getHolidays();
  }, []);

  const toggleHolidays = () => {
    changeIsHolidaysSelected((prev) => !prev);
  };

  const getAllEvents = () => {
    if (isHolidaysSelected) {
      return [...events, ...holidays];
    } else {
      return events;
    }
  };

  const addNewEvent = ({
    start,
    end,
  }: {
    start: object | string;
    end: object | string;
  }) => {
    changeModalActive(true);
    const title = 'f';
    if (title)
      setEvents((prev) => [
        ...prev,
        {
          start,
          end,
          title,
        },
      ]);
  };
  return (
    <div className={classes.schedule}>
      <label>
        <input
          type="checkbox"
          onChange={toggleHolidays}
          checked={isHolidaysSelected}
        />
        Belarus's Holidays
      </label>
      <Calendar
        style={{ height: '90vh' }}
        localizer={localizer}
        culture={i18n.language}
        events={getAllEvents()}
        startAccessor="start"
        date={date?.toDate()}
        endAccessor="end"
        selectable
        onNavigate={(e) => {
          changeDate(moment(e));
        }}
        onSelectSlot={addNewEvent}
        onSelectEvent={(event) => alert(event.title)}
        popup
        step={15}
        timeslots={8}
        toolbar
        messages={{
          next: t('Next'),
          previous: t('Back'),
          today: t('Today'),
          month: t('Month'),
          week: t('Week'),
          day: t('Day'),
          agenda: t('Agenda'),
        }}
      />
      {modalActive && <FormElement changeModalActive={changeModalActive} />}
    </div>
  );
};

export default EventsSchedule;
