import { signIn } from "~/server/auth";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side */}
      <div className="flex flex-col flex-1 px-16 py-10">
        {/* Logo */}
        <div className="mb-16">
          <svg width="40" height="33" viewBox="0 0 40 33" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.8834 1.07573L2.70815 7.65605C1.12897 8.34203 1.14895 10.5895 2.74011 11.2486L17.9953 17.6148C19.2908 18.1487 20.7442 18.1487 22.0397 17.6148L37.2949 11.2486C38.886 10.5895 38.906 8.34203 37.3268 7.65605L22.1516 1.07573C20.8161 0.495127 19.2189 0.495127 17.8834 1.07573Z" fill="#FCB400"/>
            <path d="M21.2915 20.4939V35.0436C21.2915 35.8229 22.0951 36.3434 22.8056 36.0199L39.5583 28.7857C40.0256 28.5753 40.3234 28.1083 40.3234 27.5957V13.0461C40.3234 12.2667 39.5199 11.7463 38.8093 12.0698L22.0566 19.304C21.5894 19.5143 21.2915 19.9814 21.2915 20.4939Z" fill="#18BFFF"/>
            <path d="M18.3568 20.9785L13.6288 23.3573L13.1115 23.6155L1.44278 29.2523C0.725663 29.6024 0 29.0832 0 28.2849V13.0908C0 12.7873 0.14992 12.5239 0.37978 12.3473C0.469738 12.2807 0.569694 12.2274 0.679647 12.194C0.929551 12.1074 1.21944 12.1207 1.46934 12.2540L18.303 20.3539C18.5729 20.4939 18.583 20.8506 18.3568 20.9785Z" fill="#F82B60"/>
          </svg>
        </div>

        {/* Sign in form */}
        <div className="max-w-[370px] w-full">
          <h1 className="text-[28px] font-semibold text-gray-900 mb-8">Sign in to Airtable</h1>

          {/* Email field (visual only) */}
          <div className="mb-3">
            <label className="block text-sm text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              placeholder="Email address"
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm text-gray-500 outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
              disabled
            />
          </div>

          {/* Continue button (visual only) */}
          <button
            disabled
            className="w-full bg-[#7fb2e5] text-white text-sm py-2.5 rounded mb-5 cursor-not-allowed"
          >
            Continue
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-500">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* SSO button (visual only) */}
          <button
            disabled
            className="w-full border border-gray-300 rounded text-sm py-2.5 mb-3 text-gray-700 cursor-not-allowed"
          >
            Sign in with <span className="font-semibold">Single Sign On</span>
          </button>

          {/* Google sign in */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button
              type="submit"
              className="w-full border border-gray-300 rounded text-sm py-2.5 mb-3 text-gray-700 flex items-center justify-center gap-2 hover:bg-gray-50 cursor-pointer"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with <span className="font-semibold">Google</span>
            </button>
          </form>

          {/* Apple button (visual only) */}
          <button
            disabled
            className="w-full border border-gray-300 rounded text-sm py-2.5 text-gray-700 flex items-center justify-center gap-2 cursor-not-allowed"
          >
            <svg width="16" height="18" viewBox="0 0 814 1000" xmlns="http://www.w3.org/2000/svg">
              <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105.6-57.8-155.5-127.4C46 376.7 0 228.1 0 106.7c0-70.7 24.3-127.4 72.8-173.6 64-62 166.8-102.3 268.1-102.3 99.5 0 185.3 38.7 245.4 103.7l-.6.3c8-1.2 30.2-11.8 77.3-11.8 52.1 0 116.7 31.2 163.3 85.1z" fill="#000"/>
            </svg>
            Continue with <span className="font-semibold">Apple ID</span>
          </button>

          {/* Footer links */}
          <div className="mt-12 space-y-2">
            <p className="text-sm text-gray-500">
              New to Airtable?{" "}
              <a href="#" className="text-blue-600 hover:underline font-medium">
                Create an account
              </a>{" "}
              instead
            </p>
            <p className="text-sm text-gray-500">
              Manage your cookie preferences{" "}
              <a href="#" className="text-blue-600 hover:underline">
                here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Right side — promotional card */}
      <div className="hidden lg:flex items-center justify-center flex-1 bg-white pr-16 py-10">
        <div className="w-full max-w-[420px] bg-[#2d1b4e] rounded-2xl overflow-hidden p-8">
          <h2 className="text-white text-3xl font-semibold leading-snug mb-6">
            Meet Omni, your AI collaborator for building custom apps.
          </h2>
          <button className="bg-white text-[#2d1b4e] text-sm font-medium px-5 py-2.5 rounded mb-6 hover:bg-gray-100">
            Start building
          </button>

          {/* App screenshot grid */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800 rounded-lg aspect-square overflow-hidden flex items-center justify-center">
              <div className="w-12 h-12 bg-gray-600 rounded-full" />
            </div>
            <div className="bg-pink-300 rounded-lg aspect-square overflow-hidden flex items-center justify-center">
              <div className="grid grid-cols-3 gap-1 p-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={`w-2 h-2 rounded-full ${i === 4 ? "bg-pink-600" : "bg-pink-200"}`} />
                ))}
              </div>
            </div>
            <div className="bg-[#1a1200] rounded-lg aspect-square overflow-hidden p-2">
              <div className="bg-yellow-50 rounded text-[8px] p-1 text-gray-600 font-medium mb-1">Campaign concept ins...</div>
              <div className="bg-gray-700 rounded text-[7px] px-1.5 py-0.5 text-gray-300 inline-block">AI-generate new concept</div>
            </div>
            <div className="bg-yellow-50 rounded-lg aspect-square overflow-hidden p-2">
              <div className="text-[8px] font-bold text-gray-800 mb-0.5">$912K</div>
              <div className="text-[6px] text-gray-400 mb-1">ARR Impact</div>
              <div className="bg-gray-200 rounded h-6 w-full" />
            </div>
            <div className="bg-green-50 rounded-lg aspect-square overflow-hidden p-2">
              <div className="text-[7px] text-gray-600 mb-0.5">Raleigh, NC</div>
              <div className="text-[7px] text-gray-600 mb-0.5">Boise, ID · Spokane</div>
              <div className="flex items-center gap-0.5 mb-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <div className="text-[6px] text-gray-500">Searching the web...</div>
              </div>
              <div className="text-[7px] text-gray-600 mb-0.5">Tampa, FL</div>
              <div className="flex items-center gap-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <div className="text-[6px] text-gray-500">Searching the web...</div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg aspect-square overflow-hidden flex items-end justify-end p-2">
              <div className="w-5 h-5 rounded-full bg-blue-400 border-2 border-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
