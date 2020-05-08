import { useRouter } from "next/router"

const Search = () => {
  const router = useRouter()
  return <div className="Search">Search {router.query.query}</div>
}

export default Search
