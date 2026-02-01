
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/Button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    toast.success("Your message has been sent! We'll get back to you soon.");
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-20">
        <section className="px-6 md:px-12 lg:px-24 bg-[#0A0A14]">
          <div className="max-w-7xl mx-auto">
            <SectionHeading
              title="Contact Us"
              subtitle="Get in touch with our team. We're here to help with any questions about our product."
              centered={true}
            />
            
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-[#171723] rounded-xl border border-[#2A2A3C] p-6 space-y-8">
                  <h3 className="text-xl font-semibold text-white">Contact Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cipher-purple/10 flex items-center justify-center">
                        <Mail className="h-5 w-5 text-cipher-purple" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Email</h4>
                        <p className="text-white">support@cipherguard.com</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cipher-blue/10 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-cipher-blue" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Phone</h4>
                        <p className="text-white">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cipher-purple/10 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-cipher-purple" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Office</h4>
                        <p className="text-white">123 Security Street</p>
                        <p className="text-white">San Francisco, CA 94103</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-cipher-blue/10 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-cipher-blue" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-400">Working Hours</h4>
                        <p className="text-white">Monday - Friday: 9am - 5pm</p>
                        <p className="text-white">Weekend: Closed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="bg-[#171723] rounded-xl border border-[#2A2A3C] p-6">
                  <h3 className="text-xl font-semibold text-white mb-6">Send Us a Message</h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#11111D] border border-[#2A2A3C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cipher-purple"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-[#11111D] border border-[#2A2A3C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cipher-purple"
                          placeholder="Your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-[#11111D] border border-[#2A2A3C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cipher-purple"
                        placeholder="How can we help you?"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 bg-[#11111D] border border-[#2A2A3C] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cipher-purple resize-none"
                        placeholder="Tell us more about your inquiry..."
                      ></textarea>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button variant="blue" type="submit">Send Message</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;
