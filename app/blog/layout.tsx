import {draftMode} from 'next/headers'
import {VisualEditing} from 'next-sanity/visual-editing'
import {DisableDraftMode} from '@/components/blog/DisableDraftMode'
import {SanityLive} from '@/sanity/lib/live'

export default async function BlogLayout({children}: {children: React.ReactNode}) {
  const {isEnabled} = await draftMode()

  return (
    <>
      {children}
      {isEnabled && (
        <>
          <SanityLive includeDrafts />
          <VisualEditing />
          <DisableDraftMode />
        </>
      )}
    </>
  )
}
