// Mock authentication and data management
// In production, this would connect to your backend API

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin' | 'operator';
  password: string;
}

export interface BusPass {
  id: string;
  userId: string;
  passType: string;
  route: string;
  validFrom: string;
  validTo: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  qrCode: string;
  amount: number;
  paymentStatus: 'pending' | 'completed';
  documents: string[];
}

export interface Route {
  id: string;
  name: string;
  startPoint: string;
  endPoint: string;
  stops: string[];
  fare: number;
  distance: string;
  duration: string;
}

export interface Application {
  id: string;
  userId: string;
  userName: string;
  passType: string;
  route: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedDate: string;
  amount: number;
}

// Mock data storage
const STORAGE_KEYS = {
  USERS: 'bus_pass_users',
  PASSES: 'bus_pass_passes',
  ROUTES: 'bus_pass_routes',
  APPLICATIONS: 'bus_pass_applications',
  CURRENT_USER: 'bus_pass_current_user',
};

// Initialize default data
const defaultRoutes: Route[] = [
  {
    id: '1',
    name: 'Route 101',
    startPoint: 'Central Station',
    endPoint: 'Airport',
    stops: ['Central Station', 'City Mall', 'University', 'Tech Park', 'Airport'],
    fare: 500,
    distance: '25 km',
    duration: '45 min',
  },
  {
    id: '2',
    name: 'Route 202',
    startPoint: 'Downtown',
    endPoint: 'Beach',
    stops: ['Downtown', 'Market Square', 'Hospital', 'Beach Resort', 'Beach'],
    fare: 350,
    distance: '18 km',
    duration: '35 min',
  },
  {
    id: '3',
    name: 'Route 303',
    startPoint: 'North Terminal',
    endPoint: 'South Terminal',
    stops: ['North Terminal', 'Business District', 'Sports Complex', 'Shopping Center', 'South Terminal'],
    fare: 450,
    distance: '22 km',
    duration: '40 min',
  },
];

const defaultUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@buspass.com',
    phone: '+1234567890',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: '2',
    name: 'Bus Operator',
    email: 'operator@buspass.com',
    phone: '+1234567891',
    role: 'operator',
    password: 'operator123',
  },
];

// Initialize storage
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.ROUTES)) {
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(defaultRoutes));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PASSES)) {
    localStorage.setItem(STORAGE_KEYS.PASSES, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify([]));
  }
};

// User authentication
export const login = (email: string, password: string): User | null => {
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    return user;
  }
  return null;
};

export const register = (userData: Omit<User, 'id'>): User => {
  const users: User[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  const newUser: User = {
    ...userData,
    id: Date.now().toString(),
  };
  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(newUser));
  return newUser;
};

export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

// Routes management
export const getRoutes = (): Route[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.ROUTES) || '[]');
};

export const addRoute = (route: Omit<Route, 'id'>): Route => {
  const routes = getRoutes();
  const newRoute: Route = {
    ...route,
    id: Date.now().toString(),
  };
  routes.push(newRoute);
  localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  return newRoute;
};

export const updateRoute = (id: string, updates: Partial<Route>): void => {
  const routes = getRoutes();
  const index = routes.findIndex(r => r.id === id);
  if (index !== -1) {
    routes[index] = { ...routes[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(routes));
  }
};

export const deleteRoute = (id: string): void => {
  const routes = getRoutes();
  const filtered = routes.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.ROUTES, JSON.stringify(filtered));
};

// Pass applications
export const applyForPass = (passData: Omit<BusPass, 'id' | 'qrCode'>): BusPass => {
  const passes: BusPass[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSES) || '[]');
  const newPass: BusPass = {
    ...passData,
    id: Date.now().toString(),
    qrCode: `PASS-${Date.now()}`,
  };
  passes.push(newPass);
  localStorage.setItem(STORAGE_KEYS.PASSES, JSON.stringify(passes));
  
  // Also add to applications
  const applications: Application[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
  const user = getCurrentUser();
  applications.push({
    id: newPass.id,
    userId: passData.userId,
    userName: user?.name || 'User',
    passType: passData.passType,
    route: passData.route,
    status: passData.status,
    appliedDate: passData.validFrom,
    amount: passData.amount,
  });
  localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  
  return newPass;
};

export const getUserPasses = (userId: string): BusPass[] => {
  const passes: BusPass[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSES) || '[]');
  return passes.filter(p => p.userId === userId);
};

export const getAllPasses = (): BusPass[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.PASSES) || '[]');
};

export const updatePassStatus = (passId: string, status: BusPass['status']): void => {
  const passes = getAllPasses();
  const index = passes.findIndex(p => p.id === passId);
  if (index !== -1) {
    passes[index].status = status;
    localStorage.setItem(STORAGE_KEYS.PASSES, JSON.stringify(passes));
  }
  
  // Update applications too
  const applications: Application[] = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
  const appIndex = applications.findIndex(a => a.id === passId);
  if (appIndex !== -1) {
    applications[appIndex].status = status;
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(applications));
  }
};

export const getApplications = (): Application[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLICATIONS) || '[]');
};

export const getAllUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
};

// AI-based route suggestion (mock)
export const suggestRoute = (from: string, to: string): Route | null => {
  const routes = getRoutes();
  // Simple matching algorithm
  const suggestion = routes.find(r => 
    r.stops.some(s => s.toLowerCase().includes(from.toLowerCase())) &&
    r.stops.some(s => s.toLowerCase().includes(to.toLowerCase()))
  );
  return suggestion || routes[0];
};

// Crowd prediction (mock)
export const predictCrowd = (routeId: string, time: string): string => {
  const hour = parseInt(time.split(':')[0]);
  if (hour >= 7 && hour <= 9) return 'High';
  if (hour >= 17 && hour <= 19) return 'High';
  if (hour >= 10 && hour <= 16) return 'Medium';
  return 'Low';
};

// Initialize on import
initializeStorage();
