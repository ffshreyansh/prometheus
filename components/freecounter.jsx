'use client'
import React, { useEffect, useState } from 'react'
import { Progress } from './ui/progress';
import { MAX_FREE_COUNTS } from '@/constants';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Zap } from 'lucide-react';
import { useProModal } from '@/hooks/use-modals';

const FreeCounter = ({limit}) => {
  const promodal = useProModal();
    const [mounted, setmounted] = useState(false);

    useEffect(()=>{
        setmounted(true);
    },[])
  return (
    <div className="px-3">
      <Card className="bg-white/10 border-0">
        <CardContent className="py-6">
          <div className="text-center text-sm text-white mb-4 space-y-2">
            <p>
              {limit} / {MAX_FREE_COUNTS} Free Generations
            </p>
            <Progress className="h-2" value={(limit / MAX_FREE_COUNTS) * 100} />
          </div>
          <Button variant="premium" className="w-full" onClick={promodal.onOpen}>
            Upgrade
            <Zap className="w-4 h-4 ml-2 fill-white" />
          </Button>
        </CardContent>
        
      </Card>
    </div>
  )
}

export default FreeCounter