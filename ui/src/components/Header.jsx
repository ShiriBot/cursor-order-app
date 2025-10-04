import './Header.css';

function Header({ activeTab, setActiveTab }) {
  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">COZY</h1>
        <nav className="navigation">
          <button
            className={`nav-tab ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => setActiveTab('order')}
          >
            주문하기
          </button>
          <button
            className={`nav-tab ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            관리자
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;

