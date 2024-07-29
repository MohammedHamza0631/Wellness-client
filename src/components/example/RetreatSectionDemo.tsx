import React, { useState, useEffect } from "react";
import { SkeletonCard } from "../SkeletonCard";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import axios from 'axios';
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from "../ui/toast";

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

type User = {
  id: number;
  name: string;
  email: string;
  phone: string;
};

export default function RetreatSectionDemo() {
  const { toast } = useToast();
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

  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookedRetreats, setBookedRetreats] = useState<number[]>([]);

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

  const fetchBookedRetreats = async () => {
    if (user && user.id) {
      try {
        const response = await axios.get(`http://localhost:5000/api/book/${user.id}`);
        setBookedRetreats(response.data.map((booking: { retreat_id: number }) => booking.retreat_id));
      } catch (error) {
        console.error('Error fetching booked retreats:', error);
      }
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRetreats(searchTerm, currentPage);
    }, 400); // Delay of 500ms to simulate debounce

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, currentPage]);

  useEffect(() => {
    fetchRetreats();
    fetchBookedRetreats();
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
  const { loggedIn } = useSelector((state: RootState) => state.user);
  const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') as string) : null;


  const bookRetreat = async (retreatId: number) => {
    if (!loggedIn) {
      toast({
        variant: 'destructive',
        title: "Login Required",
        description: "Please login to book a retreat",
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5000/api/book/${retreatId}`,
        {
          user_id: user?.id,
          user_name: user?.username,
          user_email: user?.email,
          user_phone: user?.phone,
          payment_details: 'Credit Card',
          booking_date: new Date().toISOString()
        },
        {
          headers: {
            'Content-Type': 'application/json'
          },
        },
      );
      // console.log(response.data);
      if (response.status !== 201) {
        const errorData = response.data;
        throw new Error(errorData.error || 'Booking Failed');
      } else {
        toast({
          title: "Booking Success",
          description: "You have successfully booked the retreat",
          action: <ToastAction altText="Close">Close</ToastAction>,
        })
        fetchBookedRetreats();
      }
    } catch (error) {
      console.error('Booking Error:', error);
      const errorMessage = axios.isAxiosError(error) && error.response?.data.message
        ? error.response.data.message
        : (error as Error).message;
      toast({
        variant: 'destructive',
        title: "Booking Error",
        description: `Error: ${errorMessage}`,
        action: <ToastAction altText="Close">Close</ToastAction>,
      })
    }
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

  return (
    <div className="py-20 lg:py-40">
      <h1 className="relative z-10 text-lg md:text-5xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold mb-5">
        Explore our exclusive retreat experiences
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
          {retreats.map((retreat, index) => (
            <div key={retreat.id} className={cn(
              "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
              (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
              index < 4 && "lg:border-b dark:border-neutral-800"
            )}>
              {index < 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
              )}
              {index >= 4 && (
                <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
              )}
              <img
                src={retreat.image}
                alt={retreat.title}
                className="w-full h-40 object-cover rounded-lg shadow-lg"
              />
              <div className="p-4">
                <div className="text-lg font-bold mb-2 relative z-10 px-10">
                  <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
                  <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
                    {retreat.title}
                  </span>
                </div>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                  {retreat.description}
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">Location: {retreat.location}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">Duration: {retreat.duration} days</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
                  Date: {new Date(retreat.date).toLocaleDateString()}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-semibold text-gray-800">${retreat.price}</span>
                  {/* <button onClick={() => bookRetreat(retreat.id)} className=" disabled:bg-blue-300 px-4 py-2 bg-blue-500 text-white rounded-md">Book Now</button> */}
                  <button
                    className={`${bookedRetreats.includes(retreat.id)
                      ? 'bg-green-500'
                      : 'bg-blue-500'
                      } text-white font-bold py-2 px-4 rounded`}
                    onClick={() => bookRetreat(retreat.id)}
                    disabled={bookedRetreats.includes(retreat.id)}
                  >
                    {bookedRetreats.includes(retreat.id) ? 'Booked' : 'Book Now'}
                  </button>
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
