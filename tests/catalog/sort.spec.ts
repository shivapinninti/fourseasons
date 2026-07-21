import { pages } from '../../src/pages';
import { sortOptions } from '../../src/data/products';
import { resetApp } from '../../src/utils/flows';

describe('Catalog — Sorting @catalog', () => {
  beforeEach(async () => {
    await resetApp();
    await pages.catalog.expectLoaded();
  });

  it('sort by name A to Z @catalog', async () => {
    await pages.catalog.sortBy(sortOptions.nameAsc);
    const names = await pages.catalog.getVisibleProductNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);
  });

  it('sort by name Z to A @catalog', async () => {
    await pages.catalog.sortBy(sortOptions.nameDesc);
    const names = await pages.catalog.getVisibleProductNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  it('sort by price low to high @catalog', async () => {
    await pages.catalog.sortBy(sortOptions.priceAsc);
    const prices = await pages.catalog.getVisibleProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it('sort by price high to low @catalog', async () => {
    await pages.catalog.sortBy(sortOptions.priceDesc);
    const prices = await pages.catalog.getVisibleProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });
});
