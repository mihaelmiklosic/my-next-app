// app/projects/page.js
"use client"; // This tells Next.js this is a Client Component

import { useEffect, useState } from 'react';
import Link from 'next/link';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://localhost/7111/wp-json/wp/v2/projects');
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project.id}>
            <Link href={`/projects/${project.slug}`}>
              {project.title.rendered}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProjectsPage;
