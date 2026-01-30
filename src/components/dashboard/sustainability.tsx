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
    <div className="w-full space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Sustainability</h2>
          <p className="text-muted-foreground">
            Learn sustainable practices and track your green achievements
          </p>
        </div>
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600/80 shadow-lg shadow-emerald-500/20">
          <Sprout className="h-5 w-5 text-white" />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
            <Card className="border-0 shadow-md">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  Sustainability Resources
                </CardTitle>
                <CardDescription>
                    Explore articles, guides, and best practices to make your farm more sustainable and efficient
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {resources.map((resource, index) => (
                            <div key={index} className="p-4 border border-muted rounded-xl hover:bg-muted/50 hover:shadow-sm transition-all duration-300">
                                <h4 className="font-semibold">{resource.title}</h4>
                                <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>

        <div>
            <Card className="sticky top-24 border-0 shadow-md">
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Medal className="h-5 w-5 text-amber-500" />
                  Your Badges
                </CardTitle>
                <CardDescription>
                    Earn rewards for your contributions to reducing food waste and helping the community
                </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-6">
                    {badges.map((badge, index) => (
                    <div key={index} className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className={`p-2 rounded-xl ${
                          badge.color === 'text-amber-500' ? 'bg-amber-100 dark:bg-amber-900/30' :
                          badge.color === 'text-blue-500' ? 'bg-blue-100 dark:bg-blue-900/30' :
                          badge.color === 'text-green-500' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                          'bg-violet-100 dark:bg-violet-900/30'
                        }`}>
                          <badge.icon className={`h-6 w-6 ${badge.color}`} />
                        </div>
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
    </div>
  );
}
