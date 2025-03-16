'use client'

import { Progress } from "radix-ui";

interface ResponseProps {
  response: string;
}

export default function Response(props: ResponseProps) {
  const responseString = props.response;

  const responseArray = responseString.split('|');
  const likelihood = responseArray[0].split(':')[1];
  const explanation = responseArray[1].split(':')[1];

  return (
    <div>
      <Progress.Root className="ProgressRoot" value={parseFloat(likelihood)} max={100}>
        <Progress.Indicator className="ProgressIndicator" />
      </Progress.Root>
      <p>Likelihood of wildfire: {likelihood}%</p>
      <p>Explanation: {explanation}</p>
    </div>
  )
}