import { Menu, Transition } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import { Fragment, useEffect } from 'react'

dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

function generateCalendarArray(year, month) {
  const startDate = dayjs(new Date(year, month, 1))
    .locale('en-ca')
    .startOf('week')
  const endDate = dayjs(new Date(year, month + 1, 0)).endOf('week')
  const today = dayjs()
  const selectedDate = dayjs('2024-03-25') // Example selected date
  let days = []

  for (
    let date = startDate;
    date.isSameOrBefore(endDate);
    date = date.add(1, 'day')
  ) {
    let dateObject = date.format('YYYY-MM-DD')
    let isCurrentMonth = false,
      isToday = false,
      isSelected = false

    if (date.month() === month) {
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
const days = generateCalendarArray(2024, 2) // Month is 0-indexed (0 for January)

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
dayjs.extend(advancedFormat)

export default function Events({ events }) {
  return (
    <div className="md:grid md:grid-cols-2 md:divide-x md:divide-blue-grey-200 max-w-screen-xl mx-auto p-4 sm:p-12 rounded-lg">
      <div className="md:pr-14">
        <div className="flex items-center">
          <h2 className="flex-auto text-sm font-semibold text-blue-grey-900">
            March 2024
          </h2>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-blue-grey-500">
          <div>S</div>
          <div>M</div>
          <div>T</div>
          <div>W</div>
          <div>T</div>
          <div>F</div>
          <div>S</div>
        </div>
        <div className="mt-2 grid grid-cols-7 text-sm">
          {days.map((day, dayIdx) => (
            <div
              key={day.date}
              className={classNames(
                dayIdx > 6 && 'border-t border-blue-grey-200',
                'py-2',
              )}
            >
              <button
                type="button"
                className={classNames(
                  day.isSelected && 'text-white',
                  !day.isSelected && day.isToday && 'text-indigo-600',
                  !day.isSelected &&
                    !day.isToday &&
                    day.isCurrentMonth &&
                    'text-blue-grey-900',
                  !day.isSelected &&
                    !day.isToday &&
                    !day.isCurrentMonth &&
                    'text-blue-grey-400',
                  day.isSelected && day.isToday && 'bg-blue-600',
                  day.isSelected && !day.isToday && 'bg-blue-grey-900',
                  !day.isSelected && 'hover:bg-blue-grey-200',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-full',
                )}
              >
                <time dateTime={day.date}>
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
              </button>
            </div>
          ))}
        </div>
      </div>
      <section className="mt-12 md:mt-0 md:pl-14">
        <h2 className="text-base font-semibold leading-6 text-blue-grey-900">
          Upcoming Events
        </h2>
        <ol className="mt-4 space-y-1 text-sm leading-6 text-blue-grey-500 divide-y divide-blue-grey-100">
          {events.map((event) => (
            <li
              key={event.title}
              className="group flex items-center space-x-4 py-2"
            >
              <div className="flex-auto">
                <p className="text-blue-grey-900">{event.title}</p>
                <p className="mt-0.5">
                  <time dateTime={event.startDatetime}>
                    {dayjs(event.startDatetime).format(
                      'MMMM Do, YYYY [at] h:mm A',
                    )}
                  </time>{' '}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}
