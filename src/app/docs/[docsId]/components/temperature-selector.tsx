// "use client"

// import {
//   HoverCard,
//   HoverCardContent,
//   HoverCardTrigger
// } from "@/components/ui/hover-card"
// import { Label } from "@/components/ui/label"
// import { Slider } from "@/components/ui/slider"

// import React from "react"




// interface TemperatureSelectorProps {
//   defaultValue: [number],
//   setVal: (val: number) => void,
//   value: number[]
// }

// export function TemperatureSelector({
//   defaultValue,
//   setVal,
//   value
// }: TemperatureSelectorProps) {

//   return (
//     <div className="grid gap-2 pt-2">
//       <HoverCard openDelay={200}>
//         <HoverCardTrigger asChild>
//           <div className="grid gap-4">
//             <div className="flex items-center justify-between">
//               <Label htmlFor="temperature">strokeWidth</Label>
//               <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-sm text-muted-foreground hover:border-border">
//                 {value}
//               </span>
//             </div>
//             <Slider
//               id="temperature"
//               max={10}
//               defaultValue={defaultValue}
//               step={0}
//               value={value}
//               onChange={setVal}
//               className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
//               aria-label="Temperature"
//             />
//           </div>
//         </HoverCardTrigger>
//         <HoverCardContent
//           align="start"
//           className="w-[260px] text-sm"
//           side="left"
//         >
//           Controls randomness: lowering results in less random completions. As
//           the temperature approaches zero, the model will become deterministic
//           and repetitive.
//         </HoverCardContent>
//       </HoverCard>
//     </div>
//   )
// }

import React from 'react'

const Page = () => {
  return (
    <div>
      
    </div>
  )
}

export default Page

