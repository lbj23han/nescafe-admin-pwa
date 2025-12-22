export type ProfileRole = "owner" | "admin" | "staff" | "readonly" | string;

export type Profile = {
  user_id: string;
  shop_id: string | null;
  role: ProfileRole;
  display_name: string | null;

  created_at: string;
  updated_at: string;
};

export type UpdateMyProfileInput = {
  display_name?: string | null;
};
