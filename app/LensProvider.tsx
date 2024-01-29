'use client'
import { LensConfig, production } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { LensProvider as Provider } from '@lens-protocol/react-web'

const lensConfig: LensConfig = {
    bindings: wagmiBindings(),
    environment: production,
}

export function LensProvider({ children }) {
    return (
        <Provider config={lensConfig}>
            {children}
        </Provider>
    )
}