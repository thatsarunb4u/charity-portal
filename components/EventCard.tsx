import { Card, CardContent } from "@/components/ui/card";

type Props = {
  title: string;
  description: string;
  banner: string;
};

export default function EventCard({
  title,
  description,
  banner,
}: Props) {
  return (
    <Card className="overflow-hidden shadow-lg">
      <img
        src={banner}
        alt={title}
        className="h-72 w-full object-cover"
      />

      <CardContent className="space-y-4 p-6">
        <h1 className="text-4xl font-bold">
          {title}
        </h1>

        <p className="text-slate-600">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}