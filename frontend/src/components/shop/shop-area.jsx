import React, { useState } from "react";
import { useRouter } from "next/router";
import Pagination from "@/ui/Pagination";
import ProductItem from "../products/fashion/product-item";
import ProductItemMobile from "../products/fashion/product-item-mobile";
import CategoryFilter from "./shop-filter/category-filter";
import PriceFilter from "./shop-filter/price-filter";
import StatusFilter from "./shop-filter/status-filter";
import TopRatedProducts from "./shop-filter/top-rated-products";
import ShopListItem from "./shop-list-item";
import ShopTopLeft from "./shop-top-left";
import ShopTopRight from "./shop-top-right";
import ResetButton from "./shop-filter/reset-button";
import MobileFilterChips from "./mobile-filter-chips";

const ShopArea = ({ all_products, products, otherProps }) => {
  const {priceFilterValues,selectHandleFilter,currPage,setCurrPage} = otherProps;
  const router = useRouter();
  const { query } = router;
  const [filteredRows, setFilteredRows] = useState(products);
  const [pageStart, setPageStart] = useState(0);
  const [countOfPage, setCountOfPage] = useState(12);

  const paginatedData = (items, startPage, pageCount) => {
    setFilteredRows(items);
    setPageStart(startPage);
    setCountOfPage(pageCount);
  };

  // max price
  const maxPrice = all_products.reduce((max, product) => {
    return product.price > max ? product.price : max;
  }, 0);

  // Count active filters from URL query
  const countActiveFilters = () => {
    let count = 0;
    if (query.category) count++;
    if (query.subCategory) count++;
    if (query.status) count++;
    if (query.minPrice || query.maxPrice) count++;
    return count;
  };


  return (
    <>
      <section className="tp-shop-area pb-120" style={{ paddingTop: 'clamp(100px, 15vw, 150px)' }}>
        <div className="container">
          <div className="row">
            {/* Desktop Sidebar - Hidden on Mobile */}
            <div className="col-xl-3 col-lg-4 tp-shop-sidebar-desktop">
              <div className="tp-shop-sidebar mr-10">
                {/* filter */}
                <PriceFilter
                  priceFilterValues={priceFilterValues}
                  maxPrice={maxPrice}
                />
                {/* status */}
                <StatusFilter setCurrPage={setCurrPage} />
                {/* categories */}
                <CategoryFilter setCurrPage={setCurrPage} />
                {/* product rating */}
                <TopRatedProducts />
                {/* reset filter */}
                <ResetButton/>
              </div>
            </div>
            <div className="col-xl-9 col-lg-8">
              <div className="tp-shop-main-wrapper">
                {/* Desktop Top Bar - Hidden on Mobile */}
                <div className="tp-shop-top mb-45 tp-shop-top-desktop">
                  <div className="row">
                    <div className="col-xl-6">
                      <ShopTopLeft
                        showing={
                          products.length === 0
                            ? 0
                            : filteredRows.slice(
                                pageStart,
                                pageStart + countOfPage
                              ).length
                        }
                        total={all_products.length}
                      />
                    </div>
                    <div className="col-xl-6">
                      <ShopTopRight selectHandleFilter={selectHandleFilter} />
                    </div>
                  </div>
                </div>

                {/* Mobile Filter Chips */}
                <MobileFilterChips />

                {products.length === 0 && <h2>No products found</h2>}
                {products.length > 0 && (
                  <div className="tp-shop-items-wrapper tp-shop-item-primary">
                    <div className="tab-content" id="productTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="grid-tab-pane"
                        role="tabpanel"
                        aria-labelledby="grid-tab"
                        tabIndex="0"
                      >
                        {/* Desktop Grid */}
                        <div className="row tp-shop-grid-desktop">
                          {filteredRows
                            .slice(pageStart, pageStart + countOfPage)
                            .map((item) => (
                              <div
                                key={item._id}
                                className="col-xl-4 col-md-6 col-sm-6"
                              >
                                <ProductItem product={item} />
                              </div>
                            ))}
                        </div>

                        {/* Mobile Grid - 2 columns */}
                        <div className="tp-shop-grid-mobile">
                          {filteredRows
                            .slice(pageStart, pageStart + countOfPage)
                            .map((item) => (
                              <ProductItemMobile key={item._id} product={item} />
                            ))}
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="list-tab-pane"
                        role="tabpanel"
                        aria-labelledby="list-tab"
                        tabIndex="0"
                      >
                        <div className="tp-shop-list-wrapper tp-shop-item-primary mb-70">
                          <div className="row">
                            <div className="col-xl-12">
                              {filteredRows
                                .slice(pageStart, pageStart + countOfPage)
                                .map((item) => (
                                  <ShopListItem key={item._id} product={item} />
                                ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {products.length > 0 && (
                  <div className="tp-shop-pagination mt-20">
                    <div className="tp-pagination">
                      <Pagination
                        items={products}
                        countOfPage={12}
                        paginatedData={paginatedData}
                        currPage={currPage}
                        setCurrPage={setCurrPage}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default ShopArea;
