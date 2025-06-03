import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../components/Reusable/ReusableTable";
import Pagination from "../../components/Reusable/Pagination";
import NoDataFound from "../../components/Reusable/NoDataFound";
import Button from "../../components/Reusable/Button";

const PAGE_SIZE = 5;
const BASE_URL = "https://craft-cart-backend.vercel.app";

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
          `${BASE_URL}/api/admin/protect?search=${encodeURIComponent(
            searchTerm
          )}&page=${page}&limit=${PAGE_SIZE}`
        );
        const data = await res.json();

        if (data.success) {
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

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.productId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: "P.I.", accessor: "productId" },
    { header: "Name", accessor: "name" },
    { header: "Category", accessor: "category" },
    {
      header: "Price",
      accessor: "price",
      render: (row) => `${row.price}`,
    },
    { header: "Stock", accessor: "stock" },
  ];

  return (
    <div className=" bg-gray-50 dark:bg-gray-900 ">
      <h2 className="text-sm  font-semibold mb-2  text-gray-900 dark:text-gray-100 text-start sm:text-left">
        Product List
      </h2>

      {/* Search and Add Product */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <input
          type="text"
          placeholder="Search by name or P.I. number..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setPage(1);
          }}
          className="sm:p-1 border rounded w-full sm:max-w-xs
            text-gray-900 dark:text-gray-100
            bg-white dark:bg-gray-800
            border-gray-300 dark:border-gray-600
            placeholder-gray-500 dark:placeholder-gray-400
            transition-colors duration-300
            focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button onClick={() => navigate("/admin/products/new")}>
          Add Product
        </Button>
      </div>

      {loading && (
        <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
          Loading products...
        </div>
      )}

      {/* Table for medium+ screens */}
      <div className="hidden md:block border border-gray-300 dark:border-gray-600 rounded overflow-x-auto">
        {filteredProducts.length === 0 ? (
          <NoDataFound />
        ) : (
          <ReusableTable
            columns={columns}
            data={filteredProducts}
            onRowClick={(row) => navigate(`/admin/products/${row._id}`)}
          />
        )}
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

      {/* Pagination */}
      {products.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProductList;
