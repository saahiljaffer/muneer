/* eslint-disable @next/next/no-img-element */
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'

import Calendar from '~/components/Calendar'
import Container from '~/components/Container'
import EventsList from '~/components/EventsList'
import PrayerTimes from '~/components/PrayerTimes'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import {
  type Announcement,
  announcementsQuery,
  type Event,
  eventsQuery,
  getAnnouncements,
  getEvents,
} from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'
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

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    events: Event[]
    announcements: Announcement[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const events = await getEvents(client)
  const announcements = await getAnnouncements(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      events,
      announcements,
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [events] = useLiveQuery<Event[]>(props.events, eventsQuery)
  const [announcements] = useLiveQuery<Announcement[]>(
    props.announcements,
    announcementsQuery,
  )
  return (
    <Container>
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-base font-semibold leading-6 text-slate-900">
            Upcoming Events
          </h2>
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-16">
            <Calendar />
            <EventsList events={events} />
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <div className="flex gap-8">
                {announcements?.map((announcement) => (
                  <div
                    key={announcement._id}
                    className='text-white text-md flex w-36 h-fit bg-[url("https://picsum.photos/200")]'
                  >
                    <div className="text-white p-4 text-sm flex items-center justify-center w-full h-full aspect-square backdrop-brightness-50 backdrop-blur-sm">
                      <p>{announcement.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-8">
                {announcements?.map((announcement) => (
                  <div
                    key={announcement._id}
                    className='text-white text-md flex w-36 h-fit bg-[url("https://picsum.photos/200")]'
                  >
                    <div className="text-white p-4 text-sm flex items-center justify-center w-full h-full aspect-square backdrop-brightness-50 backdrop-blur-sm">
                      <p>{announcement.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <PrayerTimes />
          </div>
        </div>
      </section>
    </Container>
  )
}
