import express from 'express';
const router = express.Router();

router.get('/weather',async(req,res)=>{
    try{
        const key = process.env.GOOGLE_MAPS_API_KEY 
        const response = await fetch(`https://weather.googleapis.com/v1/currentConditions:lookup?key=${key}&location.latitude=40.6054&location.longitude=-75.3772`)
        const result = await response.json();
        res.status(200).json(result);
    }catch(err){
        console.error(err)
        res.status(500).json({error:"Failed to fetch weather"})
    }
})
    
export default router

//example of what is being returned
// {
//   "currentTime": "2026-04-13T22:17:42.897856137Z",
//   "timeZone": {
//     "id": "America/New_York"
//   },
//   "isDaytime": true,
//   "weatherCondition": {
//     "iconBaseUri": "https://maps.gstatic.com/weather/v1/mostly_sunny",
//     "description": {
//       "text": "Mostly sunny",
//       "languageCode": "en"
//     },
//     "type": "MOSTLY_CLEAR"
//   },
//   "temperature": {
//     "degrees": 24.1,
//     "unit": "CELSIUS"
//   },
//   "feelsLikeTemperature": {
//     "degrees": 25.3,
//     "unit": "CELSIUS"
//   },
//   "dewPoint": {
//     "degrees": 13.7,
//     "unit": "CELSIUS"
//   },
//   "heatIndex": {
//     "degrees": 25.3,
//     "unit": "CELSIUS"
//   },
//   "windChill": {
//     "degrees": 24.1,
//     "unit": "CELSIUS"
//   },
//   "relativeHumidity": 52,
//   "uvIndex": 0,
//   "precipitation": {
//     "probability": {
//       "percent": 0,
//       "type": "RAIN"
//     },
//     "snowQpf": {
//       "quantity": 0,
//       "unit": "MILLIMETERS"
//     },
//     "qpf": {
//       "quantity": 0,
//       "unit": "MILLIMETERS"
//     }
//   },
//   "thunderstormProbability": 0,
//   "airPressure": {
//     "meanSeaLevelMillibars": 1014.22
//   },
//   "wind": {
//     "direction": {
//       "degrees": 236,
//       "cardinal": "SOUTHWEST"
//     },
//     "speed": {
//       "value": 18,
//       "unit": "KILOMETERS_PER_HOUR"
//     },
//     "gust": {
//       "value": 31,
//       "unit": "KILOMETERS_PER_HOUR"
//     }
//   },
//   "visibility": {
//     "distance": 16,
//     "unit": "KILOMETERS"
//   },
//   "cloudCover": 15,
//   "currentConditionsHistory": {
//     "temperatureChange": {
//       "degrees": 7.6,
//       "unit": "CELSIUS"
//     },
//     "maxTemperature": {
//       "degrees": 25.1,
//       "unit": "CELSIUS"
//     },
//     "minTemperature": {
//       "degrees": 9.3,
//       "unit": "CELSIUS"
//     },
//     "snowQpf": {
//       "quantity": 0,
//       "unit": "MILLIMETERS"
//     },
//     "qpf": {
//       "quantity": 0,
//       "unit": "MILLIMETERS"
//     }
//   }
// }