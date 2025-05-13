import Image from 'next/image';

type Props = {
  size?: number;
};

const LoadingLogo = ({ size = 100 }: Props) => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        src="/logo.svg"
        alt="logo"
        width={size}
        height={size}
        className="animate-pulse duration-700"
      />
    </div>
  );
};

export default LoadingLogo;
