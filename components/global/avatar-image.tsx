import Image from 'next/image';

type AvatarImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export default function AvatarImage({ src, alt, className }: AvatarImageProps) {
  return (
    <div className="relative w-full h-full">
      <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} className={className} />
    </div>
  );
}
