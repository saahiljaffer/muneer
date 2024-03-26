import { Menu, Transition } from '@headlessui/react'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { useState } from 'react'

import hijri from '~/utils/hijri'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(advancedFormat)
dayjs.extend(hijri)

const holidays = [
  { date: '09-10', title: 'Wafat of Bibi Khadija (a)', color: 'black' },
  { date: '09-15', title: 'Wiladat of Imam Hassan (a)', color: 'green' },
  { date: '09-19', title: 'Wafat of Imam Ali (a)', color: 'black' },
  { date: '09-21', title: 'Wafat of Imam Ali (a)', color: 'black' },
  { date: '09-23', title: 'Laylatul Qadr', color: 'green' },
  { date: '10-01', title: 'Eid al-Fitr', color: 'green' },
]

function generateCalendarArray(year, month) {
  const startDate = dayjs(`${year}-${month}-01`, 'iYYYY-iM-iDD').startOf('week')
  const endDate = dayjs(`${year}-${month + 1}-01`, 'iYYYY-iM-iDD')
    .subtract(1, 'day')
    .endOf('week')
  const today = dayjs()
  let days = []

  for (
    let date = startDate;
    date.isSameOrBefore(endDate);
    date = date.add(1, 'day')
  ) {
    let dateObject = date.format('iYYYY-iMM-iDD')
    let englishDate = date.format('YYYY-MM-DD')
    let isCurrentMonth = false,
      isToday = false,
      color: string

    // @ts-ignore
    if (date.iMonth() === month - 1) {
      isCurrentMonth = true
    }

    // Check if the date is today
    if (date.isSame(today, 'day')) {
      isToday = true
    }

    // Check if the date is the selected date
    color = holidays.find(
      (holiday) => holiday.date === date.format('iMM-iDD'),
    )?.color

    days.push({
      date: dateObject,
      englishDate,
      isCurrentMonth,
      isToday,
      color,
    })
  }

  return days
}

export default function Example({ events }) {
  const [year, setYear] = useState(1445)
  const [month, setMonth] = useState(9)

  const days = generateCalendarArray(year, month)
  const header = dayjs(`${year}-${month}-01`, 'iYYYY-iM-iDD').format(
    'iMMMM iYYYY',
  )
  const startOfMonth = dayjs(`${year}-${month}-01`, 'iYYYY-iM-iDD')
  const endOfMonth = dayjs(`${year}-${month + 1}-01`, 'iYYYY-iM-iDD').subtract(
    1,
    'day',
  )
  let englishHeader

  if (startOfMonth.isSame(endOfMonth, 'month')) {
    englishHeader = startOfMonth.format('MMMM YYYY')
  } else {
    englishHeader = `${startOfMonth.format('MMMM YYYY')} - ${endOfMonth.format('MMMM YYYY')}`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-base font-semibold leading-6 text-slate-900">
        Upcoming Events
      </h2>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
        <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9">
          <div className="flex items-center text-slate-900">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-slate-500 hover:text-slate-600"
              onClick={() => {
                if (month === 1) {
                  setYear(year - 1)
                  setMonth(12)
                } else {
                  setMonth(month - 1)
                }
              }}
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              className="flex-auto text-sm font-semibold group"
              onClick={() => {
                // @ts-ignore
                setYear(dayjs().iYear())
                // @ts-ignore
                setMonth(dayjs().iMonth() + 1)
              }}
            >
              <span className="group-hover:underline group-hover:text-slate-800">
                {header}
              </span>
              <span className="block text-xs text-slate-500 group-hover:text-slate-600 group-hover:underline">
                {englishHeader}
              </span>
            </button>
            <button
              disabled={year === 1446 && month === 11}
              onClick={() => {
                if (month === 12) {
                  setYear(year + 1)
                  setMonth(1)
                } else {
                  setMonth(month + 1)
                }
              }}
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-slate-500 hover:text-slate-600"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-slate-500">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-slate-200 text-sm shadow ring-1 ring-slate-200">
            {days.map((day, dayIdx) => (
              <div
                key={day.date}
                className={clsx(
                  'py-2 focus:z-10',
                  // regular bg color for current month
                  day.isCurrentMonth &&
                    !day.isToday &&
                    !day.color &&
                    'bg-white',
                  // regular bg color for previous or next month
                  !day.isCurrentMonth && 'bg-slate-50',
                  // text color for today and holidays
                  (day.color || day.isToday) &&
                    day.isCurrentMonth &&
                    'font-semibold text-white',
                  // regular text color for current month
                  !day.color &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-slate-900',
                  //  text color for previous or next month
                  !day.isCurrentMonth && 'text-slate-400',
                  dayIdx === 0 && 'rounded-tl-lg',
                  dayIdx === 6 && 'rounded-tr-lg',
                  day.isToday && !day.color && 'bg-blue-600',
                  day.isCurrentMonth && day.color === 'green' && 'bg-blue-600',
                  day.isCurrentMonth && day.color === 'black' && 'bg-slate-900',
                  dayIdx === days.length - 7 && 'rounded-bl-lg',
                  dayIdx === days.length - 1 && 'rounded-br-lg',
                )}
              >
                <time
                  dateTime={day.date}
                  className="w-full flex flex-col h-7 px-2 items-end justify-center rounded-full"
                >
                  <p>{day.date.split('-').pop().replace(/^0/, '')}</p>
                  <p
                    className={clsx(
                      'text-xs',
                      // regular text color for current month
                      !day.color && day.isCurrentMonth && 'text-slate-600',
                      // text color for holidays
                      day.color && day.isCurrentMonth && 'text-slate-200',
                      // text color for previous or next month
                      !day.isCurrentMonth && 'text-slate-400',
                    )}
                  >
                    {day.englishDate.split('-').pop().replace(/^0/, '')}
                  </p>
                </time>
              </div>
            ))}
          </div>
        </div>

        <ol className="mt-4 divide-y divide-slate-200 text-sm leading-6 lg:col-span-7 xl:col-span-8">
          {events.map((event) => (
            <li
              key={event.title}
              className="relative flex space-x-6 py-6 xl:static"
            >
              <div className="flex-auto">
                <h3 className="pr-10 font-semibold text-slate-900 xl:pr-0">
                  {event.title}
                </h3>
                <dl className="mt-2 flex flex-col text-slate-500 xl:flex-row">
                  <div className="flex items-start space-x-3">
                    <dt className="mt-0.5">
                      <span className="sr-only">Date</span>
                      <CalendarIcon
                        className="h-5 w-5 text-slate-400"
                        aria-hidden="true"
                      />
                    </dt>
                    <dd>
                      <time dateTime={event.startDatetime}>
                        {dayjs(event.startDatetime).format(
                          'MMMM Do, YYYY [at] h:mm A',
                        )}
                      </time>
                    </dd>
                  </div>
                </dl>
              </div>
              <Menu
                as="div"
                className="absolute right-0 top-6 xl:relative xl:right-auto xl:top-auto xl:self-center"
              >
                <div>
                  <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-slate-500 hover:text-slate-600">
                    <span className="sr-only">Open options</span>
                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                  </Menu.Button>
                </div>
              </Menu>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
