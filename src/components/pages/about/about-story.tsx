import { ProductImage } from "@/components/product/product-image";
import { cn } from "@/lib/utils";

interface StoryBlockProps {
  eyebrow: string;
  title: React.ReactNode;
  paragraphs: string[];
  image?: string;
  /** Puts the image on the right on large screens. */
  reverse?: boolean;
  /** Short caption shown over the image. */
  caption?: string;
}

/** Image + text section of the About page. */
export function StoryBlock({
  eyebrow,
  title,
  paragraphs,
  image,
  reverse,
  caption,
}: StoryBlockProps) {
  return (
    <section className="container-page py-16 sm:py-24">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        {image && (
          <div className={cn("relative", reverse && "lg:order-last")}>
            <ProductImage
              src={image}
              alt=""
              sizes="(min-width: 1280px) 600px, (min-width: 1024px) 50vw, 100vw"
              className="rounded-2xl"
              imageClassName="p-10 sm:p-16"
            />
            {caption && (
              <p className="absolute bottom-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-medium backdrop-blur">
                {caption}
              </p>
            )}
          </div>
        )}
        <div className="flex flex-col gap-6">
          <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h2 className="font-display text-4xl leading-none tracking-tight text-balance sm:text-5xl">
            {title}
          </h2>
          <div className="flex max-w-xl flex-col gap-4 text-pretty text-muted-foreground">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
