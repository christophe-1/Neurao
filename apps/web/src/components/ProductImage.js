import Image from 'next/image'

/** Product photo on a tile of the colour of its range, or the neuraO logo when there is no photo. */
export default function ProductImage({ src, alt, size, color }) {
  return (
    <div className={`product-image-frame tile-${color}`}>
      {src ? (
        <Image src={src} alt={alt} width={size} height={size} className="product-image" />
      ) : (
        <Image
          src="/images/logo-neurao.svg"
          alt=""
          width={96}
          height={96}
          className="product-image-placeholder"
        />
      )}
    </div>
  )
}
