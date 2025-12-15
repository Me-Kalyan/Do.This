import { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@components/ui/Input'
import { BottomSheet } from '@components/ui/Modal'

interface QuickCaptureProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (task: { title: string; priority: string; tags: string[] }) => void
}

function QuickCapture({ isOpen, onClose, onSubmit }: QuickCaptureProps) {
    const [title, setTitle] = useState('')
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium')
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')

    const handleSubmit = () => {
        if (!title.trim()) return
        onSubmit({ title, priority, tags })
        setTitle('')
        setPriority('medium')
        setTags([])
        onClose()
    }

    const addTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            setTags([...tags, tagInput.trim()])
            setTagInput('')
        }
    }

    const removeTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <BottomSheet isOpen={isOpen} onClose={onClose} title="Quick Add" size="medium">
            <div className="quick-capture">
                {/* Task Title */}
                <Input
                    placeholder="What do you need to do?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                />

                {/* Priority */}
                <div className="quick-capture-section">
                    <span className="section-label text-caption">Priority</span>
                    <div className="priority-buttons">
                        {(['low', 'medium', 'high'] as const).map((p) => (
                            <button
                                key={p}
                                className={`priority-btn priority-${p} ${priority === p ? 'active' : ''}`}
                                onClick={() => setPriority(p)}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tags */}
                <div className="quick-capture-section">
                    <span className="section-label text-caption">Tags</span>
                    <div className="tags-input-row">
                        <Input
                            placeholder="Add tag..."
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTag()}
                        />
                        <Button variant="ghost" size="sm" onClick={addTag}>
                            Add
                        </Button>
                    </div>
                    {tags.length > 0 && (
                        <div className="tags-list">
                            {tags.map((tag) => (
                                <motion.span
                                    key={tag}
                                    className="tag"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    {tag}
                                    <button className="tag-remove" onClick={() => removeTag(tag)}>
                                        ×
                                    </button>
                                </motion.span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Submit */}
                <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={handleSubmit}
                    disabled={!title.trim()}
                >
                    Add Task
                </Button>
            </div>
        </BottomSheet>
    )
}

export default QuickCapture
