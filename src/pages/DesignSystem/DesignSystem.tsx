import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Palette, Type, Box, Zap, Component, Download, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Design tokens
const colors = {
    zinc: [
        { name: '50', value: '#fafafa' },
        { name: '100', value: '#f4f4f5' },
        { name: '200', value: '#e4e4e7' },
        { name: '300', value: '#d4d4d8' },
        { name: '400', value: '#a1a1aa' },
        { name: '500', value: '#71717a' },
        { name: '600', value: '#52525b' },
        { name: '700', value: '#3f3f46' },
        { name: '800', value: '#27272a' },
        { name: '900', value: '#18181b' },
    ],
    accents: [
        { name: 'Violet', value: '#8b5cf6', gradient: 'from-violet-500 to-purple-600' },
        { name: 'Teal', value: '#14b8a6', gradient: 'from-teal-500 to-emerald-600' },
        { name: 'Blue', value: '#3b82f6', gradient: 'from-blue-500 to-indigo-600' },
        { name: 'Amber', value: '#f59e0b', gradient: 'from-amber-500 to-orange-600' },
    ],
}

const typography = [
    { name: 'Display', className: 'text-4xl font-bold', sample: 'Hero Heading' },
    { name: 'Title', className: 'text-2xl font-semibold', sample: 'Section Title' },
    { name: 'Subtitle', className: 'text-xl font-medium', sample: 'Card Title' },
    { name: 'Body', className: 'text-base', sample: 'Body text for paragraphs and content.' },
    { name: 'Small', className: 'text-sm', sample: 'Secondary text and labels' },
    { name: 'Caption', className: 'text-xs uppercase tracking-wider', sample: 'Caption Text' },
]

const spacing = [
    { name: '1', value: '4px', width: 'w-1' },
    { name: '2', value: '8px', width: 'w-2' },
    { name: '3', value: '12px', width: 'w-3' },
    { name: '4', value: '16px', width: 'w-4' },
    { name: '6', value: '24px', width: 'w-6' },
    { name: '8', value: '32px', width: 'w-8' },
    { name: '12', value: '48px', width: 'w-12' },
    { name: '16', value: '64px', width: 'w-16' },
]

const sections = [
    { id: 'colors', name: 'Colors', icon: Palette },
    { id: 'typography', name: 'Typography', icon: Type },
    { id: 'spacing', name: 'Spacing', icon: Box },
    { id: 'motion', name: 'Motion', icon: Zap },
    { id: 'components', name: 'Components', icon: Component },
    { id: 'resources', name: 'Resources', icon: Download },
]

export const DesignSystem = () => {
    const navigate = useNavigate()
    const [activeSection, setActiveSection] = useState('colors')

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Header */}
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
                <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 -ml-2 rounded-full hover:bg-zinc-100 text-zinc-600 transition-colors"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="font-bold text-zinc-900">Design System</h1>
                            <p className="text-xs text-zinc-500">SilenceOS v1.0</p>
                        </div>
                    </div>
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                        </div>
                        <span className="font-semibold text-zinc-900">Do<span className="text-red-500">.</span>This</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* Hero */}
                <motion.div
                    className="mb-12 text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-bold text-zinc-900 mb-4">
                        SilenceOS Design System
                    </h1>
                    <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
                        A minimal, elegant design system built for productivity.
                        Focused on clarity, whitespace, and subtle animations.
                    </p>
                </motion.div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                    {sections.map((section) => {
                        const Icon = section.icon
                        return (
                            <button
                                key={section.id}
                                onClick={() => setActiveSection(section.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeSection === section.id
                                    ? 'bg-zinc-900 text-white'
                                    : 'bg-white text-zinc-600 hover:bg-zinc-100 border border-zinc-200'
                                    }`}
                            >
                                <Icon size={16} />
                                {section.name}
                            </button>
                        )
                    })}
                </div>

                {/* Content */}
                <motion.div
                    key={activeSection}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {/* Colors Section */}
                    {activeSection === 'colors' && (
                        <div className="space-y-8">
                            <motion.div variants={itemVariants}>
                                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Zinc Palette</h2>
                                <p className="text-zinc-500 mb-6">Our primary neutral palette for UI elements.</p>
                                <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                                    {colors.zinc.map((color) => (
                                        <motion.div
                                            key={color.name}
                                            className="group"
                                            whileHover={{ y: -4 }}
                                        >
                                            <div
                                                className="aspect-square rounded-xl shadow-sm mb-2"
                                                style={{ backgroundColor: color.value }}
                                            />
                                            <p className="text-xs font-medium text-zinc-900">{color.name}</p>
                                            <p className="text-xs text-zinc-400">{color.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <h2 className="text-xl font-semibold text-zinc-900 mb-2">Accent Colors</h2>
                                <p className="text-zinc-500 mb-6">Vibrant gradients for emphasis and branding.</p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {colors.accents.map((color) => (
                                        <motion.div
                                            key={color.name}
                                            className="group"
                                            whileHover={{ scale: 1.02 }}
                                        >
                                            <div className={`h-24 rounded-2xl bg-gradient-to-br ${color.gradient} shadow-lg mb-3`} />
                                            <p className="font-medium text-zinc-900">{color.name}</p>
                                            <p className="text-sm text-zinc-400">{color.value}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Typography Section */}
                    {activeSection === 'typography' && (
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Type Scale</h2>
                            <div className="space-y-6">
                                {typography.map((type) => (
                                    <div key={type.name} className="flex items-baseline justify-between border-b border-zinc-100 pb-4">
                                        <div className="flex-1">
                                            <p className={`text-zinc-900 ${type.className}`}>{type.sample}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium text-zinc-600">{type.name}</p>
                                            <p className="text-xs text-zinc-400">{type.className}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Spacing Section */}
                    {activeSection === 'spacing' && (
                        <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                            <h2 className="text-xl font-semibold text-zinc-900 mb-6">Spacing Scale</h2>
                            <div className="space-y-4">
                                {spacing.map((space) => (
                                    <div key={space.name} className="flex items-center gap-4">
                                        <span className="w-12 text-sm font-medium text-zinc-600">spacing-{space.name}</span>
                                        <div className={`h-4 bg-zinc-900 rounded ${space.width}`} />
                                        <span className="text-sm text-zinc-400">{space.value}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Motion Section */}
                    {activeSection === 'motion' && (
                        <motion.div variants={itemVariants}>
                            <div className="grid md:grid-cols-3 gap-4">
                                {['Fast (150ms)', 'Normal (300ms)', 'Slow (500ms)'].map((duration, i) => (
                                    <div key={duration} className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                                        <div className="h-16 mb-4 flex items-center">
                                            <motion.div
                                                className="w-8 h-8 bg-zinc-900 rounded-lg"
                                                animate={{ x: [0, 100, 0] }}
                                                transition={{
                                                    duration: [0.15, 0.3, 0.5][i],
                                                    repeat: Infinity,
                                                    repeatDelay: 1,
                                                }}
                                            />
                                        </div>
                                        <p className="font-medium text-zinc-900">{duration}</p>
                                        <p className="text-sm text-zinc-400">ease-out</p>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Components Section */}
                    {activeSection === 'components' && (
                        <motion.div variants={itemVariants} className="space-y-6">
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                                <h3 className="font-semibold text-zinc-900 mb-4">Buttons</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Button variant="default">Default</Button>
                                    <Button variant="secondary">Secondary</Button>
                                    <Button variant="outline">Outline</Button>
                                    <Button variant="ghost">Ghost</Button>
                                    <Button variant="destructive">Destructive</Button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                                <h3 className="font-semibold text-zinc-900 mb-4">Inputs</h3>
                                <div className="max-w-sm space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Default input"
                                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:border-zinc-400 focus:outline-none transition-colors"
                                    />
                                    <input
                                        type="text"
                                        placeholder="With focus ring"
                                        className="w-full px-4 py-2 rounded-lg border border-zinc-200 focus:ring-2 focus:ring-zinc-900 focus:ring-offset-2 focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
                                <h3 className="font-semibold text-zinc-900 mb-4">Cards</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                                        <p className="font-medium text-zinc-900">Standard Card</p>
                                        <p className="text-sm text-zinc-500">Subtle background</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-white shadow-lg border border-zinc-100">
                                        <p className="font-medium text-zinc-900">Elevated Card</p>
                                        <p className="text-sm text-zinc-500">With shadow</p>
                                    </div>
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white">
                                        <p className="font-medium">Gradient Card</p>
                                        <p className="text-sm opacity-80">For emphasis</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Resources Section */}
                    {activeSection === 'resources' && (
                        <motion.div variants={itemVariants}>
                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    { name: 'Design Tokens', desc: 'Tailwind config & CSS variables', size: '4.2 KB' },
                                    { name: 'Figma UI Kit', desc: 'Complete component library', size: 'External' },
                                    { name: 'Icon Library', desc: 'Lucide React icons', size: '12.8 KB' },
                                    { name: 'Animation Presets', desc: 'Framer Motion variants', size: '2.1 KB' },
                                ].map((resource) => (
                                    <a
                                        key={resource.name}
                                        href="#"
                                        className="flex items-center gap-4 p-4 bg-white rounded-xl border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-900 group-hover:text-white transition-colors">
                                            <Download size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-zinc-900">{resource.name}</p>
                                            <p className="text-sm text-zinc-500">{resource.desc}</p>
                                        </div>
                                        <div className="text-sm text-zinc-400">{resource.size}</div>
                                        <ExternalLink size={16} className="text-zinc-400" />
                                    </a>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default DesignSystem
