<!-- const handleSubmitForm=()=>{
      let queryString = '';
      if (sortBy) queryString += `sort_by=${encodeURIComponent(sortBy)}&`;
      if (limit) queryString += `limit=${encodeURIComponent(limit)}&`;
      if (minRating) queryString += `min_rating=${minRating}&`;
      if (minPrice) queryString += `min_price=${encodeURIComponent(minPrice)}&`;
      if (maxPrice) queryString += `max_price=${encodeURIComponent(maxPrice)}&`;
      if (genre) queryString += `genre=${encodeURIComponent(genre)}&`;
      if (queryString !== '' && queryString.endsWith('&')) {
        queryString = queryString.slice(0, -1);
      }
      setQueryStringForm(queryString)
   }
   const hanleClearForm=()=>{
      setSortBy(null)
      setLimit(12)
      setMinRating(null)
      setMinPrice(null)
      setMaxPrice(null)
      setQueryStringForm("")
   }
   const handleLimit = () => {
      let queryString = '';
      setLimit(x => x + 12)
      if (limit) queryString += `limit=${encodeURIComponent(limit)}&`;
      setQueryStringForm(queryString)
   } -->
