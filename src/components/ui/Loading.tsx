import {
  loadingAnimation,
  loadingContent,
  loadingVariants,
} from '../../styles/components/Loading.css';
import { TextBox } from './TextBox';

type LoadingProps = {
  size?: 'sm' | 'lg';
  variant?: keyof typeof loadingVariants;
};

export const Loading = ({ size, variant }: LoadingProps) => (
  <div className={loadingVariants[variant || 'base']}>
    <div className={loadingContent}>
      <TextBox
        className={loadingAnimation}
        fontSize={size === 'lg' ? '200' : '100'}
        fontWeight="400"
      >
        {size === 'lg' ? 'Loading...' : '...'}
      </TextBox>
    </div>
  </div>
);
