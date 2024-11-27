import React, { useState, useEffect } from "react";
import styles from "../../assets/css/update.module.css";
import axios from "axios";
import { PATH } from "../../../scripts/path";
import Banner from "../../components/Banner/banner";

const Upload = () => {
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    price: "",
    content: "",
    categoryId : 0
  });

  const [categories, setCategories] = useState([]);

  const [stock, setStock] = useState({
    S: 0,
    M: 0,
    L: 0,
  });

  const [serverFiles, setServerFiles] = useState({
    layer1: [],
    layer2: [],
    layer3: [],
    layer4: []
  });
  
  const [files, setFiles] = useState({
    layer1: null,
    layer2: [],
    layer3: [],
    layer4: null
  });

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // 카테고리 정보 가져오기
    axios.get(`${PATH.SERVER}/api/admin/store/category`).then((res) => {
      if (Array.isArray(res.data)) {
        setCategories(res.data);
        console.log(res.data);
        
      } else {
        console.error("카테고리 데이터는 배열이 아닙니다 ? :", res.data);
      }
    });

    axios.get(`${PATH.SERVER}/api/user/store/13`).then((res) => {
      console.log(res.data)
      // 상품 정보 설정
      setProduct({
        ...product, 
        'id' : res.data.Product.id,
        'name' : res.data.Product.name,
        'price' : res.data.Product.price,
        'content' : res.data.Product.content,
        'categoryId' : res.data.Product.categoryId
      });

      // 이미지 설정
      var l1 = [];
      var l2 = [];
      var l3 = [];
      var l4 = [];

      for (let i = 0; i < res.data.ImgList.length; i++) {
        switch (res.data.ImgList[i].layer) {
          case 1:
            l1.push(res.data.ImgList[i])
            break;
          case 2:
            l2.push(res.data.ImgList[i])
          break;
          case 3:
            l3.push(res.data.ImgList[i])
          break;
          case 4:
            l4.push(res.data.ImgList[i])
          break;
          default:
            break;
        }
      }
      
      setServerFiles({
        ...serverFiles,
        'layer1' : l1,
        'layer2' : l2,
        'layer3' : l3,
        'layer4' : l4
      });
      console.log(l1);
      
      // 재고 설정
      setStock({
        ...stock,
        'S' : res.data.Stock.S,
        'M' : res.data.Stock.M,
        'L' : res.data.Stock.L
      });
      
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

  // 화면에서 이미지 삭제
  const cancelImg = (e, layer, img) => {
    e.preventDefault(); // 기본 동작 방지 (옵션)
  
    // 레이어에 해당하는 이미지를 찾아 삭제
    setServerFiles(prevFiles => {
      // 각 레이어별로 해당 이미지 제거
      const updatedLayer = prevFiles[layer].filter(item => item.fileName !== img.fileName);
  
      return {
        ...prevFiles,
        [layer]: updatedLayer, // 해당 레이어만 업데이트
      };
    });

    console.log(files)
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
    if (!product.name || !product.price || !product.content || !product.categoryId) {
      alert("모든 상품 정보를 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("name", product.name);
    formData.append("price", product.price);
    formData.append("content", product.content);
    formData.append("categoryId", product.categoryId);
    console.log(product.categoryId);
    console.log("------------");
    

    // 재고 데이터 추가
    Object.entries(stock).forEach(([size, count]) => {
      formData.append(size, count); // "S", "M", "L"라는 키로 전송
    });    
    
    // 서버 파일 삭제하지 않을 id
    var selectImgList = []
    serverFiles.layer1.forEach((file) => {
      console.log(file.id);
      selectImgList.push(file.id);
    });

    serverFiles.layer2.forEach((file) => {
      console.log(file.id);
      selectImgList.push(file.id);
    });

    serverFiles.layer3.forEach((file) => {
      console.log(file.id);
      selectImgList.push(file.id);
    });

    serverFiles.layer4.forEach((file) => {
      console.log(file.id);
      selectImgList.push(file.id);
    });

    // 배열을 JSON 문자열로 변환하여 추가
    formData.append("selectImgList", JSON.stringify(selectImgList));

    // 사용자 파일 추가 (layer 정보와 함께)
    formData.append("layer1", files.layer1); // 단일 파일
    files.layer2.forEach((file) => formData.append("layer2", file)); // 다중 파일
    files.layer3.forEach((file) => formData.append("layer3", file)); // 다중 파일
    formData.append("layer4", files.layer4); // 단일 파일
    
    // formData.append("files", files.layer1);
    // formData.append("layers", 1);

    // files.layer2.forEach((file) => {
    //   formData.append("files", file);
    //   formData.append("layers", 2);
    // });

    // files.layer3.forEach((file) => {
    //   formData.append("files", file);
    //   formData.append("layers", 3);
    // });

    // formData.append("files", files.layer4);
    // formData.append("layers", 4);

    console.log(formData);
    try {
      const response = await axios.put(
        `${PATH.SERVER}/api/admin/store/product`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percentCompleted);
          },
        }
      );

      alert("상품 업로드가 완료되었습니다.");
      resetForm();
    } catch (error) {
      console.error("업로드 실패:", error.response.data);
      alert(`업로드에 실패했습니다: ${error.response.data.message}`);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <Banner />
      <div className={styles.uploadWrapper}>
        <h1 className={styles.uploadTitle}>상품 수정</h1>
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>상품명</label>
            <input
              className={styles.input}
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              placeholder="상품명을 입력하세요."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>가격</label>
            <input
              className={styles.input}
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              placeholder="가격을 입력하세요."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>상품 설명</label>
            <textarea
              className={styles.textarea}
              name="content"
              value={product.content}
              onChange={handleInputChange}
              placeholder="상품 설명을 입력하세요."
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>카테고리</label>
            <select
              className={styles.select}
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

          <div className={styles.stockSection}>
            <h2 className={styles.sectionTitle}>재고 수량</h2>
            <div className={styles.stockGrid}>
              {Object.entries(stock).map(([size, count]) => (
                <div key={size} className={styles.stockItem}>
                  <label className={styles.label}>{size} 사이즈</label>
                  <input
                    className={styles.input}
                    type="number"
                    value={count}
                    onChange={(e) => handleStockChange(size, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.fileSection}>
            <h2 className={styles.sectionTitle}>이미지 업로드</h2>
            
            <div className={styles.inputGroup}>
              <label className={styles.label}>Layer 1 (대표 이미지)</label>
              <div className={styles.parentContainer}>
                {
                  serverFiles.layer1.map((img, index) => (
                    <>
                      <div className={styles.productImgDiv}>
                        <img className={styles.productImg} key={index} src={img.fileName} alt={img.fileName} />
                        <button className={styles.cancelBtn} onClick={(e) => cancelImg(e, "layer1", img)}>X</button>
                      </div>
                    </>
                  ))
                }
              </div>
              <input
                className={styles.fileInput}
                type="file"
                onChange={(e) => handleSingleFileChange(e, "layer1")}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Layer 2 (상세 이미지)</label>
              <div className={styles.parentContainer}>
                {
                  serverFiles.layer2.map((img, index) => (
                    <>
                      <div className={styles.productImgDiv}>
                        <img className={styles.productImg} key={index} src={img.fileName} alt={img.fileName} />
                        <button className={styles.cancelBtn} onClick={(e) => cancelImg(e, "layer2", img)}>X</button>
                      </div>
                    </>
                  ))
                }
              </div>
              <div
                className={styles.dropzone}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "layer2")}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFileChange(e, "layer2")}
                />
                <p className={styles.dropzoneText}>
                  파일을 선택하거나 드래그해주세요
                </p>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Layer 3 (추가 상세 이미지)</label>
              <div className={styles.parentContainer}>
                {
                  serverFiles.layer3.map((img, index) => (
                    <>
                      <div className={styles.productImgDiv}>
                        <img className={styles.productImg} key={index} src={img.fileName} alt={img.fileName} />
                        <button className={styles.cancelBtn} onClick={(e) => cancelImg(e, "layer3", img)}>X</button>
                      </div>
                    </>
                  ))
                }
              </div>
              <div
                className={styles.dropzone}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, "layer3")}
              >
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleMultipleFileChange(e, "layer3")}
                />
                <p className={styles.dropzoneText}>
                  파일을 선택하거나 드래그해주세요
                </p>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Layer 4 (상품 정보 이미지)</label>
              <div className={styles.parentContainer}>
              <div className={styles.parentContainer}>
                {
                  serverFiles.layer4.map((img, index) => (
                    <>
                      <div className={styles.productImgDiv}>
                        <img className={styles.productImg} key={index} src={img.fileName} alt={img.fileName} />
                        <button className={styles.cancelBtn} onClick={(e) => cancelImg(e, "layer4", img)}>X</button>
                      </div>
                    </>
                  ))
                }
              </div>
              </div>
              <input
                className={styles.fileInput}
                type="file"
                onChange={(e) => handleSingleFileChange(e, "layer4")}
              />
            </div>
          </div>

          <button className={styles.uploadButton} onClick={handleUpload}>
            상품 수정하기
          </button>

          {progress > 0 && (
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Upload;