'use client'
import { LensConfig, production, development } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { LensProvider as Provider } from '@lens-protocol/react-web'

const lensConfig: LensConfig = {
    bindings: wagmiBindings(),
    environment: development,
}

export function LensProvider({ children }) {
    return (
        <Provider config={lensConfig}>
            {children}
        </Provider>
    )
}