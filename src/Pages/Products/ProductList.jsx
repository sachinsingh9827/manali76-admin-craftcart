import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReusableTable from "../../components/Reusable/ReusableTable";
import Pagination from "../../components/Reusable/Pagination";
import NoDataFound from "../../components/Reusable/NoDataFound";
import Button from "../../components/Reusable/Button";
import LoadingPage from "../../components/Navbar/LoadingPage";
import ProductFilter from "../../components/Reusable/ProductFilter";
import ImageModal from "../../components/Reusable/ImageModal";

const PAGE_SIZE = 5;
const BASE_URL = "https://craft-cart-backend.vercel.app";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${BASE_URL}/api/admin/protect?page=${page}&limit=${PAGE_SIZE}`
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
  }, [page]);

  const filteredProducts = products
    .filter((product) => {
      const term = searchTerm.toLowerCase();
      return (
        product.name?.toLowerCase().includes(term) ||
        product.productId?.toLowerCase().includes(term) ||
        product.category?.toLowerCase().includes(term) ||
        product.price?.toString().includes(term) ||
        product.stock?.toString().includes(term)
      );
    })
    .sort((a, b) => {
      if (sortOrder === "lowToHigh") return a.price - b.price;
      if (sortOrder === "highToLow") return b.price - a.price;
      return 0;
    });

  const columns = [
    {
      header: "Image",
      accessor: "images",
      render: (row) =>
        row.images[0] ? (
          <img
            src={row.images[0].url}
            alt={row.name}
            className="w-10 h-10 rounded-full object-cover cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedImage(row.images[0].url);
              setIsModalOpen(true);
            }}
          />
        ) : (
          "N/A"
        ),
    },
    { header: "P.I.", accessor: "productId" },
    {
      header: "Price",
      accessor: "price",
      render: (row) => `₹${row.price}`,
    },
    {
      header: "Stock",
      accessor: "stock",
      render: (row) => row.stock,
    },
    {
      header: "Author",
      accessor: "createdBy.name",
      render: (row) => row.createdBy?.name || "N/A",
    },
  ];

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-2 sm:p-1">
      <h2 className="text-sm font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Product List
      </h2>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <ProductFilter
          searchTerm={searchTerm}
          onSearchChange={(term) => {
            setSearchTerm(term);
            setPage(1);
          }}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
        <Button onClick={() => navigate("/admin/products/new")}>
          Add Product
        </Button>
      </div>

      {loading && (
        <div className="text-center text-gray-700 dark:text-gray-300 mb-4">
          <LoadingPage />
        </div>
      )}

      {/* Desktop Table */}
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

      {/* Mobile Cards */}
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
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Image:
                </span>
                {product.images[0]?.url && (
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedImage(product.images[0].url);
                      setIsModalOpen(true);
                    }}
                  />
                )}
              </div>
              <div className="flex justify-between mb-2">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  P.I.:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  {product.productId}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-900 dark:text-gray-100">
                  Price:
                </span>
                <span className="text-gray-700 dark:text-gray-300">
                  ₹{product.price}
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

      {/* Image Modal */}
      <ImageModal
        isOpen={isModalOpen}
        imageUrl={selectedImage}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ProductList;
