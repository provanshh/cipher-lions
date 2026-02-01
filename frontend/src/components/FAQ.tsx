
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
}

export const FAQ = ({ faqs }: FAQProps) => {
  return (
    <Accordion 
      type="single" 
      collapsible 
      className="w-full bg-[#171723] rounded-xl border border-[#2A2A3C] overflow-hidden"
    >
      {faqs.map((faq, index) => (
        <AccordionItem 
          key={index} 
          value={`item-${index}`} 
          className="border-b border-[#2A2A3C] last:border-b-0"
        >
          <AccordionTrigger 
            className="text-left font-medium py-4 px-6 hover:bg-[#1E1E2C] text-white hover:text-cipher-purple transition-colors cursor-pointer w-full flex items-center justify-between"
          >
            {faq.question}
          </AccordionTrigger>
          <AccordionContent 
            className="text-gray-300 py-3 px-6 font-medium bg-[#11111D]"
          >
            {faq.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
