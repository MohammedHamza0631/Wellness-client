import React, { useState, useEffect, useId } from "react";
import { SkeletonCard } from "../SkeletonCard";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import axios from 'axios'
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


  const [retreats, setRetreats] = useState<Retreat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRetreats = async (term = '') => {
    const controller = new AbortController()
    try {
      const url = term
        ? `http://localhost:5000/api/retreats/search?search=${term}`
        : 'http://localhost:5000/api/retreats';
      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json'
        },
        signal: controller.signal
      })
      setRetreats(response.data)
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching retreats:', error)
      }
    } finally {
      setLoading(false);
    }
    return () => controller.abort()
  };
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRetreats(searchTerm)
    }, 400) // Delay of 500ms to simulate debounce

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])
  useEffect(() => {
    fetchRetreats();
  }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRetreats(searchTerm);

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
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-md">Book Now</button>
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
    </div>
  );
}

const grid = [
  {
    title: "HIPAA and SOC2 Compliant",
    description:
      "Our applications are HIPAA and SOC2 compliant, your data is safe with us, always.",
  },
  {
    title: "Automated Social Media Posting",
    description:
      "Schedule and automate your social media posts across multiple platforms to save time and maintain a consistent online presence.",
  },
  {
    title: "Advanced Analytics",
    description:
      "Gain insights into your social media performance with detailed analytics and reporting tools to measure engagement and ROI.",
  },
  {
    title: "Content Calendar",
    description:
      "Plan and organize your social media content with an intuitive calendar view, ensuring you never miss a post.",
  },
  {
    title: "Audience Targeting",
    description:
      "Reach the right audience with advanced targeting options, including demographics, interests, and behaviors.",
  },
  {
    title: "Social Listening",
    description:
      "Monitor social media conversations and trends to stay informed about what your audience is saying and respond in real-time.",
  },
  {
    title: "Customizable Templates",
    description:
      "Create stunning social media posts with our customizable templates, designed to fit your brand's unique style and voice.",
  },
  {
    title: "Collaboration Tools",
    description:
      "Work seamlessly with your team using our collaboration tools, allowing you to assign tasks, share drafts, and provide feedback in real-time.",
  },
];

export const Grid = ({
  pattern,
  size,
}: {
  pattern?: number[][];
  size?: number;
}) => {
  const p = pattern ?? [
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
    [Math.floor(Math.random() * 4) + 7, Math.floor(Math.random() * 6) + 1],
  ];
  return (
    <div className="pointer-events-none absolute left-1/2 top-0  -ml-20 -mt-2 h-full w-full [mask-image:linear-gradient(white,transparent)]">
      <div className="absolute inset-0 bg-gradient-to-r  [mask-image:radial-gradient(farthest-side_at_top,white,transparent)] dark:from-zinc-900/30 from-zinc-100/30 to-zinc-300/30 dark:to-zinc-900/30 opacity-100">
        <GridPattern
          width={size ?? 20}
          height={size ?? 20}
          x="-12"
          y="4"
          squares={p}
          className="absolute inset-0 h-full w-full  mix-blend-overlay dark:fill-white/10 dark:stroke-white/10 stroke-black/10 fill-black/10"
        />
      </div>
    </div>
  );
};

export function GridPattern({ width, height, x, y, squares, ...props }: any) {
  const patternId = useId();

  return (
    <svg aria-hidden="true" {...props}>
      <defs>
        <pattern
          id={patternId}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path d={`M.5 ${height}V.5H${width}`} fill="none" />
        </pattern>
      </defs>
      <rect
        width="100%"
        height="100%"
        strokeWidth={0}
        fill={`url(#${patternId})`}
      />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]: any) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width + 1}
              height={height + 1}
              x={x * width}
              y={y * height}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}
