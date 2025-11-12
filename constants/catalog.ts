export const CATEGORY_OPTIONS = [
  'Clothes',
  'Electronics',
  'Furniture',
  'Sports',
  'Kitchen',
  'Other',
] as const;

export type Category = (typeof CATEGORY_OPTIONS)[number];

export const SUBCATEGORY_OPTIONS: Record<Category | 'Other', string[]> = {
  Clothes: ['T-Shirt', 'Jacket', 'Jeans', 'Shoes', 'Accessories'],
  Electronics: ['Laptop', 'Phone', 'Tablet', 'TV', 'Kitchen appliance'],
  Furniture: ['Bed', 'Sofa', 'Chair', 'Desk', 'Storage'],
  Sports: ['Cricket Bat', 'Football', 'Yoga Mat', 'Bicycle', 'Shoes'],
  Kitchen: ['Cookware', 'Dinnerware', 'Small appliance', 'Storage', 'Utensils'],
  Other: ['Miscellaneous'],
};

export const DELIVERY_TYPES = [
  { label: 'Pick-up', value: 'PickUp' },
  { label: 'Delivery', value: 'Delivery' },
] as const;

export type DeliveryType = (typeof DELIVERY_TYPES)[number]['value'];
