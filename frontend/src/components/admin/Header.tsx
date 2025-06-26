
const Header = () => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Problem Set</h2>
          <p className="text-slate-400 mt-1">Sharpen your coding skills with our curated collection of problems</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-white font-medium">Admin User</p>
            <p className="text-slate-400 text-sm">admin@example.com</p>
          </div>
          <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">A</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
