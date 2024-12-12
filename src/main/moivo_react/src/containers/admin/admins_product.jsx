import React, { useState, useEffect } from "react";
import admin_product from "../../assets/css/admins_product.module.css";
import axios from "axios";
import { PATH } from "../../../scripts/path";
import Admins_side from '../../components/admin_sidebar/admins_side';

const AdminsProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    price: "",
    content: "",
    categoryId: 0,
    gender: ""
  });

  const [categories, setCategories] = useState([]);
  const [genders, setGenders] = useState([]);

  const [stock, setStock] = useState({
    S: 0,
    M: 0,
    L: 0,
  });

  const [files, setFiles] = useState({
    layer1: null,
    layer2: [],
    layer3: [],
    layer4: null,
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 카테고리 정보 가져오기
    axios.get(`${PATH.SERVER}/api/admin/store/category`).then((res) => {
      if (Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        console.error("카테고리 데이터는 배열이 아닙니다 ? :", res.data);
      }
    });

    // 성별 정보 가져오기
    axios.get(`${PATH.SERVER}/api/admin/store/gender`).then((res) => {
      if (Array.isArray(res.data)) {
        setGenders(res.data);
      }
    });
  }, []);

  // 상품 정보 입력 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // 재고 입력 핸들러
  const handleStockChange = (size, value) => {
    setStock((prev) => ({ ...prev, [size]: value }));
  };

  // 파일 추가 핸들러 (단일 파일)
  const handleSingleFileChange = (e, layer) => {
    setFiles((prev) => ({ ...prev, [layer]: e.target.files[0] }));
  };

  // 파일 추가 핸들러 (다중 파일)
  const handleMultipleFileChange = (e, layer) => {
    setFiles((prev) => ({ ...prev, [layer]: Array.from(e.target.files) }));
  };

  // 드래그 앤 드롭 핸들러
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, layer) => {
    e.preventDefault();
    setFiles((prev) => ({ ...prev, [layer]: Array.from(e.dataTransfer.files) }));
  };

  // 업로드 핸들러
  const handleUpload = async () => {
    const formData = new FormData();

    if (
      !product.name ||
      !product.price ||
      !product.content ||
      !product.categoryId
    ) {
      alert("모든 상품 정보를 입력해주세요.");
      return;
    }

    if (!files.layer1 || !files.layer4 || files.layer2.length === 0 || files.layer3.length === 0) {
      alert("모든 레이어의 이미지를 업로드해주세요.");
      return;
    }

    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("content", product.content);
    formData.append("categoryId", product.categoryId);
    formData.append("gender", product.gender);

    // 재고 데이터 추가
    Object.entries(stock).forEach(([size, count]) => {
      formData.append(`${size}`, count);
    });

    // 사용자 파일 추가 (layer 정보와 함께)
    formData.append("layer1", files.layer1); // 단일 파일
    files.layer2.forEach((file) => formData.append("layer2", file)); // 다중 파일
    files.layer3.forEach((file) => formData.append("layer3", file)); // 다중 파일
    formData.append("layer4", files.layer4); // 단일 파일

    try {
      const response = await axios.post(
        `${PATH.SERVER}/api/admin/store/product`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      if (response.status === 200) {
        alert("상품이 성공적으로 등록되었습니다.");
        resetForm();
      }
    } catch (error) {
      console.error("업로드 실패:", error);
      alert("상품 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setProduct({ name: "", price: "", content: "", categoryId: "" });
    setStock({ S: 0, M: 0, L: 0 });
    setFiles({
      layer1: null,
      layer2: [],
      layer3: [],
      layer4: null,
    });
    setProgress(0);
  };

  return (
    <div className={admin_product.uploadContainer}>
      <Admins_side/>
      <div className={admin_product.uploadWrapper}>

        <h1 className={admin_product.uploadTitle}>상품 업로드</h1>
        <div className={admin_product.form}>
          <div className={admin_product.inputGroup}>
            
            <label className={admin_product.label}>상품명</label>
            <input
              className={admin_product.input}
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="상품명을 입력하세요"
            />
          </div>

          <div className={admin_product.inputGroup}>
            <label className={admin_product.label}>가격</label>
            <input
              className={admin_product.input}
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              placeholder="가격을 입력하세요"
            />
          </div>

          <div className={admin_product.inputGroup}>
            <label className={admin_product.label}>상품 설명</label>
            <textarea
              className={admin_product.textarea}
              name="content"
              value={product.content}
              onChange={handleInputChange}
              placeholder="상품 설명을 입력하세요"
            />
          </div>

          <div className={admin_product.inputGroup}>
            <label className={admin_product.label}>카테고리</label>
            <select
              className={admin_product.select}
              name="categoryId"
              value={product.categoryId}
              onChange={handleInputChange}
            >
              <option value="">카테고리 선택</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className={admin_product.inputGroup}>
            <label className={admin_product.label}>성별</label>
            <select
              className={admin_product.select}
              name="gender"
              value={product.gender}
              onChange={handleInputChange}
            >
              <option value="">성별 선택</option>
              {genders.map((gender, index) => (
                <option key={index} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
          </div>
              
          <div className={admin_product.stockSection}>
            <h2 className={admin_product.sectionTitle}>재고 수량</h2>
            <div className={admin_product.stockGrid}>
              {Object.entries(stock).map(([size, count]) => (
                <div key={size} className={admin_product.stockItem}>
                  <label className={admin_product.label}>{size} 사이즈</label>
                  <input
                    className={admin_product.input}
                    type="number"
                    value={count}
                    onChange={(e) => handleStockChange(size, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={admin_product.fileSection}>
            <h2 className={admin_product.sectionTitle}>이미지 업로드</h2>

            <div className={admin_product.inputGroup}>
              <label className={admin_product.label}>Layer 1 (대표 이미지)</label>
              <input
                className={admin_product.fileInput}
                type="file"
                onChange={(e) => handleSingleFileChange(e, "layer1")}
              />
            </div>

            <div className={admin_product.inputGroup}>
              <label className={admin_product.label}>Layer 2 (상세 이미지)</label>
              <div
                className={admin_product.dropzone}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "layer2")}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFileChange(e, "layer2")}
                />
                <p className={admin_product.dropzoneText}>
                  파일을 선택하거나 드래그해주세요
                </p>
              </div>
            </div>

            <div className={admin_product.inputGroup}>
              <label className={admin_product.label}>Layer 3 (추가 상세 이미지)</label>
              <div
                className={admin_product.dropzone}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "layer3")}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFileChange(e, "layer3")}
                />
                <p className={admin_product.dropzoneText}>
                  파일을 선택하거나 드래그해주세요
                </p>
              </div>
            </div>

            <div className={admin_product.inputGroup}>
              <label className={admin_product.label}>Layer 4 (상품 정보 이미지)</label>
              <input
                className={admin_product.fileInput}
                type="file"
                onChange={(e) => handleSingleFileChange(e, "layer4")}
              />
            </div>
          </div>

          <button className={admin_product.uploadButton} onClick={handleUpload}>
            상품 등록하기
          </button>

          {progress > 0 && (
            <div className={admin_product.progressBar}>
              <div
                className={admin_product.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminsProduct;
