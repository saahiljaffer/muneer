import { Menu, Transition } from '@headlessui/react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/20/solid'
import clsx from 'clsx'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { Fragment } from 'react'
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

const generateCalendarArray = (year: number, month: number) => {
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
      events: [],
    })
  }

  return days
}

export default function Calendar() {
  // @ts-ignore
  const [year, setYear] = useState(dayjs().iYear())
  // @ts-ignore
  const [month, setMonth] = useState(dayjs().iMonth() + 1)

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
    <div className="lg:flex lg:min-h-screen lg:h-full lg:flex-col col-span-3">
      <header className="flex items-center justify-between border-b border-gray-200 px-6 py-4 lg:flex-none">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          <p>{header}</p>
          <p>{englishHeader}</p>
        </h1>
        <div className="flex items-center">
          <div className="relative flex items-center rounded-md bg-white shadow-sm md:items-stretch">
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
              disabled={year === 1440 && month === 1}
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
              type="button"
              className="hidden border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
              onClick={() => {
                // @ts-ignore
                setYear(dayjs().iYear())
                // @ts-ignore
                setMonth(dayjs().iMonth() + 1)
              }}
            >
              Today
            </button>
            <span className="relative -mx-px h-5 w-px bg-gray-300 md:hidden" />
            <button
              type="button"
              className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
              disabled={year === 1446 && month === 12}
              onClick={() => {
                if (month === 12) {
                  setYear(year + 1)
                  setMonth(1)
                } else {
                  setMonth(month + 1)
                }
              }}
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <Menu as="div" className="relative ml-6 md:hidden">
            <Menu.Button className="-mx-2 flex items-center rounded-full border border-transparent p-2 text-gray-400 hover:text-gray-500">
              <span className="sr-only">Open menu</span>
              <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
            </Menu.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 z-10 mt-3 w-36 origin-top-right divide-y divide-gray-100 overflow-hidden rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={clsx(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Create event
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={clsx(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Go to today
                      </a>
                    )}
                  </Menu.Item>
                </div>
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={clsx(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Day view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={clsx(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Week view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={clsx(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Month view
                      </a>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="#"
                        className={clsx(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm',
                        )}
                      >
                        Year view
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
      <div className="shadow ring-1 ring-black ring-opacity-5 lg:flex lg:flex-auto lg:flex-col">
        <div className="grid grid-cols-7 gap-px border-b border-gray-300 bg-gray-200 text-center text-xs font-semibold leading-6 text-gray-700 lg:flex-none">
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">un</span>
          </div>
          <div className="bg-white py-2">
            M<span className="sr-only sm:not-sr-only">on</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">ue</span>
          </div>
          <div className="bg-white py-2">
            W<span className="sr-only sm:not-sr-only">ed</span>
          </div>
          <div className="bg-white py-2">
            T<span className="sr-only sm:not-sr-only">hu</span>
          </div>
          <div className="bg-white py-2">
            F<span className="sr-only sm:not-sr-only">ri</span>
          </div>
          <div className="bg-white py-2">
            S<span className="sr-only sm:not-sr-only">at</span>
          </div>
        </div>
        <div className="flex bg-gray-200 text-xs leading-6 text-gray-700 lg:flex-auto">
          <div className="hidden w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
            {days.map((day) => (
              <div
                key={day.date}
                className={clsx(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50 text-gray-500',
                  'relative px-3 py-2',
                )}
              >
                <time
                  dateTime={day.date}
                  className={
                    day.isToday ? ' text-indigo-600 font-semibold' : undefined
                  }
                >
                  <p>{day.date.split('-').pop().replace(/^0/, '')}</p>
                  <p>{day.englishDate.split('-').pop().replace(/^0/, '')}</p>
                </time>
                {day.events.length > 0 && (
                  <ol className="mt-2">
                    {day.events.slice(0, 2).map((event) => (
                      <li key={event.id}>
                        <a href={event.href} className="group flex">
                          <p className="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600">
                            {event.name}
                          </p>
                          <time
                            dateTime={event.datetime}
                            className="ml-3 hidden flex-none text-gray-500 group-hover:text-indigo-600 xl:block"
                          >
                            {event.time}
                          </time>
                        </a>
                      </li>
                    ))}
                    {day.events.length > 2 && (
                      <li className="text-gray-500">
                        + {day.events.length - 2} more
                      </li>
                    )}
                  </ol>
                )}
              </div>
            ))}
          </div>
          <div className="isolate grid w-full grid-cols-7 grid-rows-6 gap-px lg:hidden">
            {days.map((day) => (
              <button
                key={day.date}
                type="button"
                className={clsx(
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected && day.isToday && 'text-indigo-600',
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-900',
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-500',
                  'flex h-14 flex-col px-3 py-2 hover:bg-gray-100 focus:z-10',
                )}
              >
                <time
                  dateTime={day.date}
                  className={clsx(
                    day.isSelected &&
                      'flex h-6 w-6 items-center justify-center rounded-full',
                    day.isSelected && day.isToday && 'bg-indigo-600',
                    day.isSelected && !day.isToday && 'bg-gray-900',
                    'ml-auto',
                  )}
                >
                  <p>{day.date.split('-').pop().replace(/^0/, '')}</p>
                  <p>{day.englishDate.split('-').pop().replace(/^0/, '')}</p>
                </time>
                <span className="sr-only">{day.events.length} events</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
