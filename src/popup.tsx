import React, { useState } from "react"

import { Storage } from "@plasmohq/storage"

import IndexPopup from "./components/IndexPopup"
import PoolInfoPage from "./components/PoolInfo"

const storage = new Storage()

const Popup = () => {
  const [currentPage, setCurrentPage] = useState("tokens")

  const openOptionsPage = () => {
    chrome.runtime.openOptionsPage()
  }

  return (
    <div style={{ width: 400, padding: 16 }}>
      <nav style={{ marginBottom: 16 }}>
        <button onClick={() => setCurrentPage("tokens")}>Tokens</button>
        <button onClick={() => setCurrentPage("pools")}>Pools</button>
        <button onClick={openOptionsPage}>Open Full Page</button>
      </nav>
      {currentPage === "tokens" ? <IndexPopup /> : <PoolInfoPage />}
    </div>
  )
}

export default Popup
