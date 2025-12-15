import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, FileText, Heart, Link as LinkIcon, Lock, Plus, X, Star, Trash2, ExternalLink } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'
import { triggerHaptic } from '@/lib/haptic'
import { useVault, VaultItem } from '@/hooks/useVault'

const typeIcons = {
    note: FileText,
    link: LinkIcon,
    password: Lock,
    file: FileText,
}

function Vault() {
    const navigate = useNavigate()
    const { isDarkMode } = useThemeStore()
    const { items, loading, addItem, deleteItem, toggleFavorite } = useVault()
    const [showAddModal, setShowAddModal] = useState(false)
    const [newItem, setNewItem] = useState({ title: '', content: '', type: 'note' as VaultItem['type'], url: '' })
    const [activeTab, setActiveTab] = useState<'all' | 'notes' | 'links' | 'favorites'>('all')

    const filteredItems = items.filter(item => {
        if (activeTab === 'all') return true
        if (activeTab === 'notes') return item.type === 'note'
        if (activeTab === 'links') return item.type === 'link'
        if (activeTab === 'favorites') return item.isFavorite
        return true
    })

    const handleAddItem = async () => {
        if (!newItem.title.trim()) return
        triggerHaptic('success')
        await addItem({
            title: newItem.title,
            content: newItem.content,
            type: newItem.type,
            url: newItem.url || undefined,
        })
        setNewItem({ title: '', content: '', type: 'note', url: '' })
        setShowAddModal(false)
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        triggerHaptic('error')
        await deleteItem(id)
    }

    const handleToggleFavorite = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        triggerHaptic('light')
        await toggleFavorite(id)
    }

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'notes', label: 'Notes' },
        { id: 'links', label: 'Links' },
        { id: 'favorites', label: 'Favorites' },
    ]

    return (
        <div className={`min-h-screen pb-20 transition-colors duration-300 ${isDarkMode ? 'bg-zinc-900 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
            }`}>
            {/* Header */}
            <header className="px-6 pt-8 pb-4">
                <div className="flex items-center gap-4 mb-4">
                    <button
                        onClick={() => { triggerHaptic('light'); navigate(-1) }}
                        className={`p-2 -ml-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                            }`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex-1">
                        <h1 className="text-xl font-semibold">Vault</h1>
                        <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                            {items.length} items saved
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeTab === tab.id
                                ? isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                                : isDarkMode ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-200 text-zinc-600'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            {/* Items Grid */}
            <section className="px-6 py-4">
                {loading ? (
                    <div className="grid grid-cols-2 gap-3">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`p-4 rounded-xl animate-pulse ${isDarkMode ? 'bg-zinc-800' : 'bg-zinc-100'}`}>
                                <div className={`w-10 h-10 rounded-lg mb-3 ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
                                <div className={`h-4 rounded w-3/4 mb-2 ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
                                <div className={`h-3 rounded w-1/2 ${isDarkMode ? 'bg-zinc-700' : 'bg-zinc-200'}`} />
                            </div>
                        ))}
                    </div>
                ) : filteredItems.length === 0 ? (
                    <div className={`text-center py-16 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                        <Heart size={32} className="mx-auto mb-3 opacity-50" />
                        <p className="text-sm">No items yet</p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className={`mt-3 px-4 py-2 text-sm rounded-lg transition-colors ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700' : 'bg-zinc-200 hover:bg-zinc-300'
                                }`}
                        >
                            Add your first item
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-3">
                        {filteredItems.map((item, index) => {
                            const Icon = typeIcons[item.type]
                            return (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={`relative p-4 rounded-xl cursor-pointer transition-colors group ${isDarkMode
                                        ? 'bg-zinc-800 hover:bg-zinc-700'
                                        : 'bg-zinc-100 hover:bg-zinc-200'
                                        }`}
                                >
                                    {/* Actions */}
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleToggleFavorite(item.id, e)}
                                            className={`p-1.5 rounded-lg ${item.isFavorite
                                                ? 'text-amber-500'
                                                : isDarkMode ? 'text-zinc-500 hover:text-zinc-300' : 'text-zinc-400 hover:text-zinc-600'
                                                }`}
                                        >
                                            <Star size={14} fill={item.isFavorite ? 'currentColor' : 'none'} />
                                        </button>
                                        <button
                                            onClick={(e) => handleDelete(item.id, e)}
                                            className={`p-1.5 rounded-lg ${isDarkMode ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-400 hover:text-red-500'}`}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>

                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${isDarkMode ? 'bg-zinc-700' : 'bg-white'
                                        }`}>
                                        <Icon size={18} className={isDarkMode ? 'text-zinc-300' : 'text-zinc-600'} />
                                    </div>
                                    <p className="text-sm font-medium mb-1 truncate pr-8">{item.title}</p>
                                    {item.content && (
                                        <p className={`text-xs line-clamp-2 ${isDarkMode ? 'text-zinc-400' : 'text-zinc-500'}`}>
                                            {item.content}
                                        </p>
                                    )}
                                    {item.url && (
                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className={`inline-flex items-center gap-1 mt-2 text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}
                                        >
                                            <ExternalLink size={10} />
                                            Open link
                                        </a>
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* FAB */}
            <motion.button
                className={`fixed bottom-24 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-40 ${isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                    }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { triggerHaptic('medium'); setShowAddModal(true) }}
            >
                <Plus size={24} />
            </motion.button>

            {/* Add Item Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddModal(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className={`fixed inset-x-4 top-[15%] z-50 max-w-md mx-auto rounded-2xl shadow-xl p-6 ${isDarkMode ? 'bg-zinc-800' : 'bg-white'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Add to Vault</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-zinc-700' : 'hover:bg-zinc-100'}`}
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Type selector */}
                            <div className="flex gap-2 mb-4">
                                {(['note', 'link', 'password'] as const).map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setNewItem({ ...newItem, type })}
                                        className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${newItem.type === type
                                            ? isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                                            : isDarkMode ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>

                            {/* Form */}
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={newItem.title}
                                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                                    className={`w-full px-4 py-3 rounded-xl outline-none ${isDarkMode
                                        ? 'bg-zinc-700 placeholder:text-zinc-500'
                                        : 'bg-zinc-100 placeholder:text-zinc-400'
                                        }`}
                                    autoFocus
                                />

                                {newItem.type === 'link' && (
                                    <input
                                        type="url"
                                        placeholder="URL"
                                        value={newItem.url}
                                        onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                                        className={`w-full px-4 py-3 rounded-xl outline-none ${isDarkMode
                                            ? 'bg-zinc-700 placeholder:text-zinc-500'
                                            : 'bg-zinc-100 placeholder:text-zinc-400'
                                            }`}
                                    />
                                )}

                                <textarea
                                    placeholder={newItem.type === 'password' ? 'Password or notes' : 'Content'}
                                    value={newItem.content}
                                    onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-xl outline-none resize-none ${isDarkMode
                                        ? 'bg-zinc-700 placeholder:text-zinc-500'
                                        : 'bg-zinc-100 placeholder:text-zinc-400'
                                        }`}
                                />

                                <button
                                    onClick={handleAddItem}
                                    disabled={!newItem.title.trim()}
                                    className={`w-full py-3 rounded-xl font-medium transition-colors ${newItem.title.trim()
                                        ? isDarkMode ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-900 text-white'
                                        : isDarkMode ? 'bg-zinc-700 text-zinc-500' : 'bg-zinc-200 text-zinc-400'
                                        }`}
                                >
                                    Add to Vault
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

export default Vault
