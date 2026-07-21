export type Product = {
  name: string;
  price: number;
};

/** Catalog seeded by My Demo App (BaseActivity.populateProductsDb). */
export const products = {
  backpack: { name: 'Sauce Labs Backpack', price: 29.99 },
  bikeLight: { name: 'Sauce Labs Bike Light', price: 9.99 },
  boltTShirt: { name: 'Sauce Labs Bolt T-Shirt', price: 15.99 },
  fleeceJacket: { name: 'Sauce Labs Fleece Jacket', price: 49.99 },
  onesie: { name: 'Sauce Labs Onesie', price: 7.99 },
  redTShirt: { name: 'Test.allTheThings() T-Shirt', price: 15.99 },
} as const satisfies Record<string, Product>;

export const deliveryFee = 5.99;

export const sortOptions = {
  nameAsc: 'Ascending order by name',
  nameDesc: 'Descending order by name',
  priceAsc: 'Ascending order by price',
  priceDesc: 'Descending order by price',
} as const;

export type SortOption = (typeof sortOptions)[keyof typeof sortOptions];
