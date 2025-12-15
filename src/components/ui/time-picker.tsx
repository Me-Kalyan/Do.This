import { useState } from 'react'
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface TimePickerProps {
    value?: string // Format: "HH:mm"
    onChange?: (time: string) => void
    className?: string
}

function TimePicker({ value, onChange, className }: TimePickerProps) {
    const [selectedHour, setSelectedHour] = useState<number | null>(
        value ? parseInt(value.split(':')[0]) : null
    )
    const [selectedMinute, setSelectedMinute] = useState<number | null>(
        value ? parseInt(value.split(':')[1]) : null
    )

    const hours = Array.from({ length: 24 }, (_, i) => i)
    const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]

    const handleHourSelect = (hour: number) => {
        setSelectedHour(hour)
        if (selectedMinute !== null) {
            onChange?.(`${hour.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`)
        }
    }

    const handleMinuteSelect = (minute: number) => {
        setSelectedMinute(minute)
        if (selectedHour !== null) {
            onChange?.(`${selectedHour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`)
        }
    }

    const formatHour = (hour: number) => {
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const hour12 = hour % 12 || 12
        return `${hour12} ${ampm}`
    }

    return (
        <div className={cn("p-3 bg-white dark:bg-zinc-800 rounded-md border border-zinc-200 dark:border-zinc-700", className)}>
            <div className="flex gap-4">
                {/* Hours */}
                <div className="flex-1">
                    <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 text-center">
                        Hour
                    </div>
                    <ScrollArea className="h-[200px]">
                        <div className="grid grid-cols-2 gap-1">
                            {hours.map(hour => (
                                <Button
                                    key={hour}
                                    variant={selectedHour === hour ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() => handleHourSelect(hour)}
                                >
                                    {formatHour(hour)}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Minutes */}
                <div className="flex-1">
                    <div className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 text-center">
                        Minute
                    </div>
                    <ScrollArea className="h-[200px]">
                        <div className="grid grid-cols-2 gap-1">
                            {minutes.map(minute => (
                                <Button
                                    key={minute}
                                    variant={selectedMinute === minute ? 'default' : 'ghost'}
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() => handleMinuteSelect(minute)}
                                >
                                    :{minute.toString().padStart(2, '0')}
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            {/* Quick presets */}
            <div className="mt-3 pt-3 border-t">
                <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Quick Select
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['09:00', '12:00', '14:00', '17:00', '20:00'].map(preset => (
                        <Button
                            key={preset}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={() => {
                                const [h, m] = preset.split(':').map(Number)
                                setSelectedHour(h)
                                setSelectedMinute(m)
                                onChange?.(preset)
                            }}
                        >
                            {formatHour(parseInt(preset.split(':')[0]))}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Clear button */}
            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-700">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-zinc-500"
                    onClick={() => {
                        setSelectedHour(null)
                        setSelectedMinute(null)
                        onChange?.('')
                    }}
                >
                    Clear Time
                </Button>
            </div>
        </div>
    )
}
TimePicker.displayName = "TimePicker"

export { TimePicker }
