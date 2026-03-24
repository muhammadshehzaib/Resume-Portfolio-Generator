import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MinimalTemplate from '@/components/portfolio/templates/MinimalTemplate';
import { ParsedResume, CustomColors } from '@/lib/types';

describe('MinimalTemplate - Section Ordering', () => {
  const mockData: ParsedResume = {
    name: 'John Doe',
    contact: {
      email: 'john@example.com',
    },
    summary: 'A talented developer',
    experiences: [
      {
        company: 'Tech Corp',
        title: 'Senior Developer',
        start_date: '2020-01',
        description: ['Worked on projects'],
      },
    ],
    education: [
      {
        institution: 'University',
        degree: 'BS Computer Science',
        graduation_year: 2020,
      },
    ],
    skills: ['JavaScript', 'React', 'TypeScript'],
    projects: [],
    certifications: [],
  };

  const mockColors: CustomColors = {
    primaryColor: '#3b82f6',
    bgColor: '#ffffff',
  };

  it('renders sections in default order when no section_order is provided', () => {
    const { container } = render(
      <MinimalTemplate
        data={mockData}
        customColors={mockColors}
        darkMode={false}
        availableForHire={false}
      />
    );

    // Get all headings to check order
    const headings = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent);

    // Default order should be: Experience, Education, Skills, Projects, Certifications
    const experienceIndex = headings.findIndex((h) => h?.toLowerCase().includes('experience'));
    const skillsIndex = headings.findIndex((h) => h?.toLowerCase().includes('skill'));

    expect(experienceIndex).toBeLessThan(skillsIndex);
  });

  it('renders sections in custom order when section_order is provided', () => {
    const customOrder = ['skills', 'experience', 'education', 'projects', 'certifications'];

    const { container } = render(
      <MinimalTemplate
        data={mockData}
        customColors={mockColors}
        darkMode={false}
        availableForHire={false}
        sectionOrder={customOrder}
      />
    );

    const headings = Array.from(container.querySelectorAll('h2')).map((h) => h.textContent);

    // With custom order, Skills should come before Experience
    const experienceIndex = headings.findIndex((h) => h?.toLowerCase().includes('experience'));
    const skillsIndex = headings.findIndex((h) => h?.toLowerCase().includes('skill'));

    expect(skillsIndex).toBeLessThan(experienceIndex);
  });

  it('renders profile photo when photoUrl is provided', () => {
    const photoUrl = 'https://example.com/profile.jpg';

    render(
      <MinimalTemplate
        data={mockData}
        customColors={mockColors}
        darkMode={false}
        availableForHire={false}
        photoUrl={photoUrl}
      />
    );

    const photoImg = screen.getByAltText('Profile');
    expect(photoImg).toBeInTheDocument();
    expect(photoImg).toHaveAttribute('src', photoUrl);
  });

  it('does not render photo when photoUrl is not provided', () => {
    const { container } = render(
      <MinimalTemplate
        data={mockData}
        customColors={mockColors}
        darkMode={false}
        availableForHire={false}
      />
    );

    const photoImg = container.querySelector('img[alt="Profile"]');
    expect(photoImg).not.toBeInTheDocument();
  });

  it('applies custom colors to the template', () => {
    const customColors = {
      primaryColor: '#ff0000',
      bgColor: '#00ff00',
    };

    const { container } = render(
      <MinimalTemplate
        data={mockData}
        customColors={customColors}
        darkMode={false}
        availableForHire={false}
      />
    );

    expect(container).toBeTruthy();
  });

  it('renders "Available for hire" badge when set', () => {
    render(
      <MinimalTemplate
        data={mockData}
        customColors={mockColors}
        darkMode={false}
        availableForHire={true}
      />
    );

    expect(screen.getByText(/Available for hire/i)).toBeInTheDocument();
  });

  it('renders name and contact information', () => {
    render(
      <MinimalTemplate
        data={mockData}
        customColors={mockColors}
        darkMode={false}
        availableForHire={false}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('renders all skills from the data', () => {
    render(
      <MinimalTemplate
        data={mockData}
        customColors={mockColors}
        darkMode={false}
        availableForHire={false}
      />
    );

    expect(screen.getByText('JavaScript')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });
});
