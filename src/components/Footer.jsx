import { Link } from "react-router-dom";
export default function Footer() {
  return (
    <>
      {/* CTA Section */}
      <section
        className="
        bg-gradient-to-br from-[#172554] to-[#1e3a8a] text-white
        dark:bg-gradient-to-br dark:from-[#020617] dark:via-[#0f172a] dark:to-[#1e293b]
        py-20"
      >
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold dark:text-slate-100">
            Ready to Make Your Voice Heard?
          </h2>

          <p className="mt-6 text-xl text-gray-100 dark:text-slate-300">
            Join thousands of students participating in fair and transparent
            elections
          </p>

          <Link to="/register">
          <button
            className="
              mt-10 px-8 py-2 rounded-xl font-medium transition
              bg-white text-blue-800 hover:bg-gray-200
              dark:bg-blue-900 dark:text-white dark:hover:bg-blue-800
            "
          >
            Register Now
          </button>
          </Link>  
        </div>
      </section>

      {/* Bottom Footer */}
      <footer className="bg-slate-900 text-gray-400 dark:text-gray-200 py-6 text-center dark:bg-[#0a0a0a]">
        <p>© 2026 Smart E-Voting System. Built for secure student elections.</p>
      </footer>
    </>
  );
}
