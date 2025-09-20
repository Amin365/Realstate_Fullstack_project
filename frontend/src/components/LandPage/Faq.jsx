


import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Link } from 'react-router'

export default function RealEstateFAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How do I schedule a property viewing?',
            answer: 'You can schedule a property viewing by contacting our agent directly through the listing page or by calling our office. We recommend booking at least 24 hours in advance.',
        },
        {
            id: 'item-2',
            question: 'Do I need to pay a fee to view properties?',
            answer: 'No, property viewings are completely free of charge. Our goal is to help you find the right home without any upfront costs.',
        },
        {
            id: 'item-3',
            question: 'Can you help me with mortgage or financing options?',
            answer: 'Yes, we work closely with trusted banks and mortgage providers. Our team can guide you through financing options to make your purchase smoother.',
        },
        {
            id: 'item-4',
            question: 'Are the property prices negotiable?',
            answer: 'In most cases, property prices are open to negotiation. Our agents will help you submit the best offer to the seller.',
        },
        {
            id: 'item-5',
            question: 'What documents are required to buy a property?',
            answer: 'You will need a valid ID, proof of income, and in some cases, a pre-approval letter from your bank. Our legal team will assist you throughout the process.',
        },
    ]

    return (
        <section className="py-16 md:py-24">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Real Estate FAQs</h2>
                    <p className="text-muted-foreground mt-4 text-balance">
                        Find answers to the most common questions about buying, selling, and renting properties with us.
                    </p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0">
                        {faqItems.map((item) => (
                            <AccordionItem
                                key={item.id}
                                value={item.id}
                                className="border-dashed">
                                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <p className="text-base">{item.answer}</p>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        Still have questions? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            real estate support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
