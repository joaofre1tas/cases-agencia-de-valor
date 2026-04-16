import { useEffect, useMemo, useState } from 'react'
import { Check, ChevronDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { SegmentOption } from '@/lib/segments'
import { countCasesBySegment } from '@/lib/segments'
import { cn } from '@/lib/utils'

interface SegmentComboboxProps {
  value: string
  options: SegmentOption[]
  onChange: (value: string) => void
  onCreate: (name: string) => Promise<void>
  onRename: (currentName: string, nextName: string) => Promise<void>
  onDeleteWithReplacement: (name: string, replacement?: string) => Promise<void>
}

export default function SegmentCombobox({
  value,
  options,
  onChange,
  onCreate,
  onRename,
  onDeleteWithReplacement,
}: SegmentComboboxProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [renaming, setRenaming] = useState<SegmentOption | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [deleting, setDeleting] = useState<SegmentOption | null>(null)
  const [replacement, setReplacement] = useState('')
  const [casesToMigrate, setCasesToMigrate] = useState(0)
  const [loadingCount, setLoadingCount] = useState(false)

  const migrateCountText = useMemo(() => {
    if (casesToMigrate === 1) {
      return '1 case será migrado em lote antes da exclusão.'
    }
    return `${casesToMigrate} cases serão migrados em lote antes da exclusão.`
  }, [casesToMigrate])

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return options
    }
    return options.filter((segment) => segment.name.toLowerCase().includes(normalized))
  }, [options, query])

  const canCreate = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) {
      return false
    }
    return !options.some((segment) => segment.name.toLowerCase() === normalized)
  }, [options, query])

  async function handleCreate() {
    const name = query.trim()
    if (!name) {
      return
    }
    await onCreate(name)
    onChange(name)
    setQuery('')
    setOpen(false)
  }

  async function handleRename() {
    if (!renaming) {
      return
    }
    await onRename(renaming.name, renameValue)
    if (value === renaming.name) {
      onChange(renameValue.trim())
    }
    setRenaming(null)
    setRenameValue('')
  }

  async function handleDelete() {
    if (!deleting) {
      return
    }
    const normalizedReplacement = replacement.trim()
    await onDeleteWithReplacement(
      deleting.name,
      casesToMigrate > 0 ? normalizedReplacement || undefined : undefined,
    )
    if (value === deleting.name) {
      if (casesToMigrate > 0 && normalizedReplacement) {
        onChange(normalizedReplacement)
      } else {
        onChange('')
      }
    }
    setDeleting(null)
    setReplacement('')
    setCasesToMigrate(0)
  }

  useEffect(() => {
    if (!deleting) {
      setCasesToMigrate(0)
      return
    }
    let mounted = true
    setLoadingCount(true)
    void countCasesBySegment(deleting.name)
      .then((count) => {
        if (mounted) {
          setCasesToMigrate(count)
        }
      })
      .finally(() => {
        if (mounted) {
          setLoadingCount(false)
        }
      })
    return () => {
      mounted = false
    }
  }, [deleting])

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="av-outline"
            role="combobox"
            className="w-full justify-between bg-av-bg border-av-border font-normal"
          >
            <span>{value || 'Selecione ou cadastre um segmento'}</span>
            <ChevronDown className="h-4 w-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[360px] p-0 bg-av-surface border-av-border text-av-text shadow-lg"
          align="start"
        >
          <Command
            shouldFilter={false}
            className="bg-av-surface text-av-text [&_[cmdk-input-wrapper]]:bg-av-surface [&_[cmdk-input-wrapper]]:border-av-border [&_[cmdk-input]]:bg-av-surface [&_[cmdk-list]]:bg-av-surface [&_[cmdk-group]]:bg-av-surface [&_[cmdk-empty]]:bg-av-surface"
          >
            <CommandInput
              placeholder='Buscar segmento ou digitar para criar...'
              value={query}
              onValueChange={setQuery}
              className="text-av-text placeholder:text-av-text-muted"
            />
            <CommandList>
              <CommandEmpty>Nenhum segmento encontrado.</CommandEmpty>
              <CommandGroup heading="Segmentos">
                {filtered.map((segment) => (
                  <CommandItem
                    key={segment.id}
                    value={segment.name}
                    onSelect={() => {
                      onChange(segment.name)
                      setOpen(false)
                    }}
                    className="justify-between bg-av-surface data-[selected=true]:bg-av-surface-2"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <Check
                        className={cn('h-4 w-4', value === segment.name ? 'opacity-100' : 'opacity-0')}
                      />
                      <span className="truncate">{segment.name}</span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={(event) => event.stopPropagation()}
                          onMouseDown={(event) => event.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation()
                            setRenaming(segment)
                            setRenameValue(segment.name)
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(event) => {
                            event.stopPropagation()
                            setDeleting(segment)
                            setReplacement(
                              options.find((opt) => opt.name !== segment.name)?.name || '',
                            )
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CommandItem>
                ))}
              </CommandGroup>
              {canCreate ? (
                <CommandGroup>
                  <CommandItem
                    onSelect={handleCreate}
                    className="bg-av-surface data-[selected=true]:bg-av-surface-2"
                  >
                    Criar "{query.trim()}"
                  </CommandItem>
                </CommandGroup>
              ) : null}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <AlertDialog open={Boolean(renaming)} onOpenChange={(next) => !next && setRenaming(null)}>
        <AlertDialogContent className="bg-av-surface border-av-border text-av-text">
          <AlertDialogHeader>
            <AlertDialogTitle>Editar segmento</AlertDialogTitle>
            <AlertDialogDescription>
              Renomeie o segmento. A mudança será aplicada em lote para todos os cases com esse
              segmento.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            value={renameValue}
            onChange={(event) => setRenameValue(event.target.value)}
            className="h-10 w-full rounded-md border border-av-border bg-av-bg px-3 text-sm"
            placeholder="Novo nome do segmento"
          />
          <AlertDialogFooter>
            <AlertDialogCancel className="border-av-border bg-transparent text-av-text hover:bg-av-bg">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-cta text-white"
              onClick={(event) => {
                event.preventDefault()
                void handleRename()
              }}
            >
              Salvar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(next) => !next && setDeleting(null)}>
        <AlertDialogContent className="bg-av-surface border-av-border text-av-text">
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir segmento</AlertDialogTitle>
            <AlertDialogDescription>
              {loadingCount
                ? 'Calculando quantidade de cases no segmento...'
                : casesToMigrate > 0
                  ? migrateCountText
                  : 'Nenhum case usa esse segmento. Você pode excluir sem substituto.'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {casesToMigrate > 0 ? (
            <div className="space-y-2">
              <label className="text-sm text-av-text-secondary">Segmento substituto</label>
              <Select value={replacement} onValueChange={setReplacement}>
                <SelectTrigger className="bg-av-bg border-av-border">
                  <SelectValue placeholder="Selecione o segmento substituto" />
                </SelectTrigger>
                <SelectContent>
                  {options
                    .filter((segment) => segment.name !== deleting?.name)
                    .map((segment) => (
                      <SelectItem key={segment.id} value={segment.name}>
                        {segment.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel className="border-av-border bg-transparent text-av-text hover:bg-av-bg">
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500 text-white"
              onClick={(event) => {
                event.preventDefault()
                if (casesToMigrate > 0 && !replacement.trim()) {
                  return
                }
                void handleDelete()
              }}
            >
              {casesToMigrate > 0 ? 'Excluir e migrar' : 'Excluir segmento'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
