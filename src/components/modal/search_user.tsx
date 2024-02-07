'use client'
import { FC, useEffect } from 'react';
import { Modal } from '../shared/Modal';
import SearchCommand from '../shared/SearchCommand';
import { User } from '@/interface/type';
import { UserPlus, UserPlus2, Users } from 'lucide-react';
import { Button } from '../ui/button';

interface SearchModalProps { }

const SearchModal: FC<SearchModalProps> = () => {


  return (<Modal title={"Search User"} trigger={<Button variant={"ghost"}>
    <UserPlus className='w-6 h-6 cursor-pointer' />

  </Button>}>
    <></>
  </Modal>)
};

export default SearchModal;