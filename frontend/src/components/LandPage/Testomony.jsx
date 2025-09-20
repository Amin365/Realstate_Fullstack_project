import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Testimonials() {
    return (
        <section className="py-16 md:py-32">
            <div className="mx-auto max-w-6xl space-y-8 px-6 md:space-y-16">
                {/* Section Heading */}
                <div className="relative z-10 mx-auto max-w-xl space-y-6 text-center md:space-y-12">
                    <h2 className="text-4xl font-medium lg:text-5xl">
                        Trusted by Homeowners & Investors
                    </h2>
                    <p>
                        Our clients love the transparency, professionalism, and seamless process we provide when buying, selling, or renting properties. Here’s what they have to say.
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-rows-2">
                    
                    {/* Big Testimonial */}
                    <Card className="grid grid-rows-[auto_1fr] gap-8 sm:col-span-2 sm:p-6 lg:row-span-2">
                        <CardHeader>
                           
                        </CardHeader>
                        <CardContent>
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    “Finding my dream home was so easy with RealState Pro. 
                                    The team guided me through every step and I felt supported 
                                    from start to finish. Highly recommended!”
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://randomuser.me/api/portraits/women/45.jpg"
                                            alt="Sarah Johnson"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>SJ</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Sarah Johnson</cite>
                                        <span className="text-muted-foreground block text-sm">First-time Homebuyer</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Testimonial 2 */}
                    <Card className="md:col-span-2">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p className="text-xl font-medium">
                                    “As a property investor, I appreciate the detailed listings 
                                    and smooth process. The transparency in pricing and paperwork 
                                    makes this my go-to platform.”
                                </p>

                                <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://randomuser.me/api/portraits/men/32.jpg"
                                            alt="Michael Lee"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>ML</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Michael Lee</cite>
                                        <span className="text-muted-foreground block text-sm">Property Investor</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Testimonial 3 */}
                    <Card>
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>
                                    “The rental process was stress-free. I found the perfect 
                                    apartment within a week and the support team was always available.”
                                </p>

                                <div className="grid items-center gap-3 [grid-template-columns:auto_1fr]">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://randomuser.me/api/portraits/women/68.jpg"
                                            alt="Emily Davis"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>ED</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <cite className="text-sm font-medium">Emily Davis</cite>
                                        <span className="text-muted-foreground block text-sm">Tenant</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>

                    {/* Testimonial 4 */}
                    <Card className="card variant-mixed">
                        <CardContent className="h-full pt-6">
                            <blockquote className="grid h-full grid-rows-[1fr_auto] gap-6">
                                <p>
                                    “Selling my property was fast and smooth. The platform’s 
                                    visibility brought multiple buyers quickly. Excellent service!”
                                </p>

                                <div className="grid grid-cols-[auto_1fr] gap-3">
                                    <Avatar className="size-12">
                                        <AvatarImage
                                            src="https://randomuser.me/api/portraits/men/75.jpg"
                                            alt="David Martinez"
                                            loading="lazy"
                                        />
                                        <AvatarFallback>DM</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-sm font-medium">David Martinez</p>
                                        <span className="text-muted-foreground block text-sm">Home Seller</span>
                                    </div>
                                </div>
                            </blockquote>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
}
