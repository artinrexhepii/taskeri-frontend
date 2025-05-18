import api from './index';
import { 
  Team, 
  TeamCreate, 
  TeamUpdate,
  TeamDetailResponse,
  TeamListResponse,
  TeamMember
} from '../types/team.types';

const TeamService = {
  /**
   * Get paginated list of teams
   */
  getTeams: async (page = 1, pageSize = 20): Promise<TeamListResponse> => {
    return api.get<TeamListResponse>('/teams', { 
      page, 
      page_size: pageSize
    });
  },
  
  /**
   * Get a specific team by ID with detailed information
   */
  getTeam: async (teamId: number): Promise<TeamDetailResponse> => {
    return api.get<TeamDetailResponse>(`/teams/${teamId}`);
  },
  
  /**
   * Create a new team
   */
  createTeam: async (data: TeamCreate): Promise<Team> => {
    return api.post<Team>('/teams', data);
  },
  
  /**
   * Update an existing team
   */
  updateTeam: async (teamId: number, data: TeamUpdate): Promise<Team> => {
    return api.put<Team>(`/teams/${teamId}`, data);
  },
  
  /**
   * Delete a team
   */
  deleteTeam: async (teamId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/teams/${teamId}`);
  },
  
  /**
   * Get team members
   */
  getTeamMembers: async (teamId: number): Promise<TeamMember[]> => {
    return api.get<TeamMember[]>(`/teams/${teamId}/members`);
  },
  
  /**
   * Add member to team
   */
  addTeamMember: async (teamId: number, userId: number, role?: string): Promise<TeamMember> => {
    return api.post<TeamMember>(`/teams/${teamId}/members`, { 
      user_id: userId,
      role
    });
  },
  
  /**
   * Remove member from team
   */
  removeTeamMember: async (teamId: number, userId: number): Promise<{ message: string }> => {
    return api.del<{ message: string }>(`/teams/${teamId}/members/${userId}`);
  },
  
  /**
   * Get teams for a specific user
   */
  getUserTeams: async (userId: number): Promise<Team[]> => {
    return api.get<Team[]>(`/users/${userId}/teams`);
  }
};

export default TeamService;