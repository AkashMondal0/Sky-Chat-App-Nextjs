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
  profileState?:User | null | undefined
}) {
  return (
    <Select>
      <SelectTrigger className="w-[180px] p-2 h-12">
        <MyAvatar src={profileState?.profilePicture||""} alt={profileState?.username||""} />
        <p className="text-base">{profileState?.username}</p>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Members</SelectLabel>
          {data?.map((item, index) => (
            <SelectItem key={index} value={item.user?._id as string}>
              <MyAvatar src={item.user?.profilePicture||""} alt={item.user?.username||""} />
              {item.user?.username}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
