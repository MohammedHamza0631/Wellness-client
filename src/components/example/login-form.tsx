"use client";
import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "../ui/toast";
import { cn } from "@/lib/utils";
import {
    IconLogin2,

} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUser } from '@/features/userSlice'
import { AppDispatch } from "@/store";

export default function LoginForm() {
    const { toast } = useToast();
    const dispatch = useDispatch<AppDispatch>()


    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username, password } = e.target as typeof e.target & {
            username: { value: string };
            password: { value: string };
        };

        try {
            const response = await axios.post(
                'http://localhost:5000/api/auth/login',
                {
                    username: username.value,
                    password: password.value
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true,
                },
            );
            // console.log(response.data)
            if (response.status !== 200) {
                const errorData = await response.data;
                throw new Error(errorData.error || 'Login Failed')
            } else if (response.status === 200) {
                const userInfo = await response.data
                // console.log(userInfo)
                localStorage.setItem('token', userInfo.token)
                toast({
                    variant: "default",
                    title: "Login Success",
                    description: "You have successfully logged in",
                    action: <ToastAction altText="Close">Close</ToastAction>,
                    className: 'bg-green-500 text-black'
                })
                dispatch(setUser(userInfo))
                window.location.replace('/')
            }
        } catch (error) {
            console.error('Login Error:', error)
            const errorMessage = axios.isAxiosError(error) && error.response?.data.message
                ? error.response.data.message
                : (error as Error).message;
            toast({
                variant: "destructive",
                title: "Login Error",
                description: `Error:${errorMessage}`,
                action: <ToastAction altText="Close">Close</ToastAction>,
            })
        }
        console.log("Form submitted");
    };
    return (
        <div className="h-screen">
            <div className="max-w-md w-full mx-auto rounded-sm md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black max-h-fit mb-2">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Login
                </h2>


                <form className="my-8" onSubmit={handleSubmit}>
                    <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                        <LabelInputContainer>
                            <Label htmlFor="username">User name</Label>
                            <Input id="username" placeholder="Tyler" type="text" />
                        </LabelInputContainer>

                    </div>
                    {/* <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" placeholder="projectmayhem@fc.com" type="email" />
        </LabelInputContainer> */}
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" placeholder="••••••••" type="password" />
                    </LabelInputContainer>


                    <button
                        className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        Login {'→'}
                        <BottomGradient />
                    </button>

                    <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                    <div className="flex flex-col space-y-4">
                        <h2>Don't have an account ?</h2>
                        <Link to={"/signup"} >
                            <button
                                className=" relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                                type="submit"
                            >
                                <IconLogin2 className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                                <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                                    Sign Up
                                </span>
                                <BottomGradient />
                            </button>
                        </Link>

                    </div>
                </form>
            </div>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn("flex flex-col space-y-2 w-full", className)}>
            {children}
        </div>
    );
};
