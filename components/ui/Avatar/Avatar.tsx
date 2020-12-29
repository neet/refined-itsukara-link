import classNames from 'classnames';

type Variant = 'minimal' | 'flat';
type Size = 'sm' | 'md' | 'lg';

const mapSize = (size: Size): string => {
  switch (size) {
    case 'sm':
      return classNames('h-10', 'w-10');
    case 'md':
      return classNames('h-10', 'w-10');
    case 'lg':
      return classNames('h-16', 'w-16');
  }
};

const avatarClass = (variant: Variant, size: Size, className = ''): string =>
  classNames(
    mapSize(size),
    'rounded-full',
    'bg-coolGray-200',
    'dark:bg-trueGray-800',
    'animate-pulse',
    variant === 'flat' && [
      'border',
      'border-coolGray-300',
      'dark:border-trueGray-700',
    ],
    className,
  );

export type AvatarProps = Readonly<JSX.IntrinsicElements['img']> & {
  readonly size: Size;
  readonly variant: Variant;
  readonly pending: boolean;
};

export const Avatar = (props: AvatarProps): JSX.Element => {
  const { alt, variant, size, className, pending, ...rest } = props;

  if (pending) {
    return <div className={avatarClass(variant, size, className)} />;
  }

  return (
    <img
      className={avatarClass(variant, size, className)}
      alt={alt}
      {...rest}
    />
  );
};

Avatar.defaultProps = {
  size: 'md',
  variant: 'flat',
  pending: false,
};
