import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { resources, site, ui } from '../data/content'
import ResourceForm from '../components/resource/ResourceForm'
import { ArrowLeft } from '../components/icons'
import Button from '../components/ui/Button'
import NotFound from './NotFound'

export default function ResourceFormPage({ mode }) {
  const { resource, id } = useParams()
  const config = resources[resource]

  useEffect(() => {
    if (config) document.title = `${mode === 'edit' ? ui.edit : ui.add} ${config.singular.toLowerCase()} | ${site.name}`
  }, [config, mode])

  if (!config) return <NotFound />
  // Workout logs have no update endpoint, so the edit route falls back to the detail screen.
  if (mode === 'edit' && config.canEdit === false) return <Navigate to={`/${resource}/${id}`} replace />

  return (
    <section className="page container page--narrow" aria-labelledby="page-title">
      <Button variant="ghost" size="sm" to={mode === 'edit' ? `/${resource}/${id}` : `/${resource}`}>
        <ArrowLeft width={16} height={16} /> {ui.back}
      </Button>
      <p className="label">{config.plural}</p>
      <h1 id="page-title" className="page__title">
        {mode === 'edit' ? ui.edit : ui.add} {config.singular.toLowerCase()}
      </h1>
      <ResourceForm key={`${resource}/${id ?? 'new'}`} name={resource} id={id} />
    </section>
  )
}
