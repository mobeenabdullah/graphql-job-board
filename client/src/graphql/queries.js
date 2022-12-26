import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { request } from 'graphql-request'
import { getAccessToken } from '../auth'

const GRAPHQL_URL = 'http://localhost:9000/graphql'

const client = new ApolloClient({
  uri: GRAPHQL_URL,
  cache: new InMemoryCache(),
})

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

export async function createJob(input) {
  const query = gql`
    mutation CreateJobMutation($input: CreateJobInput!) {
      job: createJob(input: $input) {
        id
      }
    }
  `

  const variables = { input }
  const headers = { Authorization: 'Bearer ' + getAccessToken() }
  const { job } = await request(GRAPHQL_URL, query, variables, headers)
  return job
}

export async function getCompany(id) {
  const query = gql`
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

  const variables = { id }
  const { company } = await request(GRAPHQL_URL, query, variables)
  return company
}

export async function getJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        company {
          id
          name
        }
        description
      }
    }
  `

  const variables = { id }

  const { job } = await request(GRAPHQL_URL, query, variables)
  return job
}

export async function getJobs() {
  const query = gql`
    query JobsQuery {
      jobs {
        id
        title
        company {
          name
        }
      }
    }
  `
  const {
    data: { jobs },
  } = await client.query({ query })
  return jobs
}
