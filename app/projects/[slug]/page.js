"use client";

import { useEffect, useState } from "react";

const ProjectPage = ({ params }) => {
  const [project, setProject] = useState(null);
  const [images, setImages] = useState([]);
  const [activeImageIndex, setActiveImageIndex] = useState(0); // Track the active image
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const { slug } = params;

  useEffect(() => {
    // Fetch project data from WordPress REST API
    const fetchProject = async () => {
      try {
        const res = await fetch(`http://localhost/7111/wp-json/wp/v2/projects?slug=${slug}`);
        const data = await res.json();
        const projectData = data[0];
        setProject(projectData);

        // Fetch all images based on project_images IDs
        if (projectData.acf?.project_images.length > 0) {
          const imageFetches = projectData.acf.project_images.map(async (imageId) => {
            const imageRes = await fetch(`http://localhost/7111/wp-json/wp/v2/media/${imageId}`);
            return imageRes.json();
          });

          const imageData = await Promise.all(imageFetches);
          setImages(imageData); // Set fetched images
        }
      } catch (error) {
        console.error("Error fetching project:", error);
      }
    };

    fetchProject();
  }, [slug]);

  const showImage = (index) => {
    if (index < 0) {
      index = images.length - 1; // Wrap to last image if index is negative
    } else if (index >= images.length) {
      index = 0; // Wrap to first image if index exceeds image count
    }
    setActiveImageIndex(index);
  };

  const toggleProjectInfo = () => {
    setIsInfoExpanded(!isInfoExpanded);
  };

  if (!project) return <div>Loading...</div>;

  const { acf } = project;

  return (
    <section id="project-content" style={{ position: "relative" }}>
      {/* Project Image Section */}
      {images.length > 0 ? (
        <div className="image-container" id="image-container">
          {/* Only show the active image */}
          <img
            key={images[activeImageIndex].id}
            src={images[activeImageIndex].media_details.sizes.full.source_url}
            alt={`Project Image ${activeImageIndex + 1}`}
            className="project-image active"

          />

          {/* Clickable zones */}
          <div
            className="clickable-zone clickable-left"
            onClick={() => showImage(activeImageIndex - 1)}
          ></div>
          <div
            className="clickable-zone clickable-right"
            onClick={() => showImage(activeImageIndex + 1)}
          ></div>
        </div>
      ) : (
        <p>No images found</p>
      )}

      {/* Project Info Section */}
      <div id="project-info" className={`project-info ${isInfoExpanded ? "expand" : ""}`}>
        <div className="grid-20 items-center px-1.5" style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{acf.project_id} {acf.project_name}</span>
          <span className="hidden-mobile"></span>
          <button id="toggle-button" className="text-right" onClick={toggleProjectInfo}>
            Info
          </button>
        </div>

        <div className="project-info-content grid-20 px-1.5">
          <div className="col-span-9">
            <div className="grid grid-cols-9">
              {/* Project Info Fields */}
              <div className="col-span-3">Project</div>
              <div className="col-span-6 px-0.5">{acf.project_name || '—'}</div>
              <div className="col-span-3">Start</div>
              <div className="col-span-6 px-0.5">{acf.project_start || '—'}</div>
              <div className="col-span-3">Finish</div>
              <div className="col-span-6 px-0.5">{acf.project_finish || '—'}</div>
              <div className="col-span-3">Location</div>
              <div className="col-span-6 px-0.5">{acf.project_location || '—'}</div>
              <div className="col-span-3">Program</div>
              <div className="col-span-6 px-0.5">{acf.project_program || '—'}</div>
              <div className="col-span-3">Type of Procurement</div>
              <div className="col-span-6 px-0.5">{acf.project_type_of_procurement || '—'}</div>
              <div className="col-span-3">Size</div>
              <div className="col-span-6 px-0.5">{acf.project_size ? `${acf.project_size} m²` : '—'}</div>
              <div className="col-span-3">Team</div>
              <div className="col-span-6 px-0.5">{acf.project_team || '—'}</div>
            </div>
          </div>

          {/* Project Description */}
          <div className="col-span-8 md:col-span-8 project-description">
            {acf.project_description ? (
              <div dangerouslySetInnerHTML={{ __html: acf.project_description }} />
            ) : (
              <span>&mdash;</span>
            )}
          </div>
        </div>
      </div>

      {/* Custom cursor text */}
      <div id="cursor-text" className="cursor-text"></div>
    </section>
  );
};

export default ProjectPage;
