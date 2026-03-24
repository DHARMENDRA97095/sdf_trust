import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { apiFetch, makeImageUrl } from "../config";

const ProjectDetails = () => {
  const { slug } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await apiFetch("projects.php");

        if (!response.ok) {
          throw new Error("Failed to fetch project details");
        }

        const data = await response.json();

        if (data.status !== "success") {
          throw new Error(data.message || "Could not load project data");
        }

        const foundProject = data.data.find((item) => item.slug === slug);

        if (!foundProject) {
          throw new Error("Project not found");
        }

        const imageUrl = makeImageUrl(
          foundProject.image_url,
          "https://via.placeholder.com/1200x800?text=No+Image",
        );

        setProject({
          ...foundProject,
          image_url: imageUrl,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color">
        <div className="text-xl font-bold text-primary animate-pulse">
          Loading project details...
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-color px-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-3 text-red-500">
            Project not found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || "The project you are looking for does not exist."}
          </p>
          <Link
            to="/projects"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-[#5a6425] transition-colors"
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg-color min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-primary text-white pt-20 pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
            {project.category}
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 max-w-4xl mx-auto leading-tight">
            {project.title}
          </h1>

          <p className="text-lg md:text-xl max-w-2xl mx-auto flex items-center justify-center gap-2 text-green-50">
            <span>📍</span> {project.location}
          </p>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN: Main Project Details (Takes up 2/3 width) */}
          <div className="lg:w-2/3 flex flex-col gap-8">
            
            {/* Project Hero Image */}
            <div className="relative h-80 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-gray-200">
              <img
                src={project.image_url}
                alt={`${project.title}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://via.placeholder.com/1200x800?text=Image+Not+Found";
                }}
              />
              <div className="absolute top-4 left-4 z-10">
                <span className={`text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md ${
                    project.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}>
                  Status: {project.status || "active"}
                </span>
              </div>
            </div>
            
            {/* About The Project Content */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
              <h2 className="text-3xl font-serif text-text-primary mb-6 flex items-center gap-3">
                <span className="text-primary text-2xl">⚡</span> About the Project
              </h2>

              <div className="prose prose-lg text-gray-600 max-w-none">
                {(project.description || "")
                  .split("\n")
                  .map((paragraph, index) => (
                    <p key={index} className="mb-5 leading-relaxed text-gray-600">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Takes up 1/3 width) */}
          <div className="lg:w-1/3">
            {/* Sticky container makes the sidebar follow the user down the page */}
            <div className="sticky top-28 flex flex-col gap-6">
              
              {/* Quick Facts Widget */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <h3 className="text-xl font-serif font-bold text-text-primary border-b border-gray-100 pb-4 mb-6">
                  Project Overview
                </h3>
                
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0 text-lg">
                      📍
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Location</p>
                      <p className="font-medium text-gray-800">{project.location}</p>
                    </div>
                  </li>
                  
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0 text-lg">
                      🏷️
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Category</p>
                      <p className="font-medium text-gray-800">{project.category}</p>
                    </div>
                  </li>

                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 text-lg">
                      📊
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-0.5">Current Status</p>
                      <p className="font-medium text-gray-800 capitalize">{project.status || "Active"}</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Call to Action Widget */}
              <div className="bg-[#233520] rounded-2xl shadow-lg p-8 text-center relative overflow-hidden">
                {/* Background decorative circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white opacity-5 rounded-full blur-2xl"></div>
                
                <span className="text-4xl block mb-4">🤝</span>
                <h3 className="text-2xl font-serif font-bold text-white mb-3">Support Our Cause</h3>
                <p className="text-sm text-green-100 mb-8 opacity-90 leading-relaxed">
                  Your contribution helps us expand projects like this and reach more beneficiaries in need.
                </p>
                
                <Link
                  to="/donate"
                  className="block w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3.5 px-4 rounded-xl shadow-md transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  Donate to this Initiative
                </Link>
                <Link
                  to="/get-involved"
                  className="block w-full text-white font-medium py-3 mt-3 hover:text-yellow-400 transition-colors text-sm"
                >
                  Or become a volunteer →
                </Link>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Back Navigation */}
      <section className="py-16 mt-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold tracking-wide"
          >
            <span className="text-xl">←</span> Return to Ongoing Projects
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;