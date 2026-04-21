import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'

type ApplicationModalContextValue = {
  open: boolean
  openApplicationModal: () => void
  closeApplicationModal: () => void
  setOpen: (next: boolean) => void
}

const ApplicationModalContext = createContext<ApplicationModalContextValue | null>(null)

export function ApplicationModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  const value = useMemo<ApplicationModalContextValue>(
    () => ({
      open,
      openApplicationModal: () => setOpen(true),
      closeApplicationModal: () => setOpen(false),
      setOpen,
    }),
    [open],
  )

  return <ApplicationModalContext.Provider value={value}>{children}</ApplicationModalContext.Provider>
}

export function useApplicationModal() {
  const context = useContext(ApplicationModalContext)
  if (!context) {
    throw new Error('useApplicationModal deve ser usado dentro de ApplicationModalProvider')
  }
  return context
}
