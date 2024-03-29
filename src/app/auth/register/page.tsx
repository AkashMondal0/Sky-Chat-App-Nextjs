/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { redirect, useRouter } from "next/navigation"
import { Github } from "lucide-react"
import { useForm } from "react-hook-form"
import { useCallback, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { registerApiHandle } from "@/redux/slices/authentication"
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import { ProfileContext } from "@/components/provider/Profile_provider"
import { signIn, useSession } from "next-auth/react"

const schema = z.object({
    email: z.string().email({ message: "Invalid email" })
        .nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
        .nonempty({ message: "Password is required" }),
    username: z.string().nonempty({ message: "Username is required" })
        .max(20, { message: "Username must be at most 20 characters" })
})

export default function AuthenticationPage() {
    const router = useRouter()
    const session = useSession({
        required: false,
    })

    if (session.data) {
        redirect("/")
    }
    const profileContext = useContext(ProfileContext)
    const Authentication_Slice = useSelector((state: RootState) => state.Authentication_Slice)
    const dispatch = useDispatch()
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    });

    const onSubmit = useCallback(async (data: {
        email: string,
        password: string,
        username: string
    }) => {
        try {
            const _data = await dispatch(registerApiHandle({
                email: data.email,
                password: data.password,
                username: data.username
            }) as any)
            if (_data.payload?.token) {
                profileContext?.StartApp()
                signIn("credentials", {
                    email: _data.payload.email,
                    name: _data.payload.name,
                    id: _data.payload.id,
                    image: _data.payload.image,
                    redirect: false,
                });
            }
        } catch (error) {
            console.log(error)
        }
    }, [])


    return (
        <div className="h-screen p-1 flex justify-center items-center">
            <Card className="md:w-96 md:h-auto w-full h-full pt-16 md:pt-0">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">
                        Sign Up
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="grid grid-cols-2 gap-6">
                        <Button variant="outline">
                            <Github className="mr-2 h-4 w-4" />
                            Github
                        </Button>
                        <Button variant="outline" onClick={() => { }}>
                            <Github className="mr-2 h-4 w-4" />
                            Google
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>
                    <div className="h-4 w-full text-center">
                        {Authentication_Slice.error ? <span className="text-red-500">{Authentication_Slice.error}</span> : <></>}
                    </div>
                    <div className="grid gap-2">
                        <div className="h-4 w-full text-center mb-2">
                            {errors.username ? <span className="text-red-500">{errors.username?.message}</span> : <></>}
                        </div>
                        <Label htmlFor="name">name</Label>
                        <Input id="name" type="name" placeholder="example name" {...register("username", { required: true })} />
                    </div>
                    <div className="grid gap-2">
                        <div className="h-4 w-full text-center mb-2">
                            {errors.email ? <span className="text-red-500">{errors.email?.message}</span> : <></>}
                        </div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="m@example.com" {...register("email", { required: true })} />
                    </div>
                    <div className="grid gap-2">
                        <div className="h-4 w-full text-center mb-2">
                            {errors.password ? <span className="text-red-500">{errors.password?.message}</span> : <></>}
                        </div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password"  {...register("password", { required: true })} />
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                already have an account?
                                <span className="text-primary-foreground cursor-pointer text-sky-400  ml-1"
                                    onClick={() => router.replace(`/auth/login`)}>
                                    Sign In
                                </span>
                            </span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                        type="submit"
                        onClick={handleSubmit(onSubmit)}
                        // disabled={true}
                        className="w-full">
                        Sign Up
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}