"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X, CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface SearchFilters {
  q: string
  category: string
  location: string
  startDate: Date | null
  endDate: Date | null
  minPrice: number
  maxPrice: number
  tags: string[]
  organizer: string
  sortBy: string
}

interface SearchSuggestion {
  type: "event" | "location" | "tag"
  value: string
}

export function AdvancedSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<SearchFilters>({
    q: searchParams.get("q") || "",
    category: searchParams.get("category") || "all",
    location: searchParams.get("location") || "",
    startDate: searchParams.get("startDate") ? new Date(searchParams.get("startDate")!) : null,
    endDate: searchParams.get("endDate") ? new Date(searchParams.get("endDate")!) : null,
    minPrice: Number.parseInt(searchParams.get("minPrice") || "0"),
    maxPrice: Number.parseInt(searchParams.get("maxPrice") || "1000"),
    tags: searchParams.get("tags")?.split(",").filter(Boolean) || [],
    organizer: searchParams.get("organizer") || "",
    sortBy: searchParams.get("sortBy") || "relevance",
  })

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice])

  useEffect(() => {
    if (filters.q.length >= 2) {
      fetchSuggestions()
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [filters.q])

  const fetchSuggestions = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/search/suggestions?q=${encodeURIComponent(filters.q)}`,
      )
      if (response.ok) {
        const data = await response.json()
        const allSuggestions = [...data.suggestions.events, ...data.suggestions.locations, ...data.suggestions.tags]
        setSuggestions(allSuggestions)
        setShowSuggestions(true)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
    }
  }

  const handleSearch = () => {
    const params = new URLSearchParams()

    if (filters.q) params.set("q", filters.q)
    if (filters.category !== "all") params.set("category", filters.category)
    if (filters.location) params.set("location", filters.location)
    if (filters.startDate) params.set("startDate", filters.startDate.toISOString())
    if (filters.endDate) params.set("endDate", filters.endDate.toISOString())
    if (filters.minPrice > 0) params.set("minPrice", filters.minPrice.toString())
    if (filters.maxPrice < 1000) params.set("maxPrice", filters.maxPrice.toString())
    if (filters.tags.length > 0) params.set("tags", filters.tags.join(","))
    if (filters.organizer) params.set("organizer", filters.organizer)
    if (filters.sortBy !== "relevance") params.set("sortBy", filters.sortBy)

    router.push(`/search?${params.toString()}`)
    setShowSuggestions(false)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === "event") {
      setFilters((prev) => ({ ...prev, q: suggestion.value }))
    } else if (suggestion.type === "location") {
      setFilters((prev) => ({ ...prev, location: suggestion.value }))
    } else if (suggestion.type === "tag") {
      setFilters((prev) => ({
        ...prev,
        tags: [...prev.tags, suggestion.value].filter((tag, index, arr) => arr.indexOf(tag) === index),
      }))
    }
    setShowSuggestions(false)
  }

  const removeTag = (tagToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const clearFilters = () => {
    setFilters({
      q: "",
      category: "all",
      location: "",
      startDate: null,
      endDate: null,
      minPrice: 0,
      maxPrice: 1000,
      tags: [],
      organizer: "",
      sortBy: "relevance",
    })
    setPriceRange([0, 1000])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Advanced Search
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Main Search */}
        <div className="relative">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, locations, or keywords..."
              value={filters.q}
              onChange={(e) => setFilters((prev) => ({ ...prev, q: e.target.value }))}
              className="pl-10"
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            />
          </div>

          {/* Search Suggestions */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 bg-background border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-muted flex items-center gap-2"
                >
                  <Badge variant="outline" className="text-xs">
                    {suggestion.type}
                  </Badge>
                  {suggestion.value}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Category */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="workshop">Workshop</SelectItem>
                <SelectItem value="seminar">Seminar</SelectItem>
                <SelectItem value="networking">Networking</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label>Location</Label>
            <Input
              placeholder="Enter location..."
              value={filters.location}
              onChange={(e) => setFilters((prev) => ({ ...prev, location: e.target.value }))}
            />
          </div>

          {/* Sort By */}
          <div className="space-y-2">
            <Label>Sort By</Label>
            <Select
              value={filters.sortBy}
              onValueChange={(value) => setFilters((prev) => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate ? format(filters.startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.startDate || undefined}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, startDate: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.endDate ? format(filters.endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={filters.endDate || undefined}
                  onSelect={(date) => setFilters((prev) => ({ ...prev, endDate: date || null }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label>
            Price Range: ${priceRange[0]} - ${priceRange[1]}
          </Label>
          <Slider
            value={priceRange}
            onValueChange={(value) => {
              setPriceRange(value)
              setFilters((prev) => ({ ...prev, minPrice: value[0], maxPrice: value[1] }))
            }}
            max={1000}
            step={10}
            className="w-full"
          />
        </div>

        {/* Organizer */}
        <div className="space-y-2">
          <Label>Organizer</Label>
          <Input
            placeholder="Search by organizer name or email..."
            value={filters.organizer}
            onChange={(e) => setFilters((prev) => ({ ...prev, organizer: e.target.value }))}
          />
        </div>

        {/* Selected Tags */}
        {filters.tags.length > 0 && (
          <div className="space-y-2">
            <Label>Selected Tags</Label>
            <div className="flex flex-wrap gap-2">
              {filters.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button onClick={handleSearch} className="flex-1">
            <Search className="h-4 w-4 mr-2" />
            Search Events
          </Button>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
