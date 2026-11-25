import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { resources, site, ui } from '../data/content'
import ResourceDetail from '../components/resource/ResourceDetail'
import { ArrowLeft } from '../components/icons'
import Button from '../components/ui/Button'
import NotFound from './NotFound'

export default function ResourceDetailPage() {
  const { resource, id } = useParams()
  const config = resources[resource]

  useEffect(() => {
    if (config) document.title = `${config.singular} | ${site.name}`
  }, [config])

  if (!config) return <NotFound />
  return (
    <section className="page container page--narrow" aria-labelledby="page-title">
      <Button variant="ghost" size="sm" to={`/${resource}`}>
        <ArrowLeft width={16} height={16} /> {ui.back}
      </Button>
      <p className="label">{config.plural}</p>
      <h1 id="page-title" className="page__title">
        {config.singular}
      </h1>
      <ResourceDetail key={`${resource}/${id}`} name={resource} id={id} />
    </section>
  )
}
