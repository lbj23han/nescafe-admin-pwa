"use client";

import { useDraggableFab } from "@/hooks/useDraggableFab";
import { FloatingFabUI } from "@/components/ui/navigation/FloatingFabUI";
import { useAiAssistantModal } from "@/hooks/ai/useAiAssistantModal";
import { AiAssistantModalUI } from "@/components/ui/ai/AiAssistantModalUI";

export function FloatingMenu() {
  //const router = useRouter();
  const { onPointerDown, onPointerMove, onPointerUp, consumeWasDragging } =
    useDraggableFab();

  const ai = useAiAssistantModal();

  const onFabClick = () => {
    if (consumeWasDragging()) return;
    ai.onOpen();
  };

  return (
    <>
      <FloatingFabUI
        isOpen={ai.open}
        onClick={onFabClick}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
      />

      <AiAssistantModalUI
        open={ai.open}
        title={ai.copy.title}
        subtitle={ai.copy.subtitle}
        step={ai.step}
        scope={ai.scope}
        input={ai.input}
        inputPlaceholder={ai.copy.inputPlaceholder}
        helperText={ai.copy.helperText}
        previewText={ai.previewText}
        onClose={ai.onClose}
        onBack={ai.onBack}
        onPickScope={ai.onPickScope}
        onChangeInput={ai.onChangeInput}
        onRequestPreview={ai.onRequestPreview}
        onEdit={ai.onEdit}
        onConfirm={ai.onConfirm}
      />
    </>
  );
}
