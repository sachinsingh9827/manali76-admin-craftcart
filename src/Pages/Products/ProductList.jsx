import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Reusable/Pagination";
import NoDataFound from "../../components/Reusable/NoDataFound";

const PAGE_SIZE = 5;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/admin/protect?search=${encodeURIComponent(
            searchTerm
          )}&page=${page}&limit=${PAGE_SIZE}`
        );
        const data = await res.json();

        if (data.success) {
          // data.data is array of products
          setProducts(data.data || []);
          setTotalPages(data.totalPages || 1);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setProducts([]);
        setTotalPages(1);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [searchTerm, page]);

  // Filter products client side for search by productId or name (optional,
  // but backend should ideally handle this)
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-2 sm:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100 text-center sm:text-left">
        Product List
      </h2>

      {/* Search & Add Product */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name or P.I. number..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="p-2 sm:p-3 border rounded w-full sm:max-w-xs
               text-gray-900 dark:text-gray-100
               bg-white dark:bg-gray-800
               border-gray-300 dark:border-gray-600
               placeholder-gray-500 dark:placeholder-gray-400
               transition-colors duration-300
               focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => navigate("/admin/products/new")}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors
               text-sm sm:text-base w-full sm:w-auto"
        >
          Add Product
        </button>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
          Loading products...
        </div>
      )}

      {/* Responsive Table + Card view fallback */}
      <div>
        {/* Table for medium+ screens */}
        <div className="hidden md:block overflow-x-auto border border-gray-300 dark:border-gray-600 rounded">
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                <th className="border border-gray-300 p-2 sm:p-3 text-left">
                  P.I.
                </th>
                <th className="border border-gray-300 p-2 sm:p-3 text-left">
                  Name
                </th>
                <th className="border border-gray-300 p-2 sm:p-3 text-left">
                  Category
                </th>
                <th className="border border-gray-300 p-2 sm:p-3 text-left">
                  Price
                </th>
                <th className="border border-gray-300 p-2 sm:p-3 text-left">
                  Stock
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-4 text-gray-700 dark:text-gray-300"
                  >
                    <NoDataFound />
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => navigate(`/admin/products/${product._id}`)}
                  >
                    <td className="border border-gray-300 p-2 sm:p-3">
                      {product.productId}
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3">
                      {product.name}
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3">
                      {product.category}
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3">
                      ${product.price}
                    </td>
                    <td className="border border-gray-300 p-2 sm:p-3">
                      {product.stock}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Card view for small screens */}
        <div className="md:hidden space-y-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center p-4 text-gray-700 dark:text-gray-300">
              <NoDataFound />
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                onClick={() => navigate(`/admin/products/${product._id}`)}
                className="cursor-pointer bg-white dark:bg-gray-800 p-4 rounded shadow border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    P.I.:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {product.productId}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Name:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {product.name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Category:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {product.category}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Price:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    ${product.price}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    Stock:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">
                    {product.stock}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {products.length === 0 ? (
        ""
      ) : (
        <>
          {/* Your product list rendering here */}
          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
            loading={loading}
          />
        </>
      )}
    </div>
  );
};

export default ProductList;
