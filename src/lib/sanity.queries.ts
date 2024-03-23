import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

export const eventsQuery = groq`*[_type == "event" && defined(slug.current)] | order(_createdAt desc)`

export async function getEvents(client: SanityClient): Promise<Event[]> {
  return await client.fetch(eventsQuery)
}

export const eventBySlugQuery = groq`*[_type == "event" && slug.current == $slug][0]`

export async function getEvent(
  client: SanityClient,
  slug: string,
): Promise<Event> {
  return await client.fetch(eventBySlugQuery, {
    slug,
  })
}

export const postSlugsQuery = groq`
*[_type == "event" && defined(slug.current)][].slug.current
`

export interface Event {
  _type: 'event'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  startDate: string
  endDate: string
  body: PortableTextBlock[]
}
