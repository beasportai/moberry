import React from 'react'
import { StateContext } from './state-context'
import { Toaster } from 'react-hot-toast'
const ClientContextWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StateContext>
      <Toaster />
      <div className="flex flex-col max-w-[1440px] mx-auto">
        {children}
      </div>
    </StateContext>
  )
}

export default ClientContextWrapper
