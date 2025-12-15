import * as React from "react"
import { useEffect, useRef, useState } from 'react'
import { eachMonthOfInterval, eachYearOfInterval, endOfYear, format, isAfter, isBefore, startOfYear } from 'date-fns'
import { ChevronDownIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, type DayPickerSingleProps } from 'react-day-picker'

import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { ScrollArea } from '@/components/ui/scroll-area'

export type CalendarProps = Omit<DayPickerSingleProps, 'mode'> & {
    startDate?: Date
    endDate?: Date
}

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    startDate = new Date(1980, 0),
    endDate = new Date(2030, 11),
    selected,
    onSelect,
    ...props
}: CalendarProps) {
    const today = new Date()
    const [month, setMonth] = useState(selected instanceof Date ? selected : today)
    const [isYearView, setIsYearView] = useState(false)

    const years = eachYearOfInterval({
        start: startOfYear(startDate),
        end: endOfYear(endDate)
    })

    const handleMonthSelect = (selectedMonth: Date) => {
        setMonth(selectedMonth)
        setIsYearView(false)
    }

    return (
        <div className={cn("p-3 overflow-hidden rounded-md border relative dark:bg-zinc-800 dark:border-zinc-700 bg-white border-zinc-200", className)}>
            {/* Custom Caption */}
            <div className="flex items-center justify-between mb-4">
                <Button
                    className='flex items-center gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180'
                    variant='ghost'
                    size='sm'
                    onClick={() => setIsYearView(prev => !prev)}
                    data-state={isYearView ? 'open' : 'closed'}
                >
                    {format(month, 'MMMM yyyy')}
                    <ChevronDownIcon
                        className='text-zinc-500 shrink-0 transition-transform duration-200 h-4 w-4'
                        aria-hidden='true'
                    />
                </Button>

                <div className="flex items-center space-x-1">
                    <button
                        onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
                        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md flex items-center justify-center transition-colors"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
                        className="h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md flex items-center justify-center transition-colors"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Year/Month Selector Overlay */}
            {isYearView && (
                <YearMonthSelector
                    years={years}
                    startDate={startDate}
                    endDate={endDate}
                    currentYear={month.getFullYear()}
                    currentMonth={month.getMonth()}
                    onMonthSelect={handleMonthSelect}
                />
            )}

            {/* Day Picker */}
            {!isYearView && (
                <DayPicker
                    mode="single"
                    showOutsideDays={showOutsideDays}
                    month={month}
                    onMonthChange={setMonth}
                    selected={selected as Date | undefined}
                    onSelect={onSelect as ((date: Date | undefined) => void) | undefined}
                    classNames={{
                        months: "flex flex-col",
                        month: "space-y-4",
                        caption: "hidden",
                        nav: "hidden",
                        table: "w-full border-collapse",
                        head_row: "",
                        head_cell: "text-zinc-500 dark:text-zinc-400 rounded-md w-9 font-normal text-[0.8rem] text-center",
                        row: "w-full mt-2",
                        cell: "h-9 w-9 text-center text-sm p-0 relative",
                        day: "h-9 w-9 p-0 font-normal hover:bg-zinc-100 dark:hover:bg-zinc-700 rounded-md transition-colors inline-flex items-center justify-center cursor-pointer",
                        day_selected: "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-900 dark:hover:bg-zinc-100 hover:text-white dark:hover:text-zinc-900 focus:bg-zinc-900 dark:focus:bg-zinc-100 focus:text-white dark:focus:text-zinc-900",
                        day_today: "bg-zinc-100 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100",
                        day_outside: "text-zinc-400 dark:text-zinc-600 opacity-50",
                        day_disabled: "text-zinc-300 dark:text-zinc-600 opacity-50 cursor-not-allowed",
                        day_hidden: "invisible",
                        ...classNames,
                    }}
                    components={{
                        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                        IconRight: () => <ChevronRight className="h-4 w-4" />,
                    }}
                    {...props}
                />
            )}
        </div>
    )
}
Calendar.displayName = "Calendar"

function YearMonthSelector({
    years,
    startDate,
    endDate,
    currentYear,
    currentMonth,
    onMonthSelect
}: {
    years: Date[]
    startDate: Date
    endDate: Date
    currentYear: number
    currentMonth: number
    onMonthSelect: (date: Date) => void
}) {
    const currentYearRef = useRef<HTMLDivElement>(null)
    const currentMonthButtonRef = useRef<HTMLButtonElement>(null)
    const scrollAreaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (currentYearRef.current && scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement

            if (viewport) {
                const yearTop = currentYearRef.current.offsetTop
                viewport.scrollTop = yearTop
            }

            setTimeout(() => {
                currentMonthButtonRef.current?.focus()
            }, 100)
        }
    }, [])

    return (
        <div className='bg-white dark:bg-zinc-800 absolute inset-0 z-20 p-3'>
            <ScrollArea ref={scrollAreaRef} className='h-[280px]'>
                {years.map(year => {
                    const months = eachMonthOfInterval({
                        start: startOfYear(year),
                        end: endOfYear(year)
                    })

                    const isCurrentYear = year.getFullYear() === currentYear

                    return (
                        <div key={year.getFullYear()} ref={isCurrentYear ? currentYearRef : undefined}>
                            <CollapsibleYear title={year.getFullYear().toString()} open={isCurrentYear}>
                                <div className='grid grid-cols-3 gap-2'>
                                    {months.map(month => {
                                        const isDisabled = isBefore(month, startDate) || isAfter(month, endDate)
                                        const isCurrentMonth = month.getMonth() === currentMonth && year.getFullYear() === currentYear

                                        return (
                                            <Button
                                                key={month.getTime()}
                                                ref={isCurrentMonth ? currentMonthButtonRef : undefined}
                                                variant={isCurrentMonth ? 'default' : 'outline'}
                                                size='sm'
                                                className='h-7'
                                                disabled={isDisabled}
                                                onClick={() => onMonthSelect(month)}
                                            >
                                                {format(month, 'MMM')}
                                            </Button>
                                        )
                                    })}
                                </div>
                            </CollapsibleYear>
                        </div>
                    )
                })}
            </ScrollArea>
        </div>
    )
}

function CollapsibleYear({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
    return (
        <Collapsible className='border-t px-2 py-1.5' defaultOpen={open}>
            <CollapsibleTrigger asChild>
                <Button
                    className='flex w-full justify-start gap-2 text-sm font-medium hover:bg-transparent [&[data-state=open]>svg]:rotate-180'
                    variant='ghost'
                    size='sm'
                >
                    <ChevronDownIcon
                        className='text-zinc-500 shrink-0 transition-transform duration-200 h-4 w-4'
                        aria-hidden='true'
                    />
                    {title}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className='data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden px-3 py-1 text-sm transition-all'>
                {children}
            </CollapsibleContent>
        </Collapsible>
    )
}

export { Calendar }
