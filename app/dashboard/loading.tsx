export default function DashboardLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-pulse text-center px-4">
      <div className="p-4 pixel-corners bg-[#222]">
        <div className="w-16 h-16 bg-[#333] pixel-corners" />
      </div>
      <div className="space-y-6">
        <h2 className="font-press-start text-gray-700 text-xl tracking-widest uppercase">CARREGANDO QUEST...</h2>
        <div className="w-64 h-4 bg-[#222] pixel-corners overflow-hidden relative mx-auto">
           <div className="absolute top-0 left-0 h-full bg-[#ff6b6b]/30 w-1/2 animate-[loading_2s_infinite_linear]" />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-\[loading_2s_infinite_linear\] {
          animation: loading 2s infinite linear;
        }
      `}} />
    </div>
  );
}
