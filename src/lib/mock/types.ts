import type { GiftPagePayload } from "../domain";

export type MockUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type SavedPage = {
  id: string;
  userId: string;
  payload: GiftPagePayload;
  createdAt: string;
  viewCount: number;
};
