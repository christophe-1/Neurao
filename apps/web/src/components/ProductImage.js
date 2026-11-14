import Image from 'next/image'

/** Product photo inside a soft frame, or a "Photo à venir" frame when there is no photo. */
export default function ProductImage({ src, alt, size }) {
  return (
    <div className="product-image-frame">
      {src ? (
        <Image src={src} alt={alt} width={size} height={size} className="product-image" />
      ) : (
        <p className="product-image-placeholder" aria-hidden="true">
          Photo à venir
        </p>
      )}
    </div>
  )
}
