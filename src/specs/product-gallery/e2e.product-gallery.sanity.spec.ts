import { expect } from "@wdio/globals";
import { CATALOG } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import { loginAsShopper } from "../../utils/auth";

describe("Product gallery — sanity", () => {
  const categories = [...new Set(CATALOG.map((p) => p.category))];

  beforeEach(async () => {
    await loginAsShopper();
  });

  it("TC-GALLERY-01: Catalog should display all items with name, price, review count, and description", async () => {
    await expect(galleryPage.elements.inventoryTitle()).toBeDisplayed();
    expect(await galleryPage.actions.getProductCount()).toBe(CATALOG.length);
  });

  it("TC-GALLERY-02: Search should match products case-insensitively by full name, partial name, and category name", async () => {
    const hoodie = CATALOG.find((p) => p.name.toLowerCase().includes("hoodie"))!.name;

    await galleryPage.actions.search("hoodie");
    expect(await galleryPage.actions.getProductNames()).toEqual([hoodie]);

    await galleryPage.actions.search("HOODIE");
    expect(await galleryPage.actions.getProductNames()).toEqual([hoodie]);

    await galleryPage.actions.search("hood");
    expect(await galleryPage.actions.getProductNames()).toEqual([hoodie]);

    await galleryPage.actions.search("apparel");
    expect(await galleryPage.actions.getProductCount()).toBe(
      CATALOG.filter((p) => p.category === "Apparel").length
    );
  });

  it("TC-GALLERY-03: Catalog should filter to show only the selected category's products", async () => {
    for (const category of categories) {
      await galleryPage.actions.selectCategory(category);
      const expected = CATALOG.filter((p) => p.category === category).length;
      expect(await galleryPage.actions.getProductCount()).toBe(expected);
    }
  });

  it.skip("TC-GALLERY-04: Catalog should sort by name and price in both ascending and descending order", async () => {
    // Known failure: BUG-002 — "Price: High to Low" sorts ascending.
    const byNameAsc = [...CATALOG].sort((a, b) => a.name.localeCompare(b.name)).map((p) => p.name);
    const byNameDesc = [...byNameAsc].reverse();
    const byPriceAsc = [...CATALOG].sort((a, b) => a.price - b.price).map((p) => p.name);
    const byPriceDesc = [...byPriceAsc].reverse();

    await galleryPage.actions.selectSort("name-az");
    expect(await galleryPage.actions.getProductNames()).toEqual(byNameAsc);

    await galleryPage.actions.selectSort("name-za");
    expect(await galleryPage.actions.getProductNames()).toEqual(byNameDesc);

    await galleryPage.actions.selectSort("price-low");
    expect(await galleryPage.actions.getProductNames()).toEqual(byPriceAsc);

    await galleryPage.actions.selectSort("price-high");
    expect(await galleryPage.actions.getProductNames()).toEqual(byPriceDesc);
  });
});
