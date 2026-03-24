import { useEffect, useRef, useState } from "react";
import { apiFetch, makeImageUrl } from "../config";

function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const scrollRef = useRef();

  useEffect(() => {
    apiFetch("testimonial.php")
      .then((res) => res.json())
      .then((data) => setTestimonials(data))
      .catch((err) => console.error("Error loading stories:", err));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || testimonials.length === 0) return;

    let animationFrame;
    const speed = 0.5;

    const scroll = () => {
      container.scrollLeft += speed;
      if (
        container.scrollLeft + container.clientWidth >=
        container.scrollWidth
      ) {
        container.scrollLeft = 0;
      }
      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrame);
  }, [testimonials]);

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-serif mb-10">Stories of Impact</h2>
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide pb-8"
        >
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="min-w-75 bg-gray-100 p-6 rounded-2xl flex gap-4 text-left"
            >
              <img
                src={makeImageUrl(item.image, "https://via.placeholder.com/150")}
                className="w-16 h-16 rounded-full object-cover shrink-0"
                alt=""
              />
              <div>
                <p className="text-sm italic mb-2">&quot;{item.message}&quot;</p>
                <h4 className="font-bold text-sm">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
