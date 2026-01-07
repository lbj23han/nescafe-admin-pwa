"use client";

type Copy = typeof import("@/constants/loginpage").LOGIN_PAGE_COPY;

export function ShopSection(props: {
  copy: Copy;
  isSignup: boolean;
  hideShopName: boolean;
  inviteShopName: string;
  inputClass: string;
  shopName: string;
  onChangeShopName: (v: string) => void;
}) {
  const {
    copy,
    isSignup,
    hideShopName,
    inviteShopName,
    inputClass,
    shopName,
    onChangeShopName,
  } = props;

  if (!isSignup) return null;

  if (hideShopName && inviteShopName) {
    return (
      <div className="mt-5 rounded-lg border border-zinc-200 bg-zinc-50 p-3">
        <div className="text-[11px] text-zinc-500">초대된 매장</div>
        <div className="mt-1 text-sm font-medium text-zinc-900">
          {inviteShopName}
        </div>
      </div>
    );
  }

  if (hideShopName) return null;

  return (
    <>
      <label className="block mt-5 text-xs text-zinc-600">
        {copy.labels.shopName}
      </label>
      <input
        className={inputClass}
        value={shopName}
        onChange={(e) => onChangeShopName(e.target.value)}
        placeholder={copy.placeholders.shopName}
        autoComplete="organization"
      />
      <p className="mt-2 text-[11px] text-zinc-500">{copy.helper.shopName}</p>
    </>
  );
}
