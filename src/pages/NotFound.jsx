import { useNavigate } from "react-router-dom";
import "./css/NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    // ถ้าย้อนกลับไม่ได้ ให้กลับไปหน้า home แทน
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="notfound">
      <div className="notfound-inner">
        <div className="notfound-badge">404</div>

        <h1 className="notfound-title">Page not found</h1>
        <p className="notfound-sub">
          ดูเหมือนว่าหน้านี้ไม่มีอยู่ใน QuickHelp อาจถูกย้าย ลบไปแล้ว
          หรือคุณอาจพิมพ์ลิงก์ผิดเล็กน้อย ลองกลับไปหน้า Home หรือย้อนกลับไปหน้าที่แล้วดูนะคะ
        </p>

        <div className="notfound-actions">
          <button className="notfound-btn primary" onClick={handleGoHome}>
            ⬅ กลับหน้า Home
          </button>
          <button className="notfound-btn ghost" onClick={handleGoBack}>
            ◀ ย้อนกลับหน้าก่อนหน้า
          </button>
        </div>

        <div className="notfound-hint">
          หรือใช้ Quick Search ที่หน้า Home เพื่อค้นหาคู่มือที่คุณต้องการอีกครั้ง 💜
        </div>
      </div>

      <div className="notfound-blob notfound-blob-left" />
      <div className="notfound-blob notfound-blob-right" />
    </div>
  );
};

export default NotFound;
