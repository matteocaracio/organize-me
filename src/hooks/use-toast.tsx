
import { useState, createContext, useContext } from 'react'
import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToastContextType = {
  toasts: ToasterToast[]
  addToast: (toast: ToasterToast) => void
  updateToast: (id: string, toast: ToasterToast) => void
  dismissToast: (id: string) => void
  removeToast: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

const genId = () => Math.random().toString(36).substring(2, 9)

export function useToast() {
  const context = useContext(ToastContext)

  if (context === null) {
    const addToast = (props: Omit<ToasterToast, "id">) => {
      const id = genId()
      const toast = { id, ...props }
      
      // Fallback for missing context - create a simple toast system
      const toastContainer = document.getElementById('toast-container')
      if (toastContainer) {
        const toastElement = document.createElement('div')
        toastElement.className = 'fixed bottom-4 right-4 bg-white dark:bg-slate-800 p-4 rounded-md shadow-md border border-slate-200 dark:border-slate-700'
        toastElement.innerHTML = `
          <h3 class="font-medium">${props.title || ''}</h3>
          <p class="text-slate-600 dark:text-slate-400">${props.description || ''}</p>
        `
        toastContainer.appendChild(toastElement)
        setTimeout(() => toastContainer.removeChild(toastElement), 3000)
      } else {
        console.warn(`Toast: ${props.title} - ${props.description}`)
      }
      
      return toast
    }
    
    return {
      toasts: [],
      addToast,
      updateToast: (id: string, data: ToasterToast) => {},
      dismissToast: (id: string) => {},
      removeToast: (id: string) => {},
      toast: addToast
    }
  }

  return {
    ...context,
    toast: (props: Omit<ToasterToast, "id">) => {
      // Create a complete ToasterToast object with an id before passing to addToast
      const id = genId()
      return context.addToast({ ...props, id })
    }
  }
}

export function toast(props: Omit<ToasterToast, "id">) {
  const { addToast } = useToast()
  // Make sure we're adding the id before passing to addToast
  const id = genId()
  return addToast({ ...props, id })
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToasterToast[]>([])

  const addToast = (toast: ToasterToast) => {
    setToasts((prev) => [...prev, toast].slice(-TOAST_LIMIT))
    return toast
  }

  const updateToast = (id: string, toast: ToasterToast) => {
    setToasts((prev) => 
      prev.map((t) => (t.id === id ? { ...t, ...toast } : t))
    )
  }

  const dismissToast = (id: string) => {
    setToasts((prev) => 
      prev.map((t) => (t.id === id ? { ...t, open: false } : t))
    )
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        updateToast,
        dismissToast,
        removeToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  )
}
