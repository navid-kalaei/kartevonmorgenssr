import Registration from './Registration'
import Tag from './Tag'
import Category from './Categories'


export type EventID = string

interface Event {
  id: EventID
  title: string
  description: string
  start: number
  end: number
  created_at: number
  created_by: string
  lat: number
  lng: number
  street: string
  zip: string
  city: string
  country: string
  state: string
  email: string
  telephone: string
  tags: Tag[]
  homepage: string
  registration: Registration
  organizer: string
  image_url: string
  image_link_url: string
}

export interface CompactEvent {
  id: EventID
  title: string
  description: string
  lat: number
  lng: number
  categories: [Category.EVENT]
  tags: Tag[]
}

export type CompactEvents = CompactEvent[]

export interface EventsCollection {
  [index: string]: Event
}

export type Events = Event[]


export default Event