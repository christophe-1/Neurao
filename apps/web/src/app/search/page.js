import SearchResults from '@/components/SearchResults'

/** Search page: reads the text typed in the header from the address (/search?query=omega). */
export default async function SearchPage({ searchParams }) {
  const { query } = await searchParams

  return <SearchResults search={query || ''} />
}
