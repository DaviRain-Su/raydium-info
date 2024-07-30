// src/options.tsx
import React, { useEffect, useState } from "react"

import "./style.css"

interface PoolInfo {
  id: string
  name: string
  token1Mint: string
  token2Mint: string
  lpMint: string
  official: boolean
  version: number
  status: string
  fee: number
  liquidity: number
  volume24h: number
  volume7d: number
  volume30d: number
  fee24h: number
  fee7d: number
  fee30d: number
  apr24h: number
  apr7d: number
  apr30d: number
}

interface ApiResponse {
  success: boolean
  data: {
    poolsInfo: PoolInfo[]
    sizeAll: number
  }
}

const poolTypes = [
  "all",
  "concentrated",
  "standard",
  "allFarm",
  "concentratedFarm",
  "standardFarm"
]
const poolSortFields = [
  "default",
  "liquidity",
  "volume24h",
  "fee24h",
  "apr24h",
  "volume7d",
  "fee7d",
  "apr7d",
  "volume30d",
  "fee30d",
  "apr30d"
]
const sortTypes = ["desc", "asc"]

const Options = () => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [poolType, setPoolType] = useState("all")
  const [poolSortField, setPoolSortField] = useState("volume24h")
  const [sortType, setSortType] = useState("desc")
  const [pageSize, setPageSize] = useState(100)
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchPoolInfo()
  }, [poolType, poolSortField, sortType, pageSize, page])

  const fetchPoolInfo = async () => {
    setLoading(true)
    setError(null)
    try {
      const url = `https://api-v3.raydium.io/pools/info/list?poolType=${poolType}&poolSortField=${poolSortField}&sortType=${sortType}&pageSize=${pageSize}&page=${page}`
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse = await response.json()
      if (data.success && data.data.poolsInfo) {
        setPoolInfo(data.data.poolsInfo)
      } else {
        throw new Error("Failed to fetch pool info")
      }
    } catch (error) {
      console.error("Error fetching Raydium pool info:", error)
      setError("Failed to fetch Raydium pool info. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Raydium Pool Information</h1>
      <div className="controls">
        <select value={poolType} onChange={(e) => setPoolType(e.target.value)}>
          {poolTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          value={poolSortField}
          onChange={(e) => setPoolSortField(e.target.value)}>
          {poolSortFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
        <select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          {sortTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          min="1"
          max="1000"
        />
        <input
          type="number"
          value={page}
          onChange={(e) => setPage(Number(e.target.value))}
          min="1"
        />
        <button onClick={fetchPoolInfo}>Fetch Pool Info</button>
      </div>
      {loading && <p>Loading pool info...</p>}
      {error && <p className="error">{error}</p>}
      {poolInfo && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Liquidity</th>
              <th>Volume 24h</th>
              <th>APR 24h</th>
            </tr>
          </thead>
          <tbody>
            {poolInfo.map((pool) => (
              <tr key={pool.id}>
                <td>{pool.name}</td>
                <td>${pool.liquidity.toLocaleString()}</td>
                <td>${pool.volume24h.toLocaleString()}</td>
                <td>{pool.apr24h.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Options
