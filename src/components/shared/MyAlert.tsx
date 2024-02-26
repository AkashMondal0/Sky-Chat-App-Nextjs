
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import MyAvatar from "./MyAvatar"
import Image from "next/image"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { GameRequest, User } from "@/interface/type"

const GameRequestToast =  ({
  data,
  onClick,
}: {
  data: GameRequest,
  onClick: () => void
}) => {
  const requestUser = data?.senderData

  return <Card className="w-96 h-20 flex justify-around items-center px-2">
    <MyAvatar src={requestUser?.profilePicture || ""} size="40px" alt={`${requestUser?.username}`} />
    <div className="flex flex-col justify-center items-start">
      <p className="text-sm font-semibold">{requestUser?.username}</p>
      <p className="text-xs text-gray-500">You have a new message from {requestUser?.username}</p>
    </div>
    <Button
      variant="default"
      className="rounded-2xl"
      onClick={onClick}>
      Accept
    </Button>
  </Card>
}

const AvatarToast =  ({
  data,
}: {
  data?: User,
}) => {

  return <Card className="w-96 h-20 flex justify-around items-center px-2">
    <MyAvatar src={data?.profilePicture || ""} size="40px" alt={`${data?.username}`} />
    <div className="flex flex-col justify-center items-start">
      <p className="text-sm font-semibold">{data?.username}</p>
      <p className="text-xs text-gray-500">You have a new message from {data?.username}</p>
    </div>
  </Card>
}

export {
  GameRequestToast,
  AvatarToast
}