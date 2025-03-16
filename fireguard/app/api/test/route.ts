import { NextResponse } from 'next/server';
import Together from "together-ai";

const together = new Together({
  apiKey: process.env.TOGETHERAI_API_KEY,
});

export async function GET(request: Request) {
  // return NextResponse.json({ response: "likelihood:80|explanation:Based on the provided weather data, there are several factors that contribute to a high likelihood of a wildfire occurring in this location. The average temperature is relatively high, especially on March 16, with a maximum temperature of 31.9 degrees. Additionally, the humidity is relatively low, especially on March 20, with a humidity of 51%. Low humidity and high temperatures can dry out vegetation, making it more prone to catching fire. Furthermore, there is no significant precipitation in the forecast, which can help to prevent wildfires. The wind speed is also moderate, which can help to spread a fire if one were to occur. Overall, the combination of high temperatures, low humidity, and lack of precipitation create a high-risk environment for wildfires.|temperature:31.9|humidity:51|precipitation:0|wind_speed:10"});

  const { searchParams } = new URL(request.url);
  const num = searchParams.get("num");

  const openResponse = await fetch(`https://www.zipcodeapi.com/rest/${process.env.ZIPPCODEAPI_APP_KEY}/info.json/${num}/degrees`)
  const openData = await openResponse.json();

  console.log(openData);
  
  const lat = openData.lat;
  const lng = openData.lng;

  const response = await fetch(`https://flask-firepy-git-main-daniel-goodmans-projects-79b31ccd.vercel.app/api/${lat}/${lng}`)
  const weatherData = await response.json();
  console.log(weatherData);

  const openDataString = JSON.stringify(weatherData);
  const weatherDataString = JSON.stringify(weatherData);

  const aiResponse = await together.chat.completions.create({
    messages: [
      {
        role: 'user',
        content: "You are a wildfire prediction model. "
        + "You will be given a dataset with average temperature, a date, humidity, max temp, min temp, precipitation, sum hours and wind speed. "
        + "Your goal is to give a likelyhood of that location being at a risk of a wildfire.\n\n"
        + "Location date: " 
        + openDataString
        + "\n\nWeather data: "
        + weatherDataString
        + "\n\nReturn a percentage of likelyhood of a wildfire occuring in that location. "
        + "Give a short explanation of your reasoning. The reasoning should be able to be understood by an average person. "
        + "Please format your response as follows: "
        + "anything else (KEEP IT SHORT)\n\nDATABLOCK\nlikelihood:[percentage]|explanation:[explanation]|temperature:[temperature degrees fahrenheit]|humidity:[humidity]|precipitation:[precipitation]|wind_speed:[wind_speed]\nDATABLOCK\n\n anything else (KEEP IT SHORT)"
      },
    ],
    model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  });

  console.log(aiResponse.choices[0].message?.content);
  const messageContent = aiResponse.choices[0].message?.content;

  if (messageContent === null || messageContent === undefined) {
    return NextResponse.json({ response: "No response from AI" });
  }

  const dataBlockResponse = messageContent.split("DATABLOCK")[1].trim()
  const parsedData = dataBlockResponse.split("|")

  const likelihood = Number.parseInt(parsedData[0].split(":")[1].trim());
  const explanation = parsedData[1].split(":")[1].trim();
  const temperature = parsedData[2].split(":")[1].trim();
  const humidity = parsedData[3].split(":")[1].trim();
  const precipitation = parsedData[4].split(":")[1].trim();
  const wind_speed = parsedData[5].split(":")[1].trim();

  return NextResponse.json({ data: {
    riskNumber: likelihood,
    riskDescription: explanation,
    zipCode: num,

    temperature: temperature,
    humidity: humidity,
    precipitation: precipitation,
    wind_speed: wind_speed,

    locationInfo: {
      city: openData.city,
      state: openData.state,
    }
  }});
}