import { JOBS_QUERY } from '../graphql/queries'
import { useQuery } from '@apollo/client'

export function useJobs() {
  const { data, loading, error } = useQuery(JOBS_QUERY, {
    fetchPolicy: 'network-only',
  })

  return {
    jobs: data?.jobs,
    loading,
    error: Boolean(error),
  }
}
