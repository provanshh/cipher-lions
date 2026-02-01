
import { Quote } from "lucide-react";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  image?: string;
}

export const Testimonial = ({ quote, author, role, image }: TestimonialProps) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
      <Quote className="h-8 w-8 text-cipher-purple/20 mb-4" />
      <p className="text-cipher-gray-dark mb-6 text-lg italic">{quote}</p>
      <div className="flex items-center">
        {image ? (
          <img src={image} alt={author} className="h-12 w-12 rounded-full mr-4 object-cover" />
        ) : (
          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            <span className="text-gray-500 font-medium">{author.charAt(0)}</span>
          </div>
        )}
        <div>
          <h4 className="font-semibold">{author}</h4>
          <p className="text-sm text-cipher-gray">{role}</p>
        </div>
      </div>
    </div>
  );
};
