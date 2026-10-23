import { expect } from "@wdio/globals";
import { CATALOG } from "../../constants/testData";
import galleryPage from "../../pages/galleryPage";
import { loginAsShopper } from "../../utils/auth";

describe("Product gallery — regression", () => {
  const hoodie = CATALOG.find((p) => p.name.toLowerCase().includes("hoodie"))!.name;
  const sortedApparelNames = [...CATALOG]
    .filter((p) => p.category === "Apparel")
    .map((p) => p.name)
    .sort();

  beforeEach(async () => {
    await loginAsShopper();
  });

  it("TC-GALLERY-05: Search combined with a category filter should return only matching products", async () => {
    await galleryPage.actions.search("hood");
    await galleryPage.actions.selectCategory("Apparel");

    expect(await galleryPage.actions.getProductNames()).toEqual([hoodie]);
  });

  it("TC-GALLERY-06: Search combined with a sort option should return matching products in order", async () => {
    await galleryPage.actions.search("apparel");
    await galleryPage.actions.selectSort("name-az");

    expect(await galleryPage.actions.getProductNames()).toEqual(sortedApparelNames);
  });

  it("TC-GALLERY-07: Category filter combined with a sort option should return the category's products in order", async () => {
    await galleryPage.actions.selectCategory("Apparel");
    await galleryPage.actions.selectSort("name-az");

    expect(await galleryPage.actions.getProductNames()).toEqual(sortedApparelNames);
  });

  it("TC-GALLERY-08: Search, category, and sort combined should return only matching products in order", async () => {
    await galleryPage.actions.search("hood");
    await galleryPage.actions.selectCategory("Apparel");
    await galleryPage.actions.selectSort("name-az");

    expect(await galleryPage.actions.getProductNames()).toEqual([hoodie]);
  });

  it("TC-GALLERY-09: Search with no matches should show an empty state that Clear filters restores", async () => {
    await galleryPage.actions.search("zzzz");

    expect(await galleryPage.actions.getProductCount()).toBe(0);
    await expect(galleryPage.elements.clearFiltersButton()).toBeDisplayed();

    await galleryPage.actions.clearFilters();
    expect(await galleryPage.actions.getProductCount()).toBe(CATALOG.length);
  });
});
