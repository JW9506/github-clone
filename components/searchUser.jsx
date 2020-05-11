import { Select, Spin } from "antd"
import { useState, useCallback, useRef } from "react"
import debounce from "lodash/debounce"
import api from "lib/universalApi"

const Option = Select.Option

function SearchUser({ onChange, value }) {
  const lastFetchIdRef = useRef(0)
  const [fetching, setFetching] = useState(false)
  /*
  type Option = {
    value: number,
    text: string,
  }
  */
  const [options, setOptions] = useState([])

  const fetchUser = useCallback(
    debounce(async (value) => {
      lastFetchIdRef.current += 1
      const fetchId = lastFetchIdRef.current

      setFetching(true)
      setOptions([])
      let data
      if (value) {
        if (fetchId !== lastFetchIdRef.current) {
          return
        }
        const result = await api.request({ url: `/search/users?q=${value}` })
        data = result.data
      }
      if (data) {
        const fetchedOptions = data.items.map((user) => ({
          text: user.login,
          value: user.login,
        }))
        setFetching(false)
        setOptions(fetchedOptions)
      }
    }, 1000),
    []
  )

  const handleChange = (value) => {
    setOptions([])
    setFetching(false)
    onChange(value)
  }

  return (
    <Select
      style={{ width: "20rem" }}
      className="SearchUser"
      showSearch
      notFoundContent={
        fetching ? <Spin size="small" /> : <span>Nothing here</span>
      }
      value={value}
      filterOption={false}
      placeholder="Creator"
      onChange={handleChange}
      onSearch={fetchUser}
      allowClear
    >
      {options.map((op) => (
        <Option value={op.value} key={op.value}>
          {op.text}
        </Option>
      ))}
    </Select>
  )
}

export default SearchUser
