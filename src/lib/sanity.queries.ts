import type { PortableTextBlock } from '@portabletext/types'
import type { ImageAsset, Slug } from '@sanity/types'
import groq from 'groq'
import { type SanityClient } from 'next-sanity'

export const eventsQuery = groq`*[_type == "event" && defined(slug.current)] | order(startDatetime asc) [0...3]`
export const announcementsQuery = groq`*[_type == "announcement" && defined(slug.current)]`

export async function getEvents(client: SanityClient): Promise<Event[]> {
  return await client.fetch(eventsQuery)
}

export async function getAnnouncements(
  client: SanityClient,
): Promise<Announcement[]> {
  return await client.fetch(announcementsQuery)
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

export const eventSlugsQuery = groq`
*[_type == "event" && defined(slug.current)][].slug.current
`

export interface Event {
  _type: 'event'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  startDatetime: string
  endDatetime: string
}

export interface Announcement {
  _type: 'announcement'
  _id: string
  _createdAt: string
  title?: string
  slug: Slug
  image: any
}
