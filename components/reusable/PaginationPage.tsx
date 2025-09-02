function PaginationPage({totalPages, setCurrentPage, currentPage} :any) {
  return (
    <div className="mt-10 mb-0 lg:mb-20 ">
<div className=" flex justify-end ">
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="inline-flex justify-center items-center  gap-2">
            <div className="h-8 px-1 py-2.5 bg-white rounded-xs inline-flex flex-col justify-center items-center gap-2.5">
            
              <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
           className={`justify-start ${currentPage === 1 ? 'text-grayColor1 bg-grayColor1/20' : 'text-[#1d1f2c]'} border  border-descriptionColor/20 text-descriptionColor cursor-pointer disabled:cursor-not-allowed  px-[4px] lg:px-4 py-1 lg:py-2 rounded-md flex items-center text-xs md:text-sm lg:text-base gap-2`}
          disabled={currentPage === 1}
        >
          &lt;&lt; Previous
        </button>

            </div>
            
            {[...Array(totalPages)].map((_, i) => {
              // Show ellipsis for many pages
              if (totalPages > 5) {
                // Always show first page
                if (i === 0) {
                  return (
                    <div 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`lg:w-8 lg:h-8 w-5 h-5 p-1.5 lg:p-2.5 ${
                        currentPage === i + 1
                        ? 'bg-secondaryColor'
                        : 'bg-white outline-1 text-xs md:text-sm lg:text-base outline-offset-[-1px] outline-[#f1f1f1]'
                      } rounded-xs inline-flex flex-col justify-center items-center gap-2.5 cursor-pointer`}
                    >
                      <div className={`justify-start ${
                        currentPage === i + 1
                        ? 'text-white'
                        : 'text-[#1d1f2c]'
                      } text-xs md:text-sm lg:text-base font-medium leading-relaxed tracking-tight`}>
                        {i + 1}
                      </div>
                    </div>
                  );
                }
                
                // Always show current page and adjacent pages
                if (i + 1 === currentPage || i === currentPage || i + 2 === currentPage) {
                  return (
                    <div 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`lg:w-8 lg:h-8 w-5 h-5 p-1.5 lg:p-2.5${
                        currentPage === i + 1
                        ? 'bg-secondaryColor'
                        : 'bg-white outline-1 outline-offset-[-1px] outline-[#f1f1f1]'
                      } rounded-xs inline-flex flex-col justify-center items-center gap-2.5 cursor-pointer`}
                    >
                      <div className={`justify-start ${
                        currentPage === i + 1
                        ? 'text-white'
                        : 'text-[#1d1f2c]'
                      } text-xs md:text-sm lg:text-base font-medium leading-relaxed tracking-tight`}>
                        {i + 1}
                      </div>
                    </div>
                  );
                }
                
                // Show ellipsis after first page (if needed)
                if (i === 1 && currentPage > 3) {
                  return (
                    <div key={i} className="lg:w-8 lg:h-8 w-5 h-5 p-1.5 lg:p-2.5 bg-white rounded-xs inline-flex flex-col justify-center items-center gap-2.5">
                      <div className="justify-center text-[#1d1f2c] text-xs md:text-sm lg:text-base font-medium leading-relaxed tracking-tight">...</div>
                    </div>
                  );
                }
                
                // Show ellipsis before last page (if needed)
                if (i === totalPages - 3 && currentPage < totalPages - 3) {
                  return (
                    <div key={i} className="lg:w-8 lg:h-8 w-5 h-5 p-1.5 lg:p-2.5 bg-white rounded-xs inline-flex flex-col justify-center items-center gap-2.5">
                      <div className="justify-center text-[#1d1f2c] text-xs md:text-sm lg:text-base font-medium leading-relaxed tracking-tight">...</div>
                    </div>
                  );
                }
                
                // Always show last page
                if (i === totalPages - 1) {
                  return (
                    <div 
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`lg:w-8 lg:h-8 w-5 h-5 p-1.5 lg:p-2.5 ${
                        currentPage === i + 1
                        ? 'bg-secondaryColor'
                        : 'bg-white outline  outline-offset-[-1px] outline-[#f1f1f1]'
                      } rounded-xs inline-flex flex-col justify-center items-center gap-2.5 cursor-pointer`}
                    >
                      <div className={`justify-start ${
                        currentPage === i + 1
                        ? 'text-white'
                        : 'text-[#1d1f2c]'
                      } text-xs md:text-sm lg:text-base font-medium leading-relaxed tracking-tight`}>
                        {i + 1}
                      </div>
                    </div>
                  );
                }
                
                return null;
              } else {
                return (
                  <div 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`lg:w-8 lg:h-8 w-5 h-5 p-1.5 lg:p-2.5 ${
                      currentPage === i + 1
                      ? 'bg-secondaryColor'
                      : 'bg-white outline  outline-offset-[-1px] outline-[#f1f1f1]'
                    } rounded-xs inline-flex flex-col justify-center items-center gap-2.5 cursor-pointer`}
                  >
                    <div className={`justify-start ${
                      currentPage === i + 1
                      ? 'text-white'
                      : 'text-[#1d1f2c]'
                    } text-xs md:text-sm lg:text-base font-medium leading-relaxed tracking-tight`}>
                      {i + 1}
                    </div>
                  </div>
                );
              }
            })}
            
            <div className="h-8 px-1 py-2.5 bg-white rounded-xs inline-flex flex-col justify-center items-center gap-2.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className={`justify-start ${currentPage === totalPages ? 'text-grayColor1 bg-grayColor1/20' : 'text-[#1d1f2c]'} border  border-descriptionColor/20 text-descriptionColor cursor-pointer disabled:cursor-not-allowed  px-[4px] lg:px-4 py-1 lg:py-2 rounded-md flex items-center text-xs md:text-sm lg:text-base gap-2`}
                disabled={currentPage === totalPages}
              >
               Next &gt;&gt;
              </button>
            </div>
          </div>
        )}
    </div>
    </div>
    
  )
}

export default PaginationPage