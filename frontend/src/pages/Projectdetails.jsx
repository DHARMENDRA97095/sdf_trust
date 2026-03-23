import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const BASE_URL = "http://localhost/backend/admin/";

const makeImageUrl = (path) => {
  if (!path) {
    return "https://via.placeholder.com/1200x800?text=No+Image";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${BASE_URL}${path.replace(/^\/+/, "")}`;
};

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
        const response = await fetch(
          "http://localhost/backend/api/projects.php",
        );

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

        const imageUrl = makeImageUrl(foundProject.image_url);

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
    <div className="bg-bg-color min-h-screen pb-20">
      <section className="bg-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-block bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            {project.category}
          </div>

          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {project.title}
          </h1>

          <p className="text-xl max-w-2xl mx-auto flex items-center justify-center gap-2">
            <span>📍</span> {project.location}
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 -mt-10">
        <div className="relative h-96 md:h-125 rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-gray-200 mb-12">
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
              <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider ${project.status === 'active' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                {project.status || "active"}
              </span>
            </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 mb-12">
            <h2 className="text-3xl font-serif text-text-primary mb-6">
              About the Project
            </h2>

            <div className="prose prose-lg text-gray-600 max-w-none">
              {(project.description || "")
                .split("\n")
                .map((paragraph, index) => (
                  <p key={index} className="mb-4 leading-relaxed text-gray-600">
                    {paragraph}
                  </p>
                ))}
            </div>
        </div>

      </section>

      <section className="py-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium"
          >
            <span>←</span> Back to Ongoing Projects
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ProjectDetails;
