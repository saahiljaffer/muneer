import { Menu } from '@headlessui/react'
import { CalendarIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

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

export default function Example({ events }) {
  return (
    <ol className="mt-4 divide-y divide-slate-200 text-sm leading-6 lg:col-span-7 xl:col-span-8">
      {events?.map((event) => (
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
  )
}
