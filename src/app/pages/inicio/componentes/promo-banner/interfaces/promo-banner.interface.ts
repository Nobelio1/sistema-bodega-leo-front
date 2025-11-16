export interface BannerItem {
  id: number;
  type: 'discount' | 'price';
  title: string;
  subtitle?: string;
  value?: string;
  regularPrice?: string;
  image: string;
}
