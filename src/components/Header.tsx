"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session, status } = useSession();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: "/" });
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          <Link href="/" className="hover:text-gray-700">
            TinyPlot CMS
          </Link>
        </h1>
        <nav className="flex items-center">
          <ul className="flex space-x-6 mr-4">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-gray-900 hover:underline"
              >
                Ana Sayfa
              </Link>
            </li>
            <li>
              <Link
                href="/files"
                className="text-gray-700 hover:text-gray-900 hover:underline"
              >
                Dosya Yöneticisi
              </Link>
            </li>
          </ul>

          {/* Kullanıcı profil menüsü */}
          <div className="relative">
            {status === "authenticated" ? (
              <>
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  <span className="mr-1">
                    {session.user?.name || "Kullanıcı"}
                  </span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg z-10">
                    <div className="px-4 py-2 text-xs text-gray-500">
                      {session.user?.email}
                    </div>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Giriş Yap
              </Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
