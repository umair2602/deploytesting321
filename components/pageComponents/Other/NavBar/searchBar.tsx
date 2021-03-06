import { CSSProperties, useState, useEffect } from "react";
import { BiSearchAlt } from "react-icons/bi";
import styles from "../../../../appStyles/appStyles.module.css";
import { useAuth } from "../../../authProvider/authProvider";
import { getStoredSearch } from "../../../globalFuncs";

interface SearchBar {
  search: (e: any) => void;
  style: CSSProperties | undefined;
}

export const SearchBar = ({ search, style }: SearchBar) => {
  const auth = useAuth();
  const searchVal = auth ? auth.searchVal : "";

  useEffect(() => {
    const storedVal = localStorage.getItem("PoldIt-data") || "";

    if (!storedVal) {
      return;
    }

    const { searchVal } = JSON.parse(storedVal);
    auth?.handleSearch(searchVal);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "PoldIt-data",
      JSON.stringify({ searchVal: searchVal })
    );
  }, [searchVal]);

  return (
    <div className="form-row justify-content-between" style={style}>
      <div
        className={`input-group ${styles.searchBar} bg-white align-items-center rounded`}
      >
        <div className="input-group-prepend overflow-hidden">
          <span
            className="input-group-text bg-white border border-white p-1"
            id="basic-addon1"
          >
            <BiSearchAlt
              style={{
                color: "gray",
                height: 23,
                width: 23,
              }}
            />
          </span>
        </div>
        <input
          type="search"
          className="form-control border border-white"
          placeholder="Search"
          value={searchVal}
          onChange={(e) => auth?.handleSearch(e.target.value)}
          aria-label="Search"
          onKeyDown={search}
        />
      </div>
    </div>
  );
};

export const OnChangeSearchBar = ({ search, style }: SearchBar) => {
  return (
    <div className="form-row justify-content-between" style={style}>
      <div
        className={`input-group ${styles.searchBar} bg-white align-items-center rounded`}
      >
        <div className="input-group-prepend overflow-hidden">
          <span
            className="input-group-text bg-white border border-white p-1"
            id="basic-addon1"
          >
            <BiSearchAlt
              style={{
                color: "gray",
                height: 23,
                width: 23,
              }}
            />
          </span>
        </div>
        <input
          type="search"
          className="form-control border border-white"
          placeholder="Search"
          aria-label="Search"
          onChange={search}
        />
      </div>
    </div>
  );
};
