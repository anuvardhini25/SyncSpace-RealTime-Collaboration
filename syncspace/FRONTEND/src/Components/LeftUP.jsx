import { useState } from 'react';
function LeftUP() {
    return(
        <section className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0b0d3d] text-white">

        {/* Background glow */}
        <div className="absolute -left-20 top-1/3 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute right-0 bottom-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 w-full px-16 py-14">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-20">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-600/30">
              <div className="grid grid-cols-2 gap-1.5">
                <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
                <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
                <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
                <span className="w-2.5 h-2.5 border-2 border-white rounded-sm" />
              </div>
            </div>

            <span className="text-2xl font-bold tracking-tight">
              SyncSpace
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-violet-300 text-sm mb-7">
            ✦ Collaborate • Connect • Create
          </div>

          {/* Heading */}
          <h1 className="text-5xl xl:text-6xl font-bold leading-tight">
            Welcome{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-300">
              back!
            </span>
          </h1>

          <h2 className="text-2xl font-semibold mt-5">
            Glad to see you again 👋
          </h2>

          <p className="mt-5 text-lg text-slate-300 max-w-lg leading-8">
            Login to your workspace and continue collaborating
            with your team in real-time.
          </p>

          {/* Workspace illustration */}
          <div className="relative mt-14 max-w-xl">

            <div className="absolute -inset-4 rounded-[40%] border border-violet-500/30" />

            <div className="relative rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md overflow-hidden shadow-2xl">

              {/* Fake browser header */}
              <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/30" />
              </div>

              <div className="flex h-56">

                {/* Sidebar */}
                <div className="w-32 border-r border-white/10 p-4">
                  <p className="text-xs font-semibold text-white mb-5">
                    SyncSpace
                  </p>

                  {["General", "Design", "Development", "Marketing"].map(
                    (item, index) => (
                      <div
                        key={item}
                        className={`text-xs py-2 px-2 rounded-lg mb-1 ${index === 0
                          ? "bg-violet-600 text-white"
                          : "text-slate-400"
                          }`}
                      >
                        # {item}
                      </div>
                    )
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 p-5">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 mb-5"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500" />

                      <div className="space-y-2 flex-1">
                        <div className="h-2 rounded-full bg-white/20 w-24" />
                        <div className="h-2 rounded-full bg-white/10 w-40" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trust badge */}
          <div className="mt-8 inline-flex items-center gap-5 px-5 py-3 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="w-9 h-9 rounded-full border-2 border-[#0b0d3d] bg-gradient-to-br from-slate-300 to-violet-400"
                />
              ))}

              <div className="w-9 h-9 rounded-full border-2 border-[#0b0d3d] bg-violet-600 flex items-center justify-center text-xs font-bold">
                2K+
              </div>
            </div>

            <div>
              <div className="text-yellow-400 text-sm">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-sm text-slate-300">
                Trusted by 2,000+ teams
              </p>
            </div>
          </div>

        </div>
      </section>
    )
}
export default LeftUP;