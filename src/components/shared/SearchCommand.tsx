// "use client"
// import {
//   Command,
//   CommandEmpty,
//   CommandGroup,
//   CommandInput,
//   CommandItem,
//   CommandList,
//   CommandSeparator,
//   CommandShortcut,
// } from "@/components/ui/command"
// import { User } from "@/interface/type"
// import { Loader2, UserCheck, UserPlus } from "lucide-react"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

// interface SearchCommandProps {
//   data: User[] | undefined
//   status?: boolean
//   error?: any
// }
// export default function SearchCommand({
//   data,
//   status,
//   error
// }: SearchCommandProps) {


//   return (
//     <Command className="rounded-lg border shadow-md">
//       <CommandInput placeholder="Type a command or search..." />
//       <CommandList>
//         {error && <CommandEmpty>{error.message}</CommandEmpty>}
//         <CommandGroup heading="Result">
//           {status ?
//             <Loader2 className='animate-spin text-zinc-500 mx-auto w-16 h-16 mb-8' /> :
//             <>{data?.map((item, index) => <UserItem
//               key={item._id}
//               data={item} />)}</>}
//         </CommandGroup>
//         <CommandSeparator />
//         <CommandGroup heading="Suggestions">
//           {/* {secondaryData?.map((item, index) => {
//             return (
//               <CommandItem key={index}>
//                 {item.imageUrl && (<></>)}
//                 <span>{item.name}</span>
//               </CommandItem>
//             )
//           })} */}
//         </CommandGroup>
//       </CommandList>
//     </Command>
//   )
// }


// const UserItem = ({ data }: {
//   data: User
// }) => {


//   const addFriend = async () => {

//   }

//   return (
//     <CommandItem className="h-12 my-2 flex justify-between">
//       <div className="flex items-center">
//         {data.profilePicture && (<Avatar className="h-10 w-10 mr-2">
//           <AvatarImage src={data.profilePicture} alt="Avatar" />
//           <AvatarFallback>{data.username[0]}</AvatarFallback>
//         </Avatar>)}
//         <span>{data.username}</span>
//       </div>
//       <>
//         {/* {mutation.isPending ?
//           <Loader2 className='animate-spin text-zinc-500 ml-auto w-6 h-6 mr-2' />
//           : mutation.isSuccess ? <UserCheck className="mx-2 cursor-pointer" />
//             : <UserPlus className="mx-2 cursor-pointer" onClick={() => mutation.mutate()} />} */}
//       </>
//     </CommandItem>
//   )
// }