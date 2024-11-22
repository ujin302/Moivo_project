import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Main_index from './components/main_index';
import User_login from './containers/user/user_login';
import User_signup from './containers/user/user_signup';
import ProductBoard from './containers/product/product_board'; 
import ProductList from './containers/product/product_list';
import ProductSearch from './containers/product/product_search';
import ProductDetail from './containers/product/product_detail';
import Qna_faqboard from './containers/qna/qna_faqboard';
import Qna_board from './containers/qna/qna_board';
import Qna_boardlist from './containers/qna/qna_bardlist';
import MainProvider from './contexts/MainContext';
import Upload from './containers/test/upload';
import MypageMain from './containers/mypage/mypage_main';
import MypageWish from './containers/mypage/mypage_wish';
import MypageBoard from './containers/mypage/mypage_board';
import MypageOrder from './containers/mypage/mypage_order';
import MypageOrderDetails from './containers/mypage/mypage_orderDetails';
import MypageProfile from './containers/mypage/mypage_profile';
import Cart from './containers/cart/cart';

const routeConfig = [
  { path: "/", element: <Main_index /> },
  { path: "/user", element: <User_login /> },
  { path: "/user_signup", element: <User_signup /> },
  { path: "/product-board", element: <ProductBoard /> },
  { path: "/product-list", element: <ProductList /> },
  { path: "/product-search", element: <ProductSearch /> },
  { path: "/product-detail/:id", element: <ProductDetail /> },
  { path: "/upload", element: <Upload /> },
  { path: "/mypage", element: <MypageMain /> },
  { path: "/mypage/profile", element: <MypageProfile /> },
  { path: "/mypage/wish", element: <MypageWish /> },
  { path: "/mypage/board", element: <MypageBoard /> },
  { path: "/mypage/order", element: <MypageOrder /> },
  { path: "/mypage/orderDetails", element: <MypageOrderDetails /> },
  { path: "/qna_faqboard", element: <Qna_faqboard /> },
  { path: "/qna_board", element: <Qna_board /> },
  { path: "/qna_boardlist", element: <Qna_boardlist /> },
  { path: "/cart", element: <Cart /> },
];

const App = () => {
  return (
    <AuthProvider>
      <MainProvider>
        <Router>
          <Routes>
            {routeConfig.map(({ path, element }, index) => (
              <Route key={index} path={path} element={element} />
            ))}
          </Routes>
        </Router>
      </MainProvider>
    </AuthProvider>
  );
};

export default App;
