export interface UserProfileCreate {
  user_id: number;
  position?: string;
  skills?: string;
  bio?: string;
  profile_pic?: string;
}

export interface UserProfileUpdate {
  position?: string;
  skills?: string;
  bio?: string;
  profile_pic?: string;
}

export interface UserProfileResponse {
  user_id: number;
  position?: string;
  skills?: string;
  bio?: string;
  profile_pic?: string;
}