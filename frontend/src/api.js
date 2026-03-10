import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

// Generate Topics
export const generateTopics = async (theme) => {
  const response = await axios.post(`${BASE_URL}/generate-topics`, {
    theme: theme,
    count: 5,
    more: false,
  });
  return response.data.data;
};

export const generateMoreTopics = async (theme) => {
  const response = await axios.post(`${BASE_URL}/generate-topics`, {
    theme: theme,
    count: 5,
    more: true,
  });
  return response.data.data;
};

// Generate Full Podcast
export const generateFullPodcast = async (theme, topic) => {
  const response = await axios.post(`${BASE_URL}/generate-full-podcast`, {
    theme: theme,
    topic: topic,
  });
  return response.data.data;
};

// General Chat
export const generalChat = async (message) => {
  const response = await axios.post(`${BASE_URL}/chat`, {
    user_message: message,
  });
  return response.data.data;
};