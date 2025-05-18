import apiClient from '../apiClient';
import { API_ENDPOINTS } from '../endpoints';
import { 
  TeamCreate, 
  TeamUpdate, 
  TeamResponse,
  TeamStatistics 
} from '../../types/team.types';

export const getTeams = async (): Promise<TeamResponse[]> => {
  return apiClient.get(API_ENDPOINTS.TEAMS.BASE);
};

export const getTeamById = async (id: number): Promise<TeamResponse> => {
  return apiClient.get(API_ENDPOINTS.TEAMS.DETAIL(id));
};

export const createTeam = async (team: TeamCreate): Promise<TeamResponse> => {
  return apiClient.post(API_ENDPOINTS.TEAMS.BASE, team);
};

export const updateTeam = async (id: number, team: TeamUpdate): Promise<TeamResponse> => {
  return apiClient.put(API_ENDPOINTS.TEAMS.DETAIL(id), team);
};

export const deleteTeam = async (id: number): Promise<{message: string}> => {
  return apiClient.delete(API_ENDPOINTS.TEAMS.DETAIL(id));
};

export const getTeamStatistics = async (): Promise<TeamStatistics> => {
  return apiClient.get(`${API_ENDPOINTS.TEAMS.BASE}/statistics`);
};