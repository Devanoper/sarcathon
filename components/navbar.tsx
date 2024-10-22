"use client"
import { useState } from "react";
import {
  Navbar as NextUINavbar,
  NavbarContent,
  NavbarBrand,
} from "@nextui-org/navbar";
import { Input } from "@nextui-org/input";
import { Kbd } from "@nextui-org/kbd";
import NextLink from "next/link";
import { Button } from "@nextui-org/button";
import { Card, CardBody } from "@nextui-org/card";

import { ThemeSwitch } from "@/components/theme-switch";
import { SearchIcon } from "@/components/icons";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Type definitions for better type safety
interface SearchResult {
  question: string;
  answer: string;
  score: number;
}

export const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    if (!event.target.value) {
      setShowResults(false);
      setSearchResults([]);
    }
  };

  const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setShowResults(true);

    try {
      const response = await fetch(`${API_URL}/faq/search/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const results = await response.json();
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setError("Failed to fetch results. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle click outside to close results
  const handleClickOutside = () => {
    setShowResults(false);
  };

  const searchInput = (
    <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl">
      <Input
        aria-label="Search"
        value={searchQuery}
        onChange={handleSearchChange}
        classNames={{
          inputWrapper: "bg-default-100",
          input: "text-sm",
        }}
        endContent={
          <Kbd className="hidden lg:inline-block" keys={["command"]}>
            K
          </Kbd>
        }
        labelPlacement="outside"
        placeholder="Search..."
        startContent={
          <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
        }
        type="search"
      />
    </form>
  );

  return (
    <div className="relative">
      <NextUINavbar maxWidth="xl" position="sticky">
        {/* SarcathonAI Branding */}
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand as="li" className="gap-3 max-w-fit">
            <NextLink className="flex justify-start items-center gap-1" href="/">
              <p className="font-bold text-inherit text-2xl">Saras-AI</p>
            </NextLink>
          </NavbarBrand>
        </NavbarContent>

        {/* Search Bar */}
        <NavbarContent 
          className="hidden sm:flex basis-1/5 sm:basis-full" 
          justify="center"
        >
          {searchInput}
        </NavbarContent>

        {/* Theme Switcher */}
        <NavbarContent 
          className="sm:flex basis-1/5 sm:basis-full" 
          justify="end"
        >
          <ThemeSwitch />
        </NavbarContent>
      </NextUINavbar>

      {/* Search Results Dropdown */}
      {showResults && (
        <div 
          className="absolute left-0 right-0 mt-1 mx-auto max-w-2xl z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className="w-full">
            <CardBody>
              {loading && (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}

              {error && (
                <div className="text-danger p-4 text-center">
                  {error}
                </div>
              )}

              {!loading && !error && searchResults.length === 0 && (
                <div className="text-center p-4">
                  No results found
                </div>
              )}

              {!loading && !error && searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className="p-4 border-b last:border-b-0 hover:bg-default-100 transition-colors"
                >
                  <h3 className="font-semibold mb-2">{result.question}</h3>
                  <p className="text-sm text-default-600">{result.answer}</p>
                  {result.score && (
                    <div className="text-xs text-default-400 mt-1">
                      Relevance: {(result.score * 100).toFixed(1)}%
                    </div>
                  )}
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      )}

      {/* Overlay to handle clicks outside */}
      {showResults && (
        <div 
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        />
      )}
    </div>
  );
};