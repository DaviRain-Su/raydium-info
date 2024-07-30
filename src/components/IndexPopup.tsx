// src/components/IndexPopup.tsx
import React, { useEffect, useState } from "react"

interface MintInfo {
  chainId: number
  address: string
  programId: string
  logoURI: string
  symbol: string
  name: string
  decimals: number
  tags: string[]
  extensions: Record<string, unknown>
}

interface ApiResponse {
  id: string
  success: boolean
  data: {
    blacklist: string[]
    mintList: MintInfo[]
  }
}

const IndexPopup = () => {
  const [mintTokenInfo, setMintTokenInfo] = useState<MintInfo[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMintTokenRaydiumInfo()
  }, [])

  const checkImageAccessibility = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => resolve(true)
      img.onerror = () => resolve(false)
      img.src = url
    })
  }

  const fetchMintTokenRaydiumInfo = async () => {
    try {
      const response = await fetch("https://api-v3.raydium.io/mint/list")
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: ApiResponse = await response.json()
      if (data.success && data.data.mintList) {
        const accessibleTokens = await Promise.all(
          data.data.mintList.map(async (token) => {
            const isLogoAccessible = await checkImageAccessibility(
              token.logoURI
            )
            return isLogoAccessible ? token : null
          })
        )
        const filteredTokens = accessibleTokens.filter(
          (token): token is MintInfo => token !== null
        )
        setMintTokenInfo(filteredTokens.slice(0, 10)) // Only show first 10 items for brevity
      } else {
        throw new Error("Failed to fetch mint list")
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching Raydium info:", error)
      setError("Failed to fetch Raydium info. Please try again later.")
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: 16, width: 400, fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ color: "#4a90e2" }}>Raydium Mint Token Info</h2>
      {loading && <p>Loading Raydium info...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {mintTokenInfo && mintTokenInfo.length > 0 ? (
        <div>
          {mintTokenInfo.map((token, index) => (
            <div
              key={index}
              style={{
                marginBottom: 10,
                padding: 10,
                border: "1px solid #ddd",
                borderRadius: 5
              }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 5
                }}>
                <img
                  src={token.logoURI}
                  alt={token.symbol}
                  style={{ width: 24, height: 24, marginRight: 10 }}
                />
                <h3 style={{ margin: 0 }}>
                  {token.name} ({token.symbol})
                </h3>
              </div>
              <p style={{ margin: "5px 0" }}>Decimals: {token.decimals}</p>
              <p
                style={{
                  margin: "5px 0",
                  fontSize: "0.8em",
                  wordBreak: "break-all"
                }}>
                Address: {token.address}
              </p>
              {token.tags.length > 0 && (
                <p style={{ margin: "5px 0" }}>Tags: {token.tags.join(", ")}</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No tokens with accessible logos found.</p>
      )}
    </div>
  )
}

export default IndexPopup
