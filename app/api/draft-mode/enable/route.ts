import {defineEnableDraftMode} from 'next-sanity/draft-mode'
import {client} from '@/sanity/lib/client'

const token = process.env.SANITY_API_READ_TOKEN

const handler = token
  ? defineEnableDraftMode({client: client.withConfig({token})}).GET
  : null

export async function GET(request: Request) {
  if (!handler) {
    return new Response('Draft preview requires SANITY_API_READ_TOKEN.', {status: 503})
  }
  return handler(request)
}
