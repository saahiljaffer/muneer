import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
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

function generateCalendarArray(year: number, month: number) {
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
      event: date.day() === 4 || date.day() === 5,
    })
  }

  return days
}

export default function Calendar() {
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
    <div className="text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 xl:col-start-9 self-center">
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
          className="cursor-pointer flex-auto text-sm font-semibold group"
          onClick={() => {
            // @ts-ignore
            setYear(dayjs().iYear())
            // @ts-ignore
            setMonth(dayjs().iMonth() + 1)
          }}
        >
          <p className="text-sm font-semibold leading-6 text-slate-900 group-hover:underline group-hover:text-slate-800">
            {header}
          </p>
          <p className="cursor-pointer hover:underline text-[13px] font-semibold text-slate-500 group-hover:underline group-hover:text-slate-600">
            {englishHeader}
          </p>
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
              day.isCurrentMonth && !day.isToday && !day.color && 'bg-white',
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
              day.isCurrentMonth && day.color === 'green' && 'bg-cyan-600',
              day.isCurrentMonth && day.color === 'black' && 'bg-slate-900',
              dayIdx === days.length - 7 && 'rounded-bl-lg',
              dayIdx === days.length - 1 && 'rounded-br-lg',
            )}
          >
            <time
              dateTime={day.date}
              className="w-full flex flex-col h-8 px-2 items-end justify-center rounded-full"
            >
              <p>{day.date.split('-').pop().replace(/^0/, '')}</p>
              <p
                className={clsx(
                  'text-xs',
                  // regular text color for current month
                  !day.color &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-slate-600',
                  // text color for holidays
                  (day.color || day.isToday) &&
                    day.isCurrentMonth &&
                    'text-slate-100',
                  // text color for previous or next month
                  !day.isCurrentMonth && !day.isToday && 'text-slate-400',
                )}
              >
                {day.englishDate.split('-').pop().replace(/^0/, '')}
              </p>
              {day.isCurrentMonth && day.event && (
                <span
                  className={clsx(
                    'self-start h-1 w-1 rounded-full',
                    !day.color && 'bg-blue-600',
                    // text color for holidays
                    day.color && 'bg-blue-100',
                  )}
                >
                  &nbsp;
                </span>
              )}
            </time>
          </div>
        ))}
      </div>
    </div>
  )
}
