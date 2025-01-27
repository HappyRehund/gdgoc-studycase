import { Copyright } from 'lucide-react'
import React from 'react'

function Footer() {
  return (
    <div className="bg-foreground mt-20 md:block" >
      <div className="shadow-lg flex items-center justify-end h-24 py-2 px-6">
        <div className="flex px-4 gap-1 text-cardcolor dark:text-[#171717] font-semibold">
            <Copyright />
            Zazaza
        </div>
      </div>
    </div>
  )
}

export default Footer