import { cloneElement } from "react"

const containerStyle = {
  width: "100%",
  maxWidth: 1200,
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: 20,
  paddingRight: 20,
}

const Container = ({ children, style, comp: Comp = <div /> }) => {
  return cloneElement(Comp, {
    style: { ...containerStyle, ...style },
    children,
  })
}

export default Container
