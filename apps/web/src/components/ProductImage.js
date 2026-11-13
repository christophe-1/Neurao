import Image from 'next/image'

export default function ProductImage({ src, alt, size }) {
  if (!src) {
    return (
      <div className="product-image product-image-placeholder" aria-hidden="true">
        Photo à venir
      </div>
    )
  }

  return <Image src={src} alt={alt} width={size} height={size} className="product-image" />
}
