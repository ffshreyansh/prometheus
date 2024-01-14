'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { useProModal } from '@/hooks/use-modals'
import { Badge } from './ui/badge'
import { Check, Code, ImageIcon, MessageSquare, Music, VideoIcon, Zap } from 'lucide-react'
import { Card } from './ui/card'
import { cn } from '@/lib/utils'
import { Button } from './ui/button'
import axios from 'axios'


const ProModal = () => {

  const [loading, setLoading] = useState(false)
    const proModal = useProModal();

    const tools = [
  {
    label: 'Conversation',
    icon: MessageSquare,
    href: '/conversation',
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
  },
  {
    label: 'Music Generation',
    icon: Music,
    href: '/music',
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
  {
    label: 'Image Generation',
    icon: ImageIcon,
    color: "text-pink-700",
    bgColor: "bg-pink-700/10",
    href: '/image',
  },
  {
    label: 'Video Generation',
    icon: VideoIcon,
    color: "text-orange-700",
    bgColor: "bg-orange-700/10",
    href: '/video',
  },
  {
    label: 'Code Generation',
    icon: Code,
    color: "text-green-700",
    bgColor: "bg-green-700/10",
    href: '/code',
  },
];

  const onSubscribe = async () =>{
    try {
      setLoading(true)
      const response = axios.get('/api/stripe');

      window.location.href = (await response).data.url;
    } catch (error) {
        console.log('STRIPE Client error', error)
    }finally{
      setLoading(false);
    }
  }

  return (
    <Dialog open={proModal.isOpen}onOpenChange={proModal.onClose}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle className='flex items-center justify-center gap-2'>Upgrade to Saas <Badge variant={'premium'}>PRO</Badge></DialogTitle>
      <DialogDescription className="text-center pt-2 space-y-2 text-zinc-900 font-medium">
            {tools.map((tool) => (
              <Card key={tool.href} className="p-3 border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-x-4">
                  <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                    <tool.icon className={cn("w-6 h-6", tool.color)} />
                  </div>
                  <div className="font-semibold text-sm">
                    {tool.label}
                  </div>
                </div>
                <Check className="text-primary w-5 h-5" />
              </Card>
            ))}
          </DialogDescription>

    </DialogHeader>
    <DialogFooter>
          <Button size="lg" variant="premium" className="w-full" onClick={onSubscribe}>
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>

  )
}

export default ProModal