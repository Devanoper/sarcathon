"use client"
import { Accordion, AccordionItem } from "@nextui-org/react";

export default function FAQ() {
  return (
    <div className="py-10 px-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Frequently Asked Questions</h1>

      <Accordion>
        <AccordionItem
          key="1"
          title="What is the process for admission into Saras AI Institute?"
        >
          The admission process at Saras AI Institute typically involves submitting the online application form along with necessary details, followed by a quick pre-Enrollment assessment to evaluate your candidature based on your personal traits and basic communication skills in English.
        </AccordionItem>

        <AccordionItem
          key="2"
          title="What is the curriculum like at Saras AI Institute?"
        >
          The curriculum at Saras AI Institute helps impart essential technical as well as human skills. We have designed a role-based curriculum that prepares students for one of these in-demand roles: AI/ML Engineer; Data Scientist; Gen AI Engineer. The curriculum is designed to provide a comprehensive understanding of AI principles and practices, including hands-on projects and real-world applications.
        </AccordionItem>

        <AccordionItem
          key="3"
          title="Is Saras AI Institute accredited?"
        >
          No, we are not accredited yet. This is our first Enrollment cycle and there is a minimum period before an institute can get accredited. However, we do follow the highest standards in terms of the curriculum and pedagogy for our students to become the top AI professionals
        </AccordionItem>

        <AccordionItem
          key="4"
          title="Does Saras AI Institute offer any scholarships for students? How can I apply for them? "
        >
          Yes, we offer various scholarships to eligible students based on academic merit, financial need, and other criteria. You can apply for scholarships after you're offered admission. Go ahead with filling out the application to check your eligibility.
        </AccordionItem>
      </Accordion>
    </div>
  );
}
