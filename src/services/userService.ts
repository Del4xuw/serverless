/**
 * User Service
 * Handles all user-related business logic with in-memory storage
 */

import { User, CreateUserInput } from '../models/user';

/**
 * Generate a simple UUID v4
 * In production, you'd use the uuid package
 */
function generateUuid(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * In-memory user storage
 * This simulates a database for local development
 */
class UserService {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.initializeMockData();
  }

  /**
   * Initialize with some mock data for testing
   */
  private initializeMockData(): void {
    const mockUsers: User[] = [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        email: 'john.doe@example.com',
        firstName: 'John',
        lastName: 'Doe',
        createdAt: '2024-01-15T10:30:00.000Z',
        updatedAt: '2024-01-15T10:30:00.000Z',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        email: 'jane.smith@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        createdAt: '2024-01-16T14:20:00.000Z',
        updatedAt: '2024-01-16T14:20:00.000Z',
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        email: 'bob.wilson@example.com',
        firstName: 'Bob',
        lastName: 'Wilson',
        createdAt: '2024-01-17T09:15:00.000Z',
        updatedAt: '2024-01-17T09:15:00.000Z',
      },
    ];

    mockUsers.forEach((user) => {
      this.users.set(user.id, user);
    });

    console.log(`[UserService] Initialized with ${mockUsers.length} mock users`);
  }

  /**
   * Get all users
   */
  getAllUsers(): User[] {
    const users = Array.from(this.users.values());
    console.log(`[UserService] Retrieved ${users.length} users`);
    return users;
  }

  /**
   * Get a user by ID
   */
  getUserById(id: string): User | null {
    const user = this.users.get(id) || null;
    console.log(`[UserService] Get user by ID ${id}: ${user ? 'found' : 'not found'}`);
    return user;
  }

  /**
   * Create a new user
   */
  createUser(input: CreateUserInput): User {
    const now = new Date().toISOString();
    const id = generateUuid();

    const newUser: User = {
      id,
      email: input.email.toLowerCase().trim(),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      createdAt: now,
      updatedAt: now,
    };

    this.users.set(id, newUser);
    console.log(`[UserService] Created user with ID ${id}`);

    return newUser;
  }

  /**
   * Delete a user by ID
   * Returns true if user was deleted, false if user didn't exist
   */
  deleteUser(id: string): boolean {
    const existed = this.users.has(id);
    if (existed) {
      this.users.delete(id);
      console.log(`[UserService] Deleted user with ID ${id}`);
    } else {
      console.log(`[UserService] User with ID ${id} not found for deletion`);
    }
    return existed;
  }

  /**
   * Check if a user exists by ID
   */
  userExists(id: string): boolean {
    return this.users.has(id);
  }

  /**
   * Check if an email is already in use
   */
  emailExists(email: string): boolean {
    const normalizedEmail = email.toLowerCase().trim();
    return Array.from(this.users.values()).some((user) => user.email === normalizedEmail);
  }

  /**
   * Get the total count of users
   */
  getUserCount(): number {
    return this.users.size;
  }

  /**
   * Reset the service (useful for testing)
   */
  reset(): void {
    this.users.clear();
    this.initializeMockData();
    console.log('[UserService] Service reset to initial state');
  }
}

// Export a singleton instance
export const userService = new UserService();

// Also export the class for testing purposes
export { UserService };
