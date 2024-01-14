'use client'
import * as z from 'zod'
import Header from '@/components/header'
import { CodeIcon, Download, ImageIcon, MessageSquare, MusicIcon, VideoIcon } from 'lucide-react'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { amountOptions, formSchema, resolutionOptions } from './constants'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardFooter } from '@/components/ui/card'
import Image from 'next/image'
import { useProModal } from '@/hooks/use-modals'

const page = () => {
    const router = useRouter();
    const [video, setVideo] = useState('')
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prompt: '',
            amount: '1',
            resolution: '512x512'
        }
    });
    const promodal = useProModal();
    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values) => {
        try {
            setVideo(undefined);

            const response = await axios.post('/api/video', values);

            setVideo(response.data[0])
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
                title='Video Generation'
                description='Video generation model'
                icon={VideoIcon}
                iconColor='text-orange-700'
                bgColor='bg-orange-700/10'
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
                                                placeholder="Vintage cars drifting"
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

                    {isLoading && (
                        <div className="p-20">
                            <Loader />
                        </div>
                    )}
                    {!video && !isLoading && (
                        <Empty label="No video generated." />
                    )}
                    {video && (
                       <video className='w-full aspect-video mt-8 rounded-lg border bg-black' controls>
                            <source src={video}/>
                       </video>
                    )}
                </div>
            </div>
        </div>
    )
}

export default page