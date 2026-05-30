import React from "react";

export default function SignUpPage({
  form,
  setForm,
  handleSubmit,
  switchMode,
}) {
  return (
    <>
      <h1 className="text-5xl font-bold mb-3 tracking-tight">
        Create Account
      </h1>

      <p className="text-white/50 mb-10">
        Start building intelligent surveillance systems.
      </p>

      <div className="border border-white/10 bg-white/[0.02] backdrop-blur-xl p-8 rounded-sm">

        {/* OAuth */}
        <div className="space-y-3">
          <button className="w-full border border-white/10 hover:border-white/20 transition py-3 px-4 text-sm bg-white/[0.02]">
            Continue with Google
          </button>

          <button className="w-full border border-white/10 hover:border-white/20 transition py-3 px-4 text-sm bg-white/[0.02]">
            Continue with Microsoft
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />

          <span className="text-xs text-white/40">
            or continue with email
          </span>

          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="text-sm text-white/70 mb-2 block">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Your name"
              className="w-full bg-[#0d0d14] border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full bg-[#0d0d14] border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-sm text-white/70 mb-2 block">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-[#0d0d14] border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
              onChange={(e) =>
                setForm({
                  ...form,
                  password: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-white text-black py-3 font-medium hover:opacity-90 transition"
          >
            Create Account
          </button>
        </form>
      </div>

      <div className="mt-6 text-sm text-white/50 text-center">
        Already have an account?

        <button
          onClick={switchMode}
          className="ml-2 text-white hover:opacity-70 transition"
        >
          Sign In
        </button>
      </div>
    </>
  );
}