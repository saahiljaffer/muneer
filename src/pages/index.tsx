import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { useLiveQuery } from 'next-sanity/preview'

import Container from '~/components/Container'
import EventsList from '~/components/EventsList'
import { readToken } from '~/lib/sanity.api'
import { getClient } from '~/lib/sanity.client'
import { type Event, eventsQuery, getEvents } from '~/lib/sanity.queries'
import type { SharedPageProps } from '~/pages/_app'

export const getStaticProps: GetStaticProps<
  SharedPageProps & {
    events: Event[]
  }
> = async ({ draftMode = false }) => {
  const client = getClient(draftMode ? { token: readToken } : undefined)
  const events = await getEvents(client)

  return {
    props: {
      draftMode,
      token: draftMode ? readToken : '',
      events,
    },
  }
}

export default function IndexPage(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  const [events] = useLiveQuery<Event[]>(props.events, eventsQuery)
  return (
    <Container>
      <section>
        <EventsList events={events} />
      </section>
    </Container>
  )
}
