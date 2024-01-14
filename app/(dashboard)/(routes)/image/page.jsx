'use client'
import * as z from 'zod'
import Header from '@/components/header'
import { CodeIcon, Download, ImageIcon, MessageSquare } from 'lucide-react'
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
    const [images, setimages] = useState([])
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
            setimages([]);

            const response = await axios.post('/api/image', values);

            const urls = response.data.map((image) => image.url);
            setimages(urls)
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
                title='Image Generation'
                description='Robust Prompt to image generation model'
                icon={ImageIcon}
                iconColor='text-pink-700'
                bgColor='bg-pink-700/10'
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
                                                placeholder="A picture of horse in corn feilds."
                                                {...field}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {amountOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="resolution"
                                render={({ field }) => (
                                    <FormItem className="col-span-12 lg:col-span-2">
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue defaultValue={field.value} />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {resolutionOptions.map((option) => (
                                                    <SelectItem
                                                        key={option.value}
                                                        value={option.value}
                                                    >
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
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
                    {images.length === 0 && !isLoading && (
                        <Empty label='No Images Generated' />
                    )}
                    <div className='flex flex-col-reverse gap-y-4'>
                        <div className='grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-col-4 gap-4 mt-8'>
                            {images.map((image) => (
                                <Card key={image} className='rounded-lg overflow-hidden'>
                                    <div className='relative aspect-square'>
                                        <Image src={image} alt='Image' fill />
                                    </div>
                                    <CardFooter className='p-2'>
                                        <Button variant='secondary' className='w-full hover:bg-pink-700 hover:text-white' onClick={() => window.open(image)} >
                                            <Download className='h-4 w-4 mr-2' />
                                            Download

                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page