"use client";

export default function HeaderSupport() {
  return (
    <header className="relative w-full bg-[#061551] pt-12 pb-16 px-6 md:px-14 lg:px-18">
      <div className="relative w-full bg-gray-50 rounded-4xl pt-30 pb-10 flex items-center justify-center">
        <div className="text-center mb-12 px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 animate__animated animate__fadeInUp">
            Support Center
          </h1>

          <div className="w-24 h-1 bg-blue-200 mx-auto rounded-full mb-4 animate__animated animate__fadeInUp"></div>

          <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8 animate__animated animate__fadeInUp">
            Find help and guidance for using SalesWatch
          </p>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-stretch mx-auto">
            <button
              onClick={() => window.open("/assets/docs/user_guide_en.pdf", "_blank")}
              className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium 
               px-4 py-3 rounded-lg transition-colors duration-200
               w-full sm:w-auto sm:max-w-md animate__animated animate__fadeInUp"
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>

              <span className="text-xs leading-snug text-center sm:text-left">
                Download our complete Support Center guide (PDF version)
              </span>
            </button>

            <button
              onClick={() =>
                window.open(
                  "https://www.youtube.com/watch?v=paXWO1aMG7Q&list=PLNfbf5gyZF4WENxlcWKqZuwx8h6KZFlza",
                  "_blank"
                )
              }
              className="flex items-center gap-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium 
               px-4 py-3 rounded-lg transition-colors duration-200
               w-full sm:w-auto sm:max-w-md animate__animated animate__fadeInUp"
            >
              <svg
                className="w-5 h-5 shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>

              <span className="text-xs leading-snug text-center sm:text-left">
                Watch our Onboarding and How-to guides in video format
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
