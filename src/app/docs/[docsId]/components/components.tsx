import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Members_Sketch } from "../page"
import MyAvatar from "@/components/shared/MyAvatar"
import { User } from "@/interface/type"
import { Users2Icon } from "lucide-react"

export function MyTooltip({
  children,
  text
}: {
  children: React.ReactNode
  text: string
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export function DropDown({
  data = [],
  profileState
}: {
  data: Members_Sketch[]
  profileState?: User | null | undefined
}) {
  return (
    <Select>
      <SelectTrigger className="w-[180px] p-2 h-12">
        <div className="flex">
          {data
            .slice(0, 3)
              .map((item, index) => {
                return (
                  <div className={`relative right-${3 * index}`} key={index}>
                    <MyAvatar src={item.user?.profilePicture || ""} alt={item.user?.username || ""} />
                  </div>
                )})}
        </div>
        <Users2Icon />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Members</SelectLabel>
          {data?.map((item, index) => (
            <div className="flex items-center p-2 gap-3 w-full" key={index}>
              <MyAvatar src={item.user?.profilePicture || ""} alt={item.user?.username || ""} />
              {item.user?.username}
            </div>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
