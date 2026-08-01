import { portfolio } from './portfolio';

const env = (value: string | undefined, fallback: string) => value?.trim() || fallback;

export const socialLinks = {
  // Main social profiles
  github: env(import.meta.env.VITE_GITHUB_URL, portfolio.github),
  linkedin: env(import.meta.env.VITE_LINKEDIN_URL, portfolio.linkedin),
  email: env(import.meta.env.VITE_EMAIL, portfolio.email),
  
  // GitHub repository URLs
  repositories: {
    projectOne: import.meta.env.VITE_GITHUB_PROJECT1_URL?.trim() || '',
    projectTwo: import.meta.env.VITE_GITHUB_PROJECT2_URL?.trim() || '',
    projectThree: import.meta.env.VITE_GITHUB_PROJECT3_URL?.trim() || '',
    projectFour: import.meta.env.VITE_GITHUB_PROJECT4_URL?.trim() || '',
  },
  
  // Formatted display names (extracted from environment variables)
  display: {
    github: env(import.meta.env.VITE_GITHUB_URL, portfolio.github).replace('https://', ''),
    linkedin: env(import.meta.env.VITE_LINKEDIN_URL, portfolio.linkedin).replace('https://', ''),
    email: env(import.meta.env.VITE_EMAIL, portfolio.email),
  }
};

export default socialLinks;
