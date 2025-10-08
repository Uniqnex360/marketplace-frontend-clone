import axios from 'axios'
const API_BASE_URL = process.env.REACT_APP_IP

export const fetchMarketplaceList = async (userId,source='Unknown',country) => {
        console.log(`[fetchMarketplaceList] called from: ${source}`)

  try {
    const response = await axios.get(`${API_BASE_URL}getMarketplaceList/`, {
      params: { user_id: userId,country:country }
    })

    const categoryData = response.data.data.map((item) => ({
      id: item.id,
      name: item.name,
      imageUrl: item.image_url,
      ...(item.fulfillment_channel?.length > 0 && { fulfillment_channel: item.fulfillment_channel }),
    }))

    return categoryData
  } catch (error) {
    console.error("Error fetching marketplace list", error)
    throw error
  }
}
