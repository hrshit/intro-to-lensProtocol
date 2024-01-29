// app/page.tsx
'use client'
import {
  useExploreProfiles,
  ExploreProfilesOrderByType,
  LimitType
} from '@lens-protocol/react-web'
import Link from 'next/link'

export default function Home() {
  const { data } = useExploreProfiles({
    orderBy: ExploreProfilesOrderByType.MostFollowers,
    limit: LimitType.TwentyFive
  })
  console.log('data: ', data)

  return (
    <div className='p-20'>
      <h1 className='text-5xl'>My Lens App</h1>
      {
        data?.map((profile, index) => (
          <Link
            href={`/profile/${profile.handle?.localName}.${profile.handle?.namespace}`}
            key={index}
          >
            <div className='my-14'>
              {
                profile.metadata?.picture?.__typename === 'ImageSet' ? (
                  <img
                    src={profile.metadata?.picture?.optimized?.uri || ''}
                    width="120"
                    height="120"
                    alt={profile.handle?.fullHandle || ''}
                  />
                ) : <div className="w-28 h-28 bg-slate-500" />
              }
              <h3 className="text-3xl my-4">{profile.handle?.localName}.{profile.handle?.namespace}</h3>
              <p className="text-xl">{profile.metadata?.bio}</p>
            </div>
          </Link>
        ))
      }
    </div>
  )
}