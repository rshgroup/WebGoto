"use client";

import { SearchHeader } from "@/components/search-header";

export default function UnderDevelopmentPage() {
  return (
    <div className="min-h-screen">
      <SearchHeader />
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold text-center">
          Our site is currently under development. <br />
          Please check back soon!
        </h1>
      </div>
    </div>
  );
}
