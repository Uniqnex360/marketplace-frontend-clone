import React, { createContext, useContext, useEffect, useState } from "react"
import { fetchMarketplaceList } from "./marketplace"

const MarketplaceContext = createContext()

export const MarketplaceProvider = ({ userId, children }) => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry,setSelectedCountry]=useState("")
  const [error, setError] = useState(null)


 useEffect(() => {
  const stored = JSON.parse(localStorage.getItem("user") || "{}");
  const id = stored?.id;
  if (!id) return;

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchMarketplaceList(id, "MarketplaceProvider", selectedCountry);
      setCategories(data);
    } catch (err) {
      console.error("Error loading marketplace data:", err);
    } finally {
      setLoading(false);
    }
  };
  loadData();
}, [selectedCountry]);

  return (
    <MarketplaceContext.Provider value={{ categories, loading,selectedCountry,setSelectedCountry }}>
      {children}
    </MarketplaceContext.Provider>
  )
}

export const useMarketplace = () => useContext(MarketplaceContext)
