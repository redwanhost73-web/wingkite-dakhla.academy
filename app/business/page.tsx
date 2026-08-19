'use client'

import { useEffect, useState } from 'react'
import { fetchMyProfile } from '@/lib/auth/session'
import type { Profile } from '@/lib/auth/roles'

export default function BusinessHomePage() {
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    fetchMyProfile().then(setProfile)
  }, [])

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="font-heading text-3xl font-bold">
          {profile?.company_name || 'Business dashboard'}
        </h1>
        <p className="mt-2 text-sm text-[#3D4F6F]">
          Partner tools for hotels, agencies, and local businesses working with Wing Kite Dakhla Academy.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[20px] border border-[#072A5A]/8 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A8AA3]">Status</p>
          <p className="mt-2 font-heading text-xl font-bold">Active partner</p>
        </div>
        <div className="rounded-[20px] border border-[#072A5A]/8 bg-white p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[#7A8AA3]">Next</p>
          <p className="mt-2 text-sm text-[#3D4F6F]">
            Leads, referral codes, and partner offers will land here.
          </p>
        </div>
      </div>
    </div>
  )
}
