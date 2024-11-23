import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { ChevronDownIcon, LogOutIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
export interface IUser {
  id: string
  firstName: string
  lastName: string
  avatar: string
}
export function UserMenu() {
  const router = useRouter()
  const [user, setUser] = useState<IUser>({
    id: '',
    firstName: '',
    lastName: '',
    avatar: '',
  })
  useEffect(() => {
    fetchUserDetails()
  }, [])
  const fetchUserDetails = async () => {
    try {
      const {
        data: {
          data: { user },
        },
      } = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user`, {
        withCredentials: true,
      })
      if (!user) router.push('/login')
      setUser(user)
    } catch (error) {
      console.log(error)
    }
  }
  const handleLogout = async () => {
    try {
      const {
        data: { success },
      } = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/logout`, {
        withCredentials: true,
      })
      if (success) {
        console.log('logout success')
        router.push('/login')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 text-white hover:bg-white/10 h-11">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.firstName} />
            <AvatarFallback className="bg-white/10 text-white">
              {user.firstName?.[0]}
              {user.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <span className="hidden md:inline-block">{user.firstName}</span>
          <ChevronDownIcon className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onSelect={handleLogout}>
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
