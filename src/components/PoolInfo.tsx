// src/options.tsx
import React, { useEffect, useState } from "react"

import "./style.css"

interface Mint {
  address: string
  symbol: string
  name: string
  decimals: number
}

interface PoolInfo {
  type: string
  id: string
  mintA: Mint
  mintB: Mint
  price: number
  tvl: number
  day: {
    volume: number
    apr: number
  }
  week: {
    volume: number
    apr: number
  }
  month: {
    volume: number
    apr: number
  }
}

interface ApiResponse {
  success: boolean
  data: {
    count: number
    data: PoolInfo[]
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

const PoolInfoPage = () => {
  const [poolInfo, setPoolInfo] = useState<PoolInfo[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [poolType, setPoolType] = useState("all")
  const [poolSortField, setPoolSortField] = useState("volume24h")
  const [sortType, setSortType] = useState("desc")
  const [pageSize, setPageSize] = useState(100)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const controller = new AbortController()
    fetchPoolInfo(controller.signal)
    return () => controller.abort()
  }, [poolType, poolSortField, sortType, pageSize, page])

  const fetchPoolInfo = async (signal: AbortSignal) => {
    setLoading(true)
    setError(null)
    try {
      const url = `https://api-v3.raydium.io/pools/info/list?poolType=${poolType}&poolSortField=${poolSortField}&sortType=${sortType}&pageSize=${pageSize}&page=${page}`
      console.log("Fetching from URL:", url)
      const response = await fetch(url, { signal })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const apiResponse: ApiResponse = await response.json()
      console.log("Received data:", apiResponse)
      if (apiResponse.success && apiResponse.data.data) {
        setPoolInfo(apiResponse.data.data)
        console.log("Pool info set:", apiResponse.data.data)
      } else {
        throw new Error("Failed to fetch pool info")
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.log("Fetch aborted")
        return
      }
      console.error("Error fetching Raydium pool info:", error)
      setError("Failed to fetch Raydium pool info. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <h1>Raydium Pool Information</h1>
      <div className="controls">{/* ... (controls remain the same) */}</div>
      {loading && <p>Loading pool info...</p>}
      {error && <p className="error">{error}</p>}
      {poolInfo && poolInfo.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Pool</th>
              <th>Type</th>
              <th>Price</th>
              <th>TVL</th>
              <th>Volume 24h</th>
              <th>APR 24h</th>
            </tr>
          </thead>
          <tbody>
            {poolInfo.map((pool) => (
              <tr key={pool.id}>
                <td>{`${pool.mintA.symbol}/${pool.mintB.symbol}`}</td>
                <td>{pool.type}</td>
                <td>
                  $
                  {pool.price.toLocaleString(undefined, {
                    maximumFractionDigits: 6
                  })}
                </td>
                <td>
                  $
                  {pool.tvl.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>
                  $
                  {pool.day.volume.toLocaleString(undefined, {
                    maximumFractionDigits: 2
                  })}
                </td>
                <td>{pool.day.apr.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No pool information available.</p>
      )}
    </div>
  )
}

export default PoolInfoPage
