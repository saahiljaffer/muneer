import { CalendarIcon } from '@heroicons/react/20/solid'
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
    <div className="lg:col-span-7 xl:col-span-8">
      <div className="flex items-center">
        <h2 className="text-base font-semibold leading-6 text-slate-900">
          Upcoming Events
        </h2>
        <a
          href="/events"
          className="cursor-pointer hover:underline ml-auto text-sm font-semibold text-blue-900 hover:text-blue-700"
        >
          View all
        </a>
      </div>

      <ol className="mt-4 divide-y divide-slate-200 text-sm leading-6 ">
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
          </li>
        ))}
      </ol>
    </div>
  )
}
