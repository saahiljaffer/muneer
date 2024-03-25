import { Menu, Transition } from '@headlessui/react'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

import customParseFormat from '~/utils/customParseFormat'
import customprops from '~/utils/customProps'
import hijri from '~/utils/hijri'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
dayjs.extend(advancedFormat)
dayjs.extend(hijri)
dayjs.extend(customParseFormat)
dayjs.extend(customprops)

function generateCalendarArray(year, month) {
  console.log(dayjs('09-01-1445', 'iMM-iDD-iYYYY'))
  console.log(dayjs('10-01-1445', 'iMM-iDD-iYYYY'))

  const startDate = dayjs('08-01-1445', 'iMM-iDD-iYYYY').startOf('week')
  const endDate = dayjs('09-01-1445', 'iMM-iDD-iYYYY').endOf('week')
  const today = dayjs()
  const selectedDate = dayjs('2024-03-25') // Example selected date
  let days = []

  for (
    let date = startDate;
    date.isSameOrBefore(endDate);
    date = date.add(1, 'day')
  ) {
    let dateObject = date.format('iYYYY-iMM-iDD')
    let isCurrentMonth = false,
      isToday = false,
      isSelected = false

    // @ts-ignore
    if (date.iMonth() === 8) {
      isCurrentMonth = true
    }

    // Check if the date is today
    if (date.isSame(today, 'day')) {
      isToday = true
    }

    // Check if the date is the selected date
    if (date.isSame(selectedDate, 'day')) {
      isSelected = true
    }

    days.push({
      date: dateObject,
      isCurrentMonth,
      isToday,
      isSelected,
    })
  }

  return days
}

// Example usage for January 2022
const days = generateCalendarArray(2024, 2)
console.log(days)

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Example({ events }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-base font-semibold leading-6 text-gray-900">
        Upcoming events
      </h2>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
        <div className="mt-10 text-center lg:col-start-8 lg:col-end-13 lg:row-start-1 lg:mt-9 xl:col-start-9">
          <div className="flex items-center text-gray-900">
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Previous month</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <div className="flex-auto text-sm font-semibold">Ramadhan</div>
            <button
              type="button"
              className="-m-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Next month</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 grid grid-cols-7 text-xs leading-6 text-gray-500">
            <div>S</div>
            <div>M</div>
            <div>T</div>
            <div>W</div>
            <div>T</div>
            <div>F</div>
            <div>S</div>
          </div>
          <div className="isolate mt-2 grid grid-cols-7 gap-px rounded-lg bg-gray-200 text-sm shadow ring-1 ring-gray-200">
            {days.map((day, dayIdx) => (
              <button
                key={day.date}
                type="button"
                className={classNames(
                  'py-1.5 hover:bg-gray-100 focus:z-10',
                  day.isCurrentMonth ? 'bg-white' : 'bg-gray-50',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  day.isSelected && 'text-white',
                  !day.isSelected &&
                    day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-900',
                  !day.isSelected &&
                    !day.isCurrentMonth &&
                    !day.isToday &&
                    'text-gray-400',
                  day.isToday && !day.isSelected && 'text-blue-600',
                  dayIdx === 0 && 'rounded-tl-lg',
                  dayIdx === 6 && 'rounded-tr-lg',
                  dayIdx === days.length - 7 && 'rounded-bl-lg',
                  dayIdx === days.length - 1 && 'rounded-br-lg',
                )}
              >
                <time
                  dateTime={day.date}
                  className={classNames(
                    'mx-auto flex h-7 w-7 items-center justify-center rounded-full',
                    day.isSelected && day.isToday && 'bg-blue-600',
                    day.isSelected && !day.isToday && 'bg-gray-900',
                  )}
                >
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
              </button>
            ))}
          </div>
        </div>
        <ol className="mt-4 divide-y divide-gray-100 text-sm leading-6 lg:col-span-7 xl:col-span-8">
          {events.map((event) => (
            <li
              key={event.title}
              className="relative flex space-x-6 py-6 xl:static"
            >
              <div className="flex-auto">
                <h3 className="pr-10 font-semibold text-gray-900 xl:pr-0">
                  {event.title}
                </h3>
                <dl className="mt-2 flex flex-col text-gray-500 xl:flex-row">
                  <div className="flex items-start space-x-3">
                    <dt className="mt-0.5">
                      <span className="sr-only">Date</span>
                      <CalendarIcon
                        className="h-5 w-5 text-gray-400"
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
                  <Menu.Button className="-m-2 flex items-center rounded-full p-2 text-gray-500 hover:text-gray-600">
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