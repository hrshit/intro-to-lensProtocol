// app/profile/[handle]/page.tsx
'use client'
import {
    useProfile,
    usePublications,
    Profile,
    LimitType,
    PublicationType,
    useLogin,
    useProfiles,
    useFollow
} from '@lens-protocol/react-web'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useAccount } from 'wagmi'

export default function Profile({ params: { handle } }) {
    const namespace = handle.split('.')[1]
    handle = handle.split('.')[0]
    let { data: profile, loading } = useProfile({
        forHandle: `${namespace}/${handle}`
    })
    const { open } = useWeb3Modal()
    const { address, isConnected } = useAccount()
    const { execute: login, data } = useLogin()
    const { execute: follow } = useFollow();
    const { data: ownedProfiles } = useProfiles({
        where: {
            ownedBy: [address || ''],
        },
    })

    if (!profile) return null

    if (loading) return <p className="p-14">Loading ...</p>
    return (
        <div>
            <div className="p-14">
                {
                    profile?.metadata?.picture?.__typename === 'ImageSet' && (
                        <img
                            width="200"
                            height="200"
                            alt={profile.handle?.fullHandle}
                            className='rounded-xl'
                            src={profile.metadata.picture.optimized?.uri}
                        />
                    )
                }
                {
                    !isConnected && (
                        <button
                            className='border border-zinc-600 rounded px-4 py-2 mt-4 mb-6'
                            onClick={() => open()}>
                            Connect Wallet
                        </button>
                    )
                }
                {
                    !data && ownedProfiles?.length && isConnected && (
                        <button
                            className='border border-zinc-600 rounded px-4 py-2 mt-4 mb-6'
                            onClick={() => login({
                                address: address || '',
                                profileId: ownedProfiles[ownedProfiles.length - 1].id
                            })}>
                            Login with Lens
                        </button>
                    )
                }
                {
                    data && profile.operations.canFollow !== 'NO' && (
                        <button
                            className='border border-zinc-600 rounded px-4 py-2 mt-4 mb-6'
                            onClick={() => profile ? follow({ profile: profile }) : null}>
                            Follow
                        </button>
                    )
                }
                <h1 className="text-3xl my-3">{profile?.handle?.localName}.{profile?.handle?.namespace}</h1>
                <h3 className="text-xl mb-4">{profile?.metadata?.bio}</h3>
                {profile && <Publications profile={profile} />}
            </div>
        </div>
    )
}

function Publications({
    profile
}: {
    profile: Profile
}) {
    let { data: publications } = usePublications({
        where: {
            publicationTypes: [PublicationType.Post],
            from: [profile.id],
        },
        limit: LimitType.TwentyFive
    })

    return (
        <>
            {
                publications?.map((pub: any, index: number) => (
                    <div key={index} className="py-4 bg-zinc-900 rounded mb-3 px-4">
                        <p>{pub.metadata.content}</p>
                        {
                            pub.metadata?.asset?.image?.optimized?.uri && (
                                <img
                                    width="400"
                                    height="400"
                                    alt={profile.handle?.fullHandle}
                                    className='rounded-xl mt-6 mb-2'
                                    src={pub.metadata?.asset?.image?.optimized?.uri}
                                />
                            )
                        }
                    </div>
                ))
            }
        </>
    )
}