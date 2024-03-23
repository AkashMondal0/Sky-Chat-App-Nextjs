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
import { Github, QrCode } from "lucide-react"
import { useForm } from "react-hook-form"
import { useCallback, useContext, useEffect, useState } from "react"
import { loginApiHandle } from "@/redux/slices/authentication"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { zodResolver } from '@hookform/resolvers/zod';
import z from "zod"
import { ProfileContext } from "@/components/provider/Profile_provider"
import QRCode from "react-qr-code";
import { socket } from "@/lib/socket"
import { signIn, useSession } from "next-auth/react"
const schema = z.object({
    email: z.string().email({ message: "Invalid email" })
        .nonempty({ message: "Email is required" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" })
        .nonempty({ message: "Password is required" })
})

export default function AuthenticationPage() {
    const router = useRouter()
    const session = useSession({
        required: false,
    })

    if (session.data) {
        redirect("/")
    }
    const dispatch = useDispatch()
    const profileContext = useContext(ProfileContext)
    const [loginToggle, setLoginToggle] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
        }
    });
    const Authentication_Slice = useSelector((state: RootState) => state.Authentication_Slice)


    const onSubmit = useCallback(async (data: {
        email: string,
        password: string,
    }) => {
        try {
            const _data = await dispatch(loginApiHandle({
                email: data.email,
                password: data.password,
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

    const handleLoginToggle = useCallback(() => {
        setLoginToggle(!loginToggle)
    }, [loginToggle])

    useEffect(() => {
        // !socket.connected && socket.connect() 
        socket.on("qr_code_receiver", (data) => {
            if (data?.token) {
                profileContext?.handleQRLogin(data.token)
                router.replace('/')
            }
        })

        return () => {
            socket.off("qr_code_receiver")
        }
    }, [])

    return (
        <div className="h-screen p-1 flex justify-center items-center">
            <Card className="md:w-96 md:h-auto w-full h-full pt-16 md:pt-0">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl">
                        Sign In
                    </CardTitle>
                    <CardDescription>
                        Enter your email below to create your account
                    </CardDescription>
                </CardHeader>

                {loginToggle ?
                    <div>
                        <div className="w-[256px] h-[256px] p-1 max-w-sm mx-auto bg-background bg-white">
                            <QRCode
                                size={256}
                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                value={socket.id || ""}
                                viewBox={`0 0 256 256`}
                            />
                        </div>
                        <div className="flex justify-center items-center w-full my-5">
                            <Button onClick={handleLoginToggle} className="w-36">
                                Back
                            </Button>
                        </div>
                    </div>
                    :
                    <div>
                        <div className="flex w-full justify-around">
                            <Button variant="outline" onClick={handleLoginToggle}>
                                <QrCode className="mr-2 h-4 w-4" />
                                QR Code
                            </Button>
                            <Button variant="outline">
                                <Github className="mr-2 h-4 w-4" />
                                Github
                            </Button>
                            <Button variant="outline" onClick={() => { }}>
                                <Github className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </div>
                        <CardContent className="grid gap-4">

                            <form onSubmit={handleSubmit(onSubmit)}
                                className="grid gap-4">
                                <div className="grid grid-cols-2 gap-6">
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
                                {/* show error message */}
                                <div className="h-4 w-full text-center">
                                    {Authentication_Slice.error ? <span className="text-red-500">{Authentication_Slice.error}</span> : <></>}
                                </div>
                                <div className="grid gap-2">
                                    <div className="h-4 w-full text-center">
                                        {errors.email ? <span className="text-red-500">{errors.email?.message}</span> : <></>}
                                    </div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" type="email" placeholder="m@example.com"  {...register("email", { required: true })} />
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
                                            {`you don't have an account?`}
                                            <span className="text-primary-foreground cursor-pointer text-sky-400 ml-1"
                                                onClick={() => router.replace(`/auth/register`)}>
                                                Sign Up
                                            </span>
                                        </span>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                onClick={handleSubmit(onSubmit)}
                                // disabled={true}
                                className="w-full">
                                Sign In
                            </Button>
                        </CardFooter>
                    </div>}
            </Card>
        </div>
    )
}