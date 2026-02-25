export default function Services() {
  return (
    <section className="bg-white dark:bg-[#0b1220] py-24">
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white ">
          Why Choose Smart E-Voting?
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Built with security, transparency, and user experience at its core
        </p>

        {/* Cards */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Card 1 */}
          <div
            className="flex flex-col items-center text-centerbg-white dark:bg-gradient-to-br dark:from-[#0b132b] dark:to-[#1c2541] rounded-2xl px-6 py-8
    shadow-md dark:shadow-none
    border border-gray-200 dark:border-slate-700
  "
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="w-8 h-8 text-blue-700 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z"
                />
              </svg>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
              Secure & Anonymous
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-300 ">
              Your vote is completely anonymous and secured with
              industry-standard encryption. One student, one vote per position.
            </p>
          </div>

          {/* Card 2 */}
          <div
            className="
    flex flex-col items-center text-center
    bg-white dark:bg-gradient-to-br dark:from-[#0b132b] dark:to-[#1c2541]
    rounded-2xl px-6 py-8
    shadow-md dark:shadow-none
    border border-gray-200 dark:border-slate-700
  "
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="w-8 h-8 text-blue-700 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 19h16M8 17V9m4 8V5m4 12v-6"
                />
              </svg>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
              Real-time Results
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-300 ">
              Watch live vote counts and election results as they happen.
              Complete transparency in the democratic process.
            </p>
          </div>

          {/* Card 3 */}
          <div
            className="
    flex flex-col items-center text-center
    bg-white dark:bg-gradient-to-br dark:from-[#0b132b] dark:to-[#1c2541]
    rounded-2xl px-6 py-8
    shadow-md dark:shadow-none
    border border-gray-200 dark:border-slate-700
  "
          >
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <svg
                className="w-8 h-8 text-blue-700 dark:text-blue-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 20h5v-2a4 4 0 00-5-4m-4 6v-2a4 4 0 00-4-4H4a4 4 0 00-4 4v2h9m4-10a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
            </div>

            <h3 className="mt-6 text-xl font-semibold text-gray-900 dark:text-white">
              Easy to Use
            </h3>

            <p className="mt-4 text-gray-600 dark:text-gray-300 ">
              Simple, intuitive interface designed specifically for students.
              Vote in seconds from any device.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
