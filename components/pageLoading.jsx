import { Spin } from "antd"

const PageLoading = () => {
  return (
    <div className="PageLoading">
      <Spin />
      <style jsx>
        {`
          .PageLoading {
            position: fixed;
            left: 0;
            top: 0;
            bottom: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.3);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}
      </style>
    </div>
  )
}

export default PageLoading
