'use client'
import * as z from 'zod'
import Header from '@/components/header'
import { CodeIcon, MessageSquare } from 'lucide-react'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { formSchema } from './constants'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { Input } from "@/components/ui/input"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { Empty } from '@/components/empty'
import ReactMarkdown from "react-markdown";
import Loader from '@/components/loader'
import { cn } from '@/lib/utils'
import { UserAvatar } from '@/components/user-avatar'
import { BotAvatar } from '@/components/bot-avatar'
import { useProModal } from '@/hooks/use-modals'

const page = () => {
    const router = useRouter();
    const [messages, setMessages] = useState([])
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: ''
        }
    });
    const promodal = useProModal();
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        try {
            const userMessage = {
                role: 'user',
                content: values.prompt
            };
            const newMessages = [...messages, userMessage];

            const response = await axios.post('/api/code', {
                messages: newMessages
            });

            console.log('Axios Response:', response);

            setMessages((current) => [...current, userMessage, response.data]);

            form.reset();
        } catch (error) {
            console.error('Error during POST request:', error);
            if(error?.response?.status === 403){
                promodal.onOpen();
            }
            // Handle specific error cases if needed
            if (error.response) {
                console.error('Server responded with non-2xx status:', error.response);
            } else if (error.request) {
                console.error('No response received from the server:', error.request);
            } else {
                console.error('Error setting up the request:', error.message);
            }

            // Optionally, you can set an error state to display to the user
        } finally {
            router.refresh();
        }
    };
    return (
        <div>
            <Header
                title='Code Generation'
                description='GPT-4 Code Generation model'
                icon={CodeIcon}
                iconColor='text-green-500'
                bgColor='bg-green-500/10'
            />
            <div className='px-4 lg:px-8'>
                <div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="
                rounded-lg 
                border 
                w-full 
                p-4 
                px-3 
                md:px-6 
                focus-within:shadow-sm
                grid
                grid-cols-12
                gap-2
              "
                        >
                            <FormField
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-10">
                                        <FormControl className="m-0 p-0">
                                            <Input
                                                className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                                                disabled={isLoading}
                                                placeholder="Toggle button using react hooks."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
                                Generate
                            </Button>
                        </form>
                    </Form>

                </div>
                <div className='space-y-4 mt-4'>
                    {isLoading && (
                        <div className='flex w-full items-center justify-center bg-muted rounded-lg p-8'>
                            <Loader />
                        </div>
                    )}
                    {messages.length === 0 && !isLoading && (
                        <Empty label='No Conversations started yet' />
                    )}
                    <div className='flex flex-col-reverse gap-y-4'>
                        {messages.map((message) => (
                            <div
                                key={message.content}
                                className={cn(
                                    "p-8 w-full flex items-start gap-x-8 rounded-lg",
                                    message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
                                )}
                            >
                                {message.role === "user" ? <UserAvatar /> : <BotAvatar />}
                                <ReactMarkdown components={{
                                    pre: ({ node, ...props }) => (
                                        <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                                            <pre {...props} />
                                        </div>
                                    ),
                                    code: ({ node, ...props }) => (
                                        <code className="bg-black/10 rounded-md p-1" {...props} />
                                    )
                                }} className="text-sm overflow-hidden leading-7">
                                    {message.content || ""}
                                </ReactMarkdown>
                            </div>
                            
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page