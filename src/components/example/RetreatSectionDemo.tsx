import React, { useState, useEffect } from "react";
import { SkeletonCard } from "../SkeletonCard";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import axios from 'axios';
import {  useSelector } from "react-redux";
import {  RootState } from "@/store";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

type Retreat = {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  price: string;
  type: string;
  condition: string;
  image: string;
  duration: number;
  tags: string[];
};

export default function RetreatSectionDemo() {
  const placeholders = [
    "Want to try Yoga for better flexibility?",
    "Looking for a weekend escape to rejuvenate?",
    "Interested in a meditation retreat to clear your mind?",
    "Eager to explore a detox program for a fresh start?",
    "Curious about our wellness workshops and classes?",
    "Need a relaxing retreat to unwind from daily stress?",
    "Want to join a fitness retreat to boost your health?",
    "Searching for a serene location for your next retreat?",
    "Hoping to learn new techniques for stress management?",
    "Ready to book a personalized wellness experience?"
  ];
  const { user, loggedIn } = useSelector((state: RootState) => state.user);
  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRetreats = async (term = '', page = 1) => {
    const controller = new AbortController();
    try {
      const url = term
        ? `http://localhost:5000/api/retreats/search?search=${term}&page=${page}&limit=5`
        : `http://localhost:5000/api/retreats?page=${page}&limit=5`;
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      });
      setRetreats(response.data.retreats);
      setTotalPages(response.data.totalPages);
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching retreats:', error);
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort();
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRetreats(searchTerm, currentPage);
    }, 400); // Delay of 500ms to simulate debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchRetreats();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRetreats(searchTerm, currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
        {[...Array(22)].map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }
  const handleBook = () => {
    if (loggedIn == false) {
      alert('Please login to book a retreat');
    }
  }
  return (
    <div className="py-20 lg:py-40">
      <h1 className="relative z-10 text-lg md:text-5xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold mb-5">
        Our Retreats
      </h1>
      <br />
      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />
      <br />

      {!retreats.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
          {[...Array(22)].map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 md:gap-2 max-w-7xl mx-auto">
          {retreats.map((retreat) => (
            <div key={retreat.id} className="bg-white rounded-lg shadow-lg">
              <img
                src={retreat.image}
                alt={retreat.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-600">{retreat.title}</h2>
                <p className="text-sm text-gray-600">{retreat.description}</p>
                <p className="text-sm text-gray-600">Location: {retreat.location}</p>
                <p className="text-sm text-gray-600">Duration: {retreat.duration} days</p>
                <p className="text-sm text-gray-600">
                  Date: {new Date(retreat.date).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-semibold text-gray-800">${retreat.price}</span>
                  <button onClick={handleBook} className=" disabled:bg-blue-300 px-4 py-2 bg-blue-500 text-white rounded-md">Book Now</button>
                </div>
                <div className="mt-4">
                  {retreat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-8 flex justify-center">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
