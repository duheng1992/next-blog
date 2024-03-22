import Image from 'next/image'

export function ImageFallback({ src, ...rest }) {
  return (
    <Image
      src={src}
      alt=""
      className="h-auto max-w-[60%] aspect-auto rounded-2xl hover:shadow-xl"
      {...rest}
    />
  )
}
