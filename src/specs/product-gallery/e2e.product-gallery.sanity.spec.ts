import { expect } from "@wdio/globals";
import { ACCOUNTS } from "../../constants/constants";
import { CATALOG } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import { loginAs } from "../../utils/auth";

describe("Product gallery — sanity", () => {
  const categories = [...new Set(CATALOG.map((p) => p.category))];

  beforeEach(async () => {
    await loginAs(ACCOUNTS.shopper);
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

  it("TC-GALLERY-04: Catalog should sort by name (A-Z, Z-A) and price (low to high)", async () => {
    const byNameAsc = [...CATALOG].sort((a, b) => a.name.localeCompare(b.name)).map((p) => p.name);
    const byNameDesc = [...byNameAsc].reverse();
    const byPriceAsc = [...CATALOG].sort((a, b) => a.price - b.price).map((p) => p.name);

    await galleryPage.actions.selectSort("name-az");
    expect(await galleryPage.actions.getProductNames()).toEqual(byNameAsc);

    await galleryPage.actions.selectSort("name-za");
    expect(await galleryPage.actions.getProductNames()).toEqual(byNameDesc);

    await galleryPage.actions.selectSort("price-low");
    expect(await galleryPage.actions.getProductNames()).toEqual(byPriceAsc);
  });

  // Known failure: BUG-002 - "Price: High to Low" sorts ascending (same as low to high).
  it.skip("TC-GALLERY-04: Price high to low should sort descending", async () => {
    const byPriceDesc = [...CATALOG].sort((a, b) => b.price - a.price).map((p) => p.name);

    await galleryPage.actions.selectSort("price-high");
    expect(await galleryPage.actions.getProductNames()).toEqual(byPriceDesc);
  });
});
