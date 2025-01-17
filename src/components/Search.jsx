import { useState, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";

const Search = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);

  const menuRef = useRef(null);

  const handleMenuHide = event => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsFocused(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleMenuHide);
    return () => {
      document.removeEventListener("mousedown", handleMenuHide);
    };
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      onSearch("");
    }
  }, [searchTerm, onSearch]);

  const handleSearch = () => {
    if (searchTerm.trim() !== "") {
      onSearch(searchTerm);
      if (!searchHistory.includes(searchTerm)) {
        setSearchHistory(prevState => [searchTerm, ...prevState]);
      }
    }
  };

  useEffect(() => {
    const history = localStorage.getItem("searchHistory");
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const handleKeyDown = event => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSearch();
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onSearch("");
  };

  const handleClearHistory = event => {
    event.stopPropagation();
    setSearchTerm("");
    setSearchHistory([]);
    onSearch("");
  };

  const handleHistoryClick = historyItem => {
    setSearchTerm(historyItem);
    onSearch(historyItem);
    setIsFocused(false);
  };

  const handleMenuToggle = () => {
    setIsFocused(prevState => !prevState);
  };

  return (
    <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 ">
      <div className="relative flex w-full">
        <input
          className="h-12 w-full rounded-lg border px-10 text-sm text-gray-700 outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          type="text"
          placeholder="Ne aramıştınız?"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          id="search"
          onFocus={() => setIsFocused(true)}
        />
        {searchTerm.length > 0 && (
          <button
            className="absolute bottom-0 right-2 top-0 flex h-12 w-12 items-center justify-center text-gray-500 hover:text-gray-700 focus:outline-none dark:text-gray-400 dark:hover:text-gray-200"
            onClick={handleClear}
          >
            <XCircleIcon className="h-5 w-5" />
          </button>
        )}
        <div
          className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center text-gray-500"
          onClick={handleMenuToggle}
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-black dark:text-gray-50" />
        </div>
        {searchHistory.length > 0 && isFocused && (
          <div
            ref={menuRef}
            className="absolute top-full z-10 w-full overflow-hidden  border border-gray-200 bg-white shadow-md dark:border-gray-200    dark:bg-gray-800"
          >
            <ul className="divide-y divide-gray-200">
              {searchHistory.map(item => (
                <li
                  key={item}
                  className=" cursor-pointer px-4
                  py-3 text-gray-950 transition-all hover:bg-gray-50  dark:text-gray-50 dark:hover:bg-gray-950"
                  onClick={() => handleHistoryClick(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
            <button
              className="block w-full bg-gray-100 py-2 text-sm font-medium text-gray-500 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-600 dark:text-gray-200 dark:hover:text-white "
              onClick={handleClearHistory}
            >
              Arama Geçmişini Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
