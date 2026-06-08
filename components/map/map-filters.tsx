// components/map/map-filters.tsx
"use client"

import { useApp } from "@/lib/store"
import { categories, districts } from "@/lib/mock-data"
import { useLanguage } from "@/contexts/LanguageContext"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, X } from "lucide-react"
import type { Status, Priority } from "@/lib/types"

const statuses: { value: Status; label: Record<string, string> }[] = [
  { value: "new", label: { ru: "Новые", kz: "Жаңа" } },
  { value: "confirmed", label: { ru: "Подтверждено", kz: "Расталған" } },
  { value: "in_progress", label: { ru: "В процессе", kz: "Жұмыс барысында" } },
  { value: "resolved", label: { ru: "Решено", kz: "Шешілді" } },
]

const priorities: { value: Priority; label: Record<string, string>; color: string }[] = [
  { value: "critical", label: { ru: "Критический", kz: "Критикалық" }, color: "bg-red-500" },
  { value: "medium", label: { ru: "Средний", kz: "Орташа" }, color: "bg-amber-500" },
  { value: "low", label: { ru: "Низкий", kz: "Төмен" }, color: "bg-green-500" },
]

export function MapFilters() {
  const { state, dispatch } = useApp()
  const { locale, t } = useLanguage()
  const data = t?.mapFilters
  const { filters } = state

  function toggleCategory(id: string) {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id]
    dispatch({ type: "SET_FILTERS", payload: { categories: next } })
  }

  function toggleDistrict(d: string) {
    const next = filters.districts.includes(d)
      ? filters.districts.filter((x) => x !== d)
      : [...filters.districts, d]
    dispatch({ type: "SET_FILTERS", payload: { districts: next } })
  }

  function toggleStatus(s: Status) {
    const next = filters.statuses.includes(s)
      ? filters.statuses.filter((x) => x !== s)
      : [...filters.statuses, s]
    dispatch({ type: "SET_FILTERS", payload: { statuses: next } })
  }

  function togglePriority(p: Priority) {
    const next = filters.priorities.includes(p)
      ? filters.priorities.filter((x) => x !== p)
      : [...filters.priorities, p]
    dispatch({ type: "SET_FILTERS", payload: { priorities: next } })
  }

  function clearAll() {
    dispatch({
      type: "SET_FILTERS",
      payload: {
        categories: [],
        districts: [],
        statuses: [],
        priorities: [],
        searchQuery: "",
      },
    })
  }

  const activeCount =
    filters.categories.length +
    filters.districts.length +
    filters.statuses.length +
    filters.priorities.length +
    (filters.searchQuery ? 1 : 0)

  // Функция для получения названия категории на текущем языке
  const getCategoryName = (category: typeof categories[0]) => {
    return category.name[locale as keyof typeof category.name] || category.name.ru
  }

  // Функция для получения названия района на текущем языке
  const getDistrictName = (district: typeof districts[0]) => {
    return locale === 'kz' ? district.kz : district.ru
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          {data?.title || "Фильтры"}
        </h3>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-7 gap-1 text-xs">
            <X className="h-3 w-3" />
            {data?.resetButton || "Сбросить"} ({activeCount})
          </Button>
        )}
      </div>

      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={data?.searchPlaceholder || "Поиск по кластерам..."}
            className="h-9 pl-9 text-sm"
            value={filters.searchQuery}
            onChange={(e) =>
              dispatch({ type: "SET_FILTERS", payload: { searchQuery: e.target.value } })
            }
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-5 pb-4">
          {/* Priority */}
          <div>
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data?.priorityLabel || "Приоритет"}
            </Label>
            <div className="flex flex-wrap gap-2">
              {priorities.map((p) => (
                <Badge
                  key={p.value}
                  variant={filters.priorities.includes(p.value) ? "default" : "outline"}
                  className="cursor-pointer gap-1.5"
                  onClick={() => togglePriority(p.value)}
                >
                  <span className={`h-2 w-2 rounded-full ${p.color}`} />
                  {p.label[locale]}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data?.statusLabel || "Статус"}
            </Label>
            <div className="flex flex-col gap-2">
              {statuses.map((s) => (
                <label
                  key={s.value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                >
                  <Checkbox
                    checked={filters.statuses.includes(s.value)}
                    onCheckedChange={() => toggleStatus(s.value)}
                  />
                  {s.label[locale]}
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data?.categoryLabel || "Категория"}
            </Label>
            <div className="flex flex-col gap-2">
              {categories.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                >
                  <Checkbox
                    checked={filters.categories.includes(c.id)}
                    onCheckedChange={() => toggleCategory(c.id)}
                  />
                  <span className="mr-1">{c.icon}</span>
                  {getCategoryName(c)}
                </label>
              ))}
            </div>
          </div>

          {/* District */}
          <div>
            <Label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {data?.districtLabel || "Район"}
            </Label>
            <div className="flex flex-col gap-2">
              {districts.map((d) => (
                <label
                  key={d.ru}
                  className="flex cursor-pointer items-center gap-2 text-sm text-foreground"
                >
                  <Checkbox
                    checked={filters.districts.includes(d.ru)}
                    onCheckedChange={() => toggleDistrict(d.ru)}
                  />
                  {getDistrictName(d)}
                </label>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}