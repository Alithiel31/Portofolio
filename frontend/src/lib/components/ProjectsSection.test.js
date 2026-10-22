import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/svelte';
import { locale } from '../stores/locale.svelte.js';
import ProjectsSection from './ProjectsSection.svelte';

const PROJECTS = [
  {
    id: 1,
    title: 'WeatherQC',
    description: 'Weather app',
    techStack: 'Svelte 5, TypeScript',
    imageUrl: '/screenshots/weatherqc.webp',
    githubUrl: 'https://github.com/Alithiel31/WeatherQC',
    demoUrl: 'https://qcweather.alithiel31.dev',
    featured: true,
    status: 'COMPLETED',
  },
  {
    id: 2,
    title: 'Side project',
    description: 'Work in progress',
    techStack: 'Python',
    imageUrl: null,
    githubUrl: null,
    demoUrl: null,
    featured: false,
    status: 'IN_PROGRESS',
  },
];

describe('ProjectsSection', () => {
  beforeEach(() => {
    locale.set('en');
  });

  it('renders skeletons while loading', () => {
    const { container } = render(ProjectsSection, { props: { data: null, loading: true } });
    expect(container.querySelectorAll('.skeleton-card')).toHaveLength(3);
    expect(screen.queryAllByRole('article')).toHaveLength(0);
  });

  it('renders the screenshot with the project title as alt text, lazily loaded', () => {
    render(ProjectsSection, { props: { data: PROJECTS, loading: false } });
    const img = screen.getByRole('img', { name: 'WeatherQC' });
    expect(img).toHaveAttribute('src', '/screenshots/weatherqc.webp');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('shows a placeholder and no links for a project without image or URLs', () => {
    render(ProjectsSection, { props: { data: PROJECTS, loading: false } });
    const card = screen.getByRole('heading', { name: 'Side project' }).closest('article');
    expect(card.querySelector('img')).toBeNull();
    expect(card.querySelector('.img-placeholder')).not.toBeNull();
    expect(within(card).queryAllByRole('link')).toHaveLength(0);
    expect(within(card).getByText('In Progress')).toBeInTheDocument();
  });

  it('links to the code and the demo in a new tab', () => {
    render(ProjectsSection, { props: { data: PROJECTS, loading: false } });
    const card = screen.getByRole('heading', { name: 'WeatherQC' }).closest('article');
    const code = within(card).getByRole('link', { name: /code/i });
    const demo = within(card).getByRole('link', { name: /demo/i });
    expect(code).toHaveAttribute('href', 'https://github.com/Alithiel31/WeatherQC');
    expect(demo).toHaveAttribute('href', 'https://qcweather.alithiel31.dev');
    expect(code).toHaveAttribute('target', '_blank');
    expect(within(card).getByText('Featured')).toBeInTheDocument();
  });

  it('splits the tech stack into individual tags', () => {
    render(ProjectsSection, { props: { data: PROJECTS, loading: false } });
    const card = screen.getByRole('heading', { name: 'WeatherQC' }).closest('article');
    expect(within(card).getByText('Svelte 5')).toBeInTheDocument();
    expect(within(card).getByText('TypeScript')).toBeInTheDocument();
  });
});
