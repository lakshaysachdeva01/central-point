const { API_BASE_URL, WEBSITE_UID, FETCH_METHODS } = require('../config/config');

exports.getWebsiteID = async () => { 
    const FETCH_WEBSITE_DETAILS_END_POINT = `${API_BASE_URL}/website/auth/get-website-by-uid/${WEBSITE_UID}`;
    const response = await fetch(FETCH_WEBSITE_DETAILS_END_POINT, {
      method: FETCH_METHODS.GET,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  
    const data = await response.json();
    return data?.data?._id || null;
  }


 

  // FETCH DATA
exports.fetchData = async (endpoint) => {
    try {  
      console.log('🌐 Fetching from endpoint:', endpoint);
      const response = await fetch(endpoint, {
        method: FETCH_METHODS.GET,
      });
  
      if (!response.ok) {
        console.error(`❌ HTTP error! Status: ${response.status}`, response.statusText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('📥 Raw API response:', JSON.stringify(data, null, 2));
  
      // Handle different response structures
      if (!data) {
        console.warn('⚠️ API returned null or undefined');
        throw new Error('Invalid data received from the API: null or undefined');
      }

      // Check if data.data exists (standard structure)
      if (data.data !== undefined) {
        console.log('✅ Found data.data structure');
        return data.data;
      }

      // Check if data is already an array (some APIs return array directly)
      if (Array.isArray(data)) {
        console.log('✅ Data is already an array');
        return data;
      }

      // If data exists but no data.data, log warning and return empty array
      console.warn('⚠️ Unexpected API response structure:', {
        hasData: !!data,
        hasDataData: !!data.data,
        isArray: Array.isArray(data),
        keys: Object.keys(data)
      });
      
      throw new Error('Invalid data received from the API. Expected data.data or array.');
    } catch (error) {
      console.error('❌ Error fetching data:', error.message);
      console.error('❌ Error stack:', error.stack);
      // Consider re-throwing the error or returning a specific error object
      // to handle errors more gracefully in the calling function.
      throw error;
    }
  };