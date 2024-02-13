/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { FC, useCallback, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import { PrivateChat, User } from '@/interface/type';
import { Loader2, UserPlus, UserPlus2, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { debounce } from 'lodash';
import { fetchSearchUser } from '@/redux/slices/users';
import { Input } from '../ui/input';
import { useRouter } from 'next/navigation';
import uid from '@/lib/uuid';


interface SearchModalProps { }
const schema = z.object({
  keyword: z.string().min(1)
})
const SearchModal: FC<SearchModalProps> = () => {
  const dispatch = useDispatch()
  const router = useRouter()
  const { loading, error, searchUser: data } = useSelector((state: RootState) => state.Users_Slice)
  const { List } = useSelector((state: RootState) => state.Conversation_Slice)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      keyword: "",
    }
  });

  const handleSearch = useCallback((search: string) => {
    dispatch(fetchSearchUser(search) as any)
  }, []);

  const debouncedHandleSearch = useCallback(debounce(handleSearch, 1000), []);

  const CreateConnectionUser = useCallback(async (receiverData: User) => {
    const getChat = List.find((item) => item.users?.find((item) => item === receiverData._id))

    if (getChat) {
      router.push(`/${getChat._id}`)
    } else {
      try {
        router.push(`/${uid()}?userId=${receiverData._id}`)
      } catch (error: any) {
        console.error("error", error.message)
      }
    }

  }, []);

  return (<Modal title={"Search User"}
    trigger={<Button variant={"ghost"}>
      <UserPlus className='w-6 h-6 cursor-pointer' />
    </Button>}>
    <>
      <Input placeholder="Type a command or search..."
        type='text'
        {...register("keyword", {
          required: true,
          onChange(event) {
            // console.log("event", event.target.value)
            debouncedHandleSearch(event.target.value)
          },
        })} />
      <div className="rounded-lg border shadow-md px-2">
        <div>
          {error && <p>{error.message}</p>}
          {loading ?
            <Loader2 className='animate-spin text-zinc-500 mx-auto w-16 h-16 mb-8' /> :
            <>{data?.map((item, index) => <UserItem
              onClick={() => CreateConnectionUser(item)}
              key={item._id}
              data={item} />)}</>}
        </div>
      </div>
    </>
  </Modal>)
};

export default SearchModal;

const UserItem = ({ data, onClick }: {
  data: User
  onClick?: () => void
}) => {

  return (
    <Button
      onClick={onClick}
      variant={"ghost"} className="h-12 px-2 my-2 flex justify-between w-full">
      <div className="h-12 my-2 flex justify-between">
        <div className="flex items-center">
          {data.profilePicture && (<Avatar className="h-10 w-10 mr-2">
            <AvatarImage src={data.profilePicture} alt="Avatar" />
            <AvatarFallback>{data.username[0]}</AvatarFallback>
          </Avatar>)}
          <span>{data.email}</span>
        </div>
      </div>
    </Button>
  )
}