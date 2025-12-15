import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Comment {
    id: string
    text: string
    author: string
    authorAvatar?: string
    createdAt: Date
    editedAt?: Date
    isNote?: boolean // Differentiates notes from comments
}

interface TaskCommentsProps {
    comments: Comment[]
    currentUser?: string
    onAddComment: (text: string, isNote?: boolean) => void
    onEditComment?: (id: string, text: string) => void
    onDeleteComment?: (id: string) => void
}

export function TaskComments({
    comments,
    currentUser = 'You',
    onAddComment,
    onEditComment,
    onDeleteComment,
}: TaskCommentsProps) {
    const [newComment, setNewComment] = useState('')
    const [isNote, setIsNote] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')
    const inputRef = useRef<HTMLTextAreaElement>(null)
    const listRef = useRef<HTMLDivElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return

        onAddComment(newComment.trim(), isNote)
        setNewComment('')

        // Scroll to bottom
        setTimeout(() => {
            listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
        }, 100)
    }

    const handleEdit = (comment: Comment) => {
        setEditingId(comment.id)
        setEditText(comment.text)
    }

    const handleSaveEdit = (id: string) => {
        if (editText.trim() && onEditComment) {
            onEditComment(id, editText.trim())
        }
        setEditingId(null)
        setEditText('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit(e)
        }
    }

    useEffect(() => {
        // Auto-resize textarea
        if (inputRef.current) {
            inputRef.current.style.height = 'auto'
            inputRef.current.style.height = `${Math.min(inputRef.current.scrollHeight, 120)}px`
        }
    }, [newComment])

    const formatTime = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'Just now'
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="task-comments">
            {/* Comments List */}
            <div className="comments-list" ref={listRef}>
                <AnimatePresence>
                    {comments.length === 0 ? (
                        <div className="empty-comments">
                            <span className="empty-icon">💬</span>
                            <p>No comments yet</p>
                            <span className="empty-hint">Add notes or start a discussion</span>
                        </div>
                    ) : (
                        comments.map(comment => (
                            <motion.div
                                key={comment.id}
                                className={`comment ${comment.isNote ? 'note' : ''} ${comment.author === currentUser ? 'own' : ''}`}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                layout
                            >
                                {comment.isNote && (
                                    <div className="note-badge">📝 Note</div>
                                )}

                                <div className="comment-header">
                                    <div className="comment-author">
                                        {comment.authorAvatar ? (
                                            <img src={comment.authorAvatar} alt={comment.author} className="author-avatar" />
                                        ) : (
                                            <div className="author-avatar-placeholder">
                                                {comment.author.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <span className="author-name">{comment.author}</span>
                                    </div>
                                    <span className="comment-time">{formatTime(comment.createdAt)}</span>
                                </div>

                                {editingId === comment.id ? (
                                    <div className="edit-area">
                                        <textarea
                                            value={editText}
                                            onChange={e => setEditText(e.target.value)}
                                            autoFocus
                                        />
                                        <div className="edit-actions">
                                            <button className="cancel-btn" onClick={() => setEditingId(null)}>Cancel</button>
                                            <button className="save-btn" onClick={() => handleSaveEdit(comment.id)}>Save</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p className="comment-text">{comment.text}</p>
                                        {comment.editedAt && (
                                            <span className="edited-indicator">(edited)</span>
                                        )}
                                    </>
                                )}

                                {comment.author === currentUser && !editingId && (
                                    <div className="comment-actions">
                                        <button onClick={() => handleEdit(comment)}>Edit</button>
                                        {onDeleteComment && (
                                            <button className="delete" onClick={() => onDeleteComment(comment.id)}>Delete</button>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Input Area */}
            <form className="comment-input" onSubmit={handleSubmit}>
                <div className="input-type-toggle">
                    <button
                        type="button"
                        className={`toggle-btn ${!isNote ? 'active' : ''}`}
                        onClick={() => setIsNote(false)}
                    >
                        💬 Comment
                    </button>
                    <button
                        type="button"
                        className={`toggle-btn ${isNote ? 'active' : ''}`}
                        onClick={() => setIsNote(true)}
                    >
                        📝 Note
                    </button>
                </div>

                <div className="input-row">
                    <textarea
                        ref={inputRef}
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isNote ? 'Add a private note...' : 'Write a comment...'}
                        rows={1}
                    />
                    <button
                        type="submit"
                        className="send-btn"
                        disabled={!newComment.trim()}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2.5 10L17.5 10M17.5 10L12.5 5M17.5 10L12.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                    </button>
                </div>

                <span className="input-hint">Press Enter to send, Shift+Enter for new line</span>
            </form>
        </div>
    )
}

export default TaskComments
