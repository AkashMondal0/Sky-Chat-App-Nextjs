import MyAvatar from "@/components/shared/MyAvatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserType } from "@/interface/type"

export function AlertDialogDemo({
  open,
  setOpen,
  accept,
  decline,
  data
}: {
  open: boolean
  accept: () => void
  decline: () => void,
  data?: UserType,
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
          <MyAvatar src={data?.profilePicture || ""} alt={data?.username || ""} />
          <AlertDialogTitle>
            {`${data?.username} request to join your room`}
          </AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {`Do you want to allow ${data?.username} to join your room?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={decline}>
            Decline
          </AlertDialogCancel>
          <AlertDialogAction onClick={accept}>
            Accept
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
