import axios from "axios";

const getBaseUrl = () => {
  if (
    typeof import.meta.env !== "undefined" &&
    import.meta.env.VITE_API_BASE_URL
  ) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  return "http://localhost:8000";
};

const BASE_URL = getBaseUrl();

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const DEFAULT_GREETINGS = [
  {
    id: "1",
    greeting: "Namaste",
    region: "North India",
    description:
      "A respectful form of greeting in Hindu custom, found across India, accompanied by a folded-hands gesture.",
  },
  {
    id: "2",
    greeting: "Vanakkam",
    region: "South India",
    description:
      "A traditional Tamil greeting expressing respect, honor, and hospitality to guests and elders.",
  },
  {
    id: "3",
    greeting: "Sat Sri Akaal",
    region: "North India",
    description:
      "A Punjabi Sikh greeting meaning 'God is the Ultimate Truth', used to show respect and warmth.",
  },
  {
    id: "4",
    greeting: "Aadab",
    region: "Widespread",
    description:
      "A polite hand gesture and greeting used in Urdu-speaking communities, symbolizing respect and courtesy.",
  },
  {
    id: "5",
    greeting: "Nomoskar",
    region: "East India",
    description:
      "The traditional Bengali greeting used to welcome people, showing deep respect and humility.",
  },
  {
    id: "6",
    greeting: "Khamma Ghani",
    region: "West India",
    description:
      "A traditional Rajasthani greeting used to welcome guests with respect and humility.",
  },
  {
    id: "7",
    greeting: "Namaskar",
    region: "West India",
    description:
      "A respectful greeting used in Maharashtra and other parts of India, meaning 'I bow to you'.",
  },
  {
    id: "8",
    greeting: "Kuzu Zangpo",
    region: "Northeast India",
    description:
      "A traditional greeting used in Sikkim and neighboring regions, wishing good health and prosperity.",
  },
];

export const getGreetings = async (skip = 0, limit = 20) => {
  try {
    const response = await api.get("/api/v1/greetings", {
      params: { skip, limit },
    });
    return response.data;
  } catch (error) {
    console.warn(
      "Failed to fetch greetings from server, falling back to local mock data.",
      error,
    );
    return DEFAULT_GREETINGS;
  }
};

export default api;
