import { useEffect } from 'react'
import { site } from '../data/content'
import CtaBand from '../components/home/CtaBand'
import FeatureStrip from '../components/home/FeatureStrip'
import Hero from '../components/home/Hero'
import LivePreview from '../components/home/LivePreview'

export default function HomePage() {
  useEffect(() => {
    document.title = `${site.name} | Gym Management`
  }, [])
  return (
    <>
      <Hero />
      <FeatureStrip />
      <LivePreview />
      <CtaBand />
    </>
  )
}
