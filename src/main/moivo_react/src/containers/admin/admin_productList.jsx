import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import styles from "../../assets/css/admin_productList.module.css";
import Admins_side from '../../components/admin_sidebar/admins_side';

const ProductList = () => {
  const [sortBy, setSortBy] = useState(1); // 기본 정렬값: 전체
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // 주석 처리된 부분: 백엔드 코드가 준비되면 axios 호출로 변경
        // const response = await axios.get('http://localhost:8080/api/admin/qna/management/product', {
        //   params: { sortBy }, 
        // });
        
        // 임의의 데이터 설정 (백엔드가 준비되기 전까지)
        const dummyProducts = [
          { id: 1, name: "상품 1", price: 10000, allcount: 10, status: "" },
          { id: 2, name: "상품 2", price: 20000, allcount: 5, status: "일부 품절" },
          { id: 3, name: "상품 3", price: 30000, allcount: 0, status: "전체 품절" },
          { id: 4, name: "상품 4", price: 40000, allcount: 8, status: "삭제된 상품" }
        ];

        const formattedProducts = dummyProducts.map(product => ({
          id: product.id, // 상품 PK
          name: product.name, // 상품이름
          price: product.price, // 상품가격
          count: product.allcount, // 상품 총개수
          status: product.status, // 상품 품절 여부
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [sortBy]); // sortBy 변경 시 데이터 다시 로드

  const filteredProducts = products.filter((product) => {
    if (sortBy === 1) return true; // 전체
    if (sortBy === 2) return product.status === "일부 품절" || product.status === "전체 품절";
    if (sortBy === 3) return product.status === ""; // 정상 상태
    if (sortBy === 4) return product.status === "삭제된 상품"; // 삭제된 상품 상태
    return true;
  });

  const handleSortChange = (newSort) => setSortBy(newSort);

  const handleEdit = (id) => navigate(`/admin/products/e`);

  const handleDelete = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        // 실제 삭제 API 호출 대신 임의로 삭제
        setProducts(products.filter((product) => product.id !== id));
        alert("상품이 성공적으로 삭제되었습니다.");
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("상품 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const handleRestore = async (id) => {
    if (window.confirm("정말로 복구하시겠습니까?")) {
      try {
        // 실제 복구 API 호출 대신 임의로 복구
        setProducts(products.map((product) =>
          product.id === id ? { ...product, status: "정상" } : product
        ));
        alert("상품이 성공적으로 복구되었습니다.");
      } catch (error) {
        console.error("Failed to restore product:", error);
        alert("상품 복구 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAddProduct = () => navigate("/admins_productadd");

  return (
    <div className={styles.container}>
      {/* Sidebar 영역 */}
      <div className={styles.sidebar}>
        <Admins_side />
      </div>
      <main className={styles.mainContent}>
        <div className={styles.header}>
          <h1>상품 관리</h1>
          <button className={styles.addButton} onClick={handleAddProduct}>
            상품 추가
          </button>
        </div>
        <div className={styles.sortButtons}>
          <button onClick={() => handleSortChange(1)} className={sortBy === 1 ? styles.active : ""}>전체</button>
          <button onClick={() => handleSortChange(2)} className={sortBy === 2 ? styles.active : ""}>품절</button>
          <button onClick={() => handleSortChange(3)} className={sortBy === 3 ? styles.active : ""}>정상</button>
          <button onClick={() => handleSortChange(4)} className={sortBy === 4 ? styles.active : ""}>삭제된 상품</button>
        </div>
        <div className={styles.productTable}>
          <div className={styles.tableHeader}>
            <div>ID</div>
            <div>이름</div>
            <div>가격</div>
            <div>수량</div>
            <div>상태</div>
            <div>관리</div>
          </div>
          {filteredProducts.map((product) => (
            <div className={styles.tableRow} key={product.id}>
              <div>{product.id}</div>
              <div>{product.name}</div>
              <div>{product.price.toLocaleString()}원</div>
              <div>{product.count}</div>
              <div>{product.status || "정상"}</div> {/* 상태 출력 */}
              <div className={styles.actionButtons}>
                <button onClick={() => handleEdit(product.id)}>수정</button>
                {product.status === "삭제된 상품" && (
                    <button className={styles.restore} onClick={() => handleRestore(product.id)}>
                    복구
                    </button>
                )}
                <button onClick={() => handleDelete(product.id)}>삭제</button>
            </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ProductList;
