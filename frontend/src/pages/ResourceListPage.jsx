import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { resources, site } from '../data/content'
import ResourceList from '../components/resource/ResourceList'
import NotFound from './NotFound'

export default function ResourceListPage() {
  const { resource } = useParams()
  const config = resources[resource]

  useEffect(() => {
    if (config) document.title = `${config.plural} | ${site.name}`
  }, [config])

  if (!config) return <NotFound />
  return (
    <section className="page container" aria-labelledby="page-title">
      <p className="label">{config.eyebrow}</p>
      <h1 id="page-title" className="page__title">
        {config.plural}
      </h1>
      <p className="page__intro">{config.intro}</p>
      <ResourceList key={resource} name={resource} />
    </section>
  )
}
