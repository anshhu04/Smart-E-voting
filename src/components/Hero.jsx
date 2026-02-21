import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-gray-100 dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e293b]">
      <div className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ">
        {/* Left Content */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 dark:text-white leading-tight">
            Secure & Transparent{" "}
            <div>
              <span className="text-blue-900 dark:text-blue-400">
                Student Elections
              </span>
            </div>
          </h1>

          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 ">
            A modern e-voting platform designed for college student elections.
            Cast your vote securely, view real-time results, and participate in
            shaping your institution&apos;s future.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              to="/register"
              className="px-8 py-2 bg-blue-900 text-white rounded-xl font-medium hover:bg-blue-800 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-8 py-2 border border-black-800 text-black-800 rounded-lg hover:hsl(var(--accent)  transition font-medium
                       dark:border-gray-400 dark:text-gray-200
                       rounded-xl hover:bg-yellow-500 hover:text-white transition"
            >
              Login to Vote
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center">
          <img
            src="/body.jpg" // put image in public folder
            alt="Students using laptops"
            className="rounded-2xl shadow-xl w-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
