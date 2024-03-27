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

const images = [
  'https://149805094.v2.pressablecdn.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-19-at-12.04.11.jpeg',
  'https://149805094.v2.pressablecdn.com/wp-content/uploads/2024/03/Memorial-Day-Instagram-Post-2.png',
  'https://149805094.v2.pressablecdn.com/wp-content/uploads/2024/03/1000438185.jpg',
  'https://149805094.v2.pressablecdn.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-22-at-15.19.01.jpeg',
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
    revalidate: 60,
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
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-16 space-y-8">
            <Calendar />
            <EventsList events={events} />
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <div className="flex">
                <h2 className="text-base font-semibold text-start leading-6 text-slate-900">
                  News
                </h2>
                <a
                  href="/news"
                  className="hover:underline ml-auto text-sm font-semibold text-blue-900 hover:text-blue-700"
                >
                  View all
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {announcements?.map((announcement, index) => (
                  <div
                    key={announcement._id}
                    className={`text-white rounded-lg bg-cover bg-center text-md flex w-full h-auto aspect-square bg-[url("https://149805094.v2.pressablecdn.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-19-at-12.04.11.jpeg")]`}
                  >
                    <div className="text-center rounded-lg text-white p-4 text-sm flex items-end justify-center w-full h-full aspect-square bg-gradient-to-t from-blue-900 to-transparent via-blue-700 via-35%">
                      <p>{announcement.title}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex">
                <h2 className="text-base font-semibold text-start leading-6 text-slate-900">
                  From our partners
                </h2>
                <a
                  href="/news"
                  className="hover:underline ml-auto text-sm font-semibold text-blue-900 hover:text-blue-700"
                >
                  View all
                </a>
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {announcements?.map((announcement, index) => (
                  <div
                    key={announcement._id}
                    className={`text-white rounded-lg bg-cover bg-center text-md flex w-full h-auto aspect-square bg-[url("https://149805094.v2.pressablecdn.com/wp-content/uploads/2024/03/WhatsApp-Image-2024-03-19-at-12.04.11.jpeg")]`}
                  >
                    <div className="text-center rounded-lg text-white p-4 text-sm flex items-end justify-center w-full h-full aspect-square bg-gradient-to-t from-blue-900 to-transparent via-blue-700 via-35%">
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
