import { useEffect } from 'react';

export default function TrailerModal({ open, onClose, title, youtubeKey }) {
  useEffect(() => {
    // só ativa listeners quando o modal está aberto
    if (!open) return;

    // permite fechar com ESC (UX padrão de modal)
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onKeyDown);

    // trava scroll do body enquanto o modal está aberto
    // (evita aquele efeito estranho de fundo rolando)
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // cleanup ao fechar
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [open, onClose]);

  // se não estiver aberto, não renderiza nada (modal desmontado)
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `Trailer: ${title}` : 'Trailer'}
      onMouseDown={(e) => {
        // se clicar fora do conteúdo (backdrop), fecha o modal
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* backdrop escuro com blur leve */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      <div className="relative z-10 w-[92vw] max-w-5xl">
        {/* header do modal */}
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-white text-lg md:text-xl font-semibold truncate">
            {title ? `${title} - Trailer` : 'Trailer'}
          </h3>

          {/* botão fechar explícito (além do ESC e clique fora) */}
          <button
            type="button"
            onClick={onClose}
            className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1.5 transition"
            aria-label="Fechar"
          >
            Fechar
          </button>
        </div>

        {/* container do vídeo */}
        <div className="rounded-xl overflow-hidden shadow-2xl border border-white/10 bg-black">
          <div className="aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=0&controls=1&rel=0`}
              title={title ? `${title} - Trailer` : 'Trailer'}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* micro dica de UX */}
        <p className="text-white/60 text-sm mt-3 px-1">
          Dica: aperte ESC para fechar.
        </p>
      </div>
    </div>
  );
}