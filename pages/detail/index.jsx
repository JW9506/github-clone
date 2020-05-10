import withRepoBasic from "components/withRepoBasic"

Detail.getInitialProps = async () => {
  return {}
}
function Detail() {
  return <span>Detail </span>
}

export default withRepoBasic(Detail, "index")
