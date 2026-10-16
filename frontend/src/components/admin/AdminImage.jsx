import Image from 'next/image';

const passthroughLoader = ({ src }) => src;

const AdminImage = ({ alt = '', width = 200, height = 200, style, ...props }) => (
  <Image
    {...props}
    alt={alt}
    loader={passthroughLoader}
    unoptimized
    width={width}
    height={height}
    style={{ display: 'block', ...style }}
  />
);

export default AdminImage;
