import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Medal, Recycle, Sprout, Lightbulb } from "lucide-react";

const badges = [
  {
    icon: Medal,
    title: "Waste Warrior",
    description: "Achieved 95%+ crop utilization for a whole season.",
    color: "text-amber-500",
  },
  {
    icon: Recycle,
    title: "Donation Champion",
    description: "Donated over 500kg of surplus produce to NGOs.",
    color: "text-blue-500",
  },
  {
    icon: Sprout,
    title: "Eco-Pioneer",
    description: "Implemented 3+ new sustainable farming practices.",
    color: "text-green-500",
  },
  {
    icon: Lightbulb,
    title: "Community Advisor",
    description: "Shared valuable insights and tips with 10+ other farmers.",
    color: "text-purple-500",
  },
];

const resources = [
    { title: "Composting 101 for Unused Produce", description: "Learn how to turn non-edible waste into nutrient-rich compost for your fields." },
    { title: "Water Conservation Techniques", description: "Discover smart irrigation and water-saving methods to improve sustainability." },
    { title: "Integrated Pest Management (IPM)", description: "Reduce chemical use by adopting natural and biological pest control strategies." },
    { title: "Building Healthy Soil", description: "A guide to cover crops, crop rotation, and no-till farming for long-term soil health." },
]

export function Sustainability() {
  return (
    <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                <CardTitle>Sustainability Resources</CardTitle>
                <CardDescription>
                    Explore articles, guides, and best practices to make your farm more sustainable and efficient.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {resources.map((resource, index) => (
                            <div key={index} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                <h4 className="font-semibold">{resource.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div>
            <Card className="sticky top-24">
                <CardHeader>
                <CardTitle>Your Badges</CardTitle>
                <CardDescription>
                    Earn rewards for your contributions to reducing food waste and helping the community.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-6">
                    {badges.map((badge, index) => (
                    <div key={index} className="flex items-start gap-4">
                        <badge.icon className={`h-10 w-10 flex-shrink-0 ${badge.color}`} />
                        <div>
                        <h4 className="font-semibold">{badge.title}</h4>
                        <p className="text-sm text-muted-foreground">
                            {badge.description}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
