"use client"

import React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"

const Table = ({
  columns,
  data,
  itemsPerPage = 10,
  actions = null,
  searchable = false,
  searchPlaceholder = "Search...",
  onSearch = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  // Filter data based on search term if searchable is true
  const filteredData =
    searchable && searchTerm
      ? data.filter((item) =>
          Object.values(item).some(
            (value) => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
          ),
        )
      : data

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page on search
    if (onSearch) {
      onSearch(value)
    }
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <div className="table-actions">
        {searchable && (
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder={searchPlaceholder} value={searchTerm} onChange={handleSearch} />
          </div>
        )}
        {actions}
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th key={index}>{column.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column, colIndex) => (
                    <td key={colIndex}>{column.render ? column.render(row) : row[column.accessor]}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="text-center py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="table-footer">
          <div>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
            {filteredData.length} entries
          </div>
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) => page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1),
              )
              .map((page, index, array) => (
                <React.Fragment key={page}>
                  {index > 0 && array[index - 1] !== page - 1 && <span>...</span>}
                  <button
                    className={`pagination-button ${currentPage === page ? "active" : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}

            <button
              className="pagination-button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table

