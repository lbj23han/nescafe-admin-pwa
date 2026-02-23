function shouldHideMultipleAmountWarning(w: string) {
  const t = w.trim();
  return /금액이\s*여러\s*개/.test(t) && /(하나|1개).*(사용|적용)/.test(t);
}

function shouldHideAmountAmbiguousWarning(w: string) {
  const t = w.trim();
  return /금액.*(단위|명확)/.test(t);
}

/**
 * 단가(라인 금액)로 해석 가능한 패턴이 rawText에 있는지
 * - (수량+단위)+금액원: "10잔 3000원"
 * - 또는 (메뉴)+금액원: "아메 3000원"
 */
function hasUnitPriceLikePattern(rawText: string) {
  const t = rawText.trim();
  if (!t) return false;

  const withQty = /\d+\s*(잔|개|명|건)\s*(\d{1,3}(?:,\d{3})+|\d+)\s*원/.test(t);
  if (withQty) return true;

  const menuPriceOnly = /[가-힣A-Za-z]+\s*(\d{1,3}(?:,\d{3})+|\d+)\s*원/.test(
    t
  );

  return menuPriceOnly;
}

export function refineReservationWarnings(args: {
  rawText: string;
  warnings: string[];
  extractedAmount: number | null;
  modelAmount: number | null;
  normalizedDate: string;
  modelDate: string | null;
}): string[] {
  const { rawText, extractedAmount, modelAmount, normalizedDate, modelDate } =
    args;

  let warnings = [...args.warnings];

  if (modelDate && modelDate !== normalizedDate) {
    warnings.push(
      `AI가 date를 '${modelDate}'로 출력했지만, 입력에서 추출한 '${normalizedDate}'로 고정했어요.`
    );
  }

  const unitPriceLike = hasUnitPriceLikePattern(rawText);

  if (extractedAmount === null) {
    if (modelAmount !== null) {
      warnings.push(
        `AI가 amount를 '${modelAmount}'로 추정했지만, 총액 키워드가 없어 null로 고정했어요.`
      );
    }

    warnings = warnings.filter((w) => !shouldHideMultipleAmountWarning(w));
    if (unitPriceLike) {
      warnings = warnings.filter((w) => !shouldHideAmountAmbiguousWarning(w));
    }
  } else {
    if (modelAmount !== null && modelAmount !== extractedAmount) {
      warnings.push(
        `AI가 amount를 '${modelAmount}'로 출력했지만, 입력에서 추출한 '${extractedAmount}'로 고정했어요.`
      );
    }
  }

  return warnings;
}
