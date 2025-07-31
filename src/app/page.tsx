import { Hero } from '@/components/sections/Hero'
import { BeyondVisions } from '@/components/sections/BeyondVisions'
import { FeaturedWork } from '@/components/sections/FeaturedWork'
import { About } from '@/components/sections/About'
import { Contact } from '@/components/sections/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <BeyondVisions />
      <FeaturedWork />
      <About />
      <Contact />
    </>
  )
}
