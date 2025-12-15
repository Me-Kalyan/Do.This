import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerTrigger } from "@/components/ui/drawer"

interface ResponsiveModalProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
    title?: string
    description?: string
}

export function ResponsiveModal({ children, open, onOpenChange, trigger, title, description }: ResponsiveModalProps) {
    // Determine if we are on desktop (> 768px)
    const isDesktop = useMediaQuery("(min-width: 768px)")

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
                <DialogContent className="sm:max-w-[425px]">
                    {(title || description) && (
                        <DialogHeader>
                            {title && <DialogTitle>{title}</DialogTitle>}
                            {description && <DialogDescription>{description}</DialogDescription>}
                        </DialogHeader>
                    )}
                    {children}
                </DialogContent>
            </Dialog>
        )
    }

    return (
        <Drawer open={open} onOpenChange={onOpenChange}>
            {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
            <DrawerContent>
                {(title || description) && (
                    <DrawerHeader className="text-left">
                        {title && <DrawerTitle>{title}</DrawerTitle>}
                        {description && <DrawerDescription>{description}</DrawerDescription>}
                    </DrawerHeader>
                )}
                <div className="px-4">
                    {children}
                </div>
            </DrawerContent>
        </Drawer>
    )
}
