import express from 'express'
import fetch from 'node-fetch'

var app = express()

app.get("/", function (request, response) {
  const KEY = process.env[KEY]
  const keyword = "vetrinarian"
  const radius = "60000" // meters
  const latitude = "44.96334453241309"
  const longitude = "-93.42300978160829"

  const getPlaces = async () => {
    const fetchResponse = await fetch(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${keyword}&location=${latitude}%2C${longitude}&radius=${radius}&key=${KEY}`)
      .then((fetchResponse) => fetchResponse.json())
    return fetchResponse
  }

  // Google requires a second call to get the full place details including phone and website
  const getPlaceDetails = async (id) => {
    const fetchResponse = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=${KEY}`)
      .then((fetchResponse) => fetchResponse.json())
    return fetchResponse
  }

  const getData = async () => {
    const places = await getPlaces()
    const results = places.results
    let detailedResults = []

    for (let i = 0; i < results.length; i++) {
      let result = await getPlaceDetails(results[i].place_id)
      detailedResults.push(result)
    }
    const csv = detailedResults.map(item => {
      return ({
        name: item.result.name,
        phone: item.result.formatted_phone_number,
        website: item.result.website,
        rating: item.result.rating,
        address: item.result.vicinity,
        mapUrl: item.result.url,
      })
    })
    console.log('csv', csv)
  }
  
  getData()
})

app.listen(10000, function () {
  console.log("Started application on port %d", 10000)
});
