import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { request } from 'graphql-request'
import { getAccessToken } from '../auth'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

export const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
})
const JOB_DETAIL_FRAGMENT = gql`
  fragment JobDetail on Job {
    id
    title
    company {
      id
      name
    }
    description
  }
`

export const JOB_QUERY = gql`
  query JobQuery($id: ID!) {
    job(id: $id) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`

export const JOBS_QUERY = gql`
  query JobsQuery {
    jobs {
      id
      title
      company {
        id
        name
      }
    }
  }
`

export const COMPANY_QUERY = gql`
  query CompanyQuery($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
      }
    }
  }
`

// updateJob
export async function updateJob(input) {
  const query = gql`
    mutation UpdateJobMutation($input: UpdateJobInput!) {
      job: updateJob(input: $input) {
        id
        title
        description
      }
    }
  `

  const variables = { input }
  const headers = { Authorization: 'Bearer ' + getAccessToken() }
  const { job } = await request(GRAPHQL_URL, query, variables, headers)
  return job
}

export async function deleteJob(id) {
  const query = gql`
    mutation DeleteJobMutation($id: ID!) {
      deleteJob(id: $id)
    }
  `

  const variables = { id }
  const headers = { Authorization: 'Bearer ' + getAccessToken() }
  await request(GRAPHQL_URL, query, variables, headers)
}

export const CREATE_JOB_MUTATION = gql`
  mutation CreateJobMutation($input: CreateJobInput!) {
    job: createJob(input: $input) {
      ...JobDetail
    }
  }
  ${JOB_DETAIL_FRAGMENT}
`

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        ...JobDetail
      }
    }
    ${JOB_DETAIL_FRAGMENT}
  `

  const variables = { input }
  const context = { headers: { Authorization: 'Bearer ' + getAccessToken() } }
  const {
    data: { job },
  } = await client.mutate({
    mutation,
    variables,
    context,
    update: (cache, { data: { job } }) => {
      cache.writeQuery({
        query: JOB_QUERY,
        variables: { id: job.id },
        data: { job },
      })
    },
  })
  return job
}
