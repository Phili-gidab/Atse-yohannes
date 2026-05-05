import { useContext } from 'react';
import { AuthContext } from '../providers/AuthProvider';

export const useAuth = () => useContext(AuthContext);
export type { UserRole, AuthUser } from '../providers/AuthProvider';
