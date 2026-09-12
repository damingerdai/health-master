import crypto from 'crypto';

/**
 * Generates a Gravatar URL for the given email address
 * @param email - The email address to generate Gravatar for
 * @param size - The size of the avatar image in pixels (default: 100)
 * @param defaultImage - The type of default image to use if no Gravatar is found (default: 'identicon')
 * @returns The complete Gravatar URL
 * @throws {Error} If the email parameter is invalid
 */
const gravatar = (
  email: string,
  size: number = 100,
  defaultImage: string = 'identicon'
): string => {
  // Validate input parameters
  if (!email || typeof email !== 'string') {
    throw new Error('Email must be a valid string');
  }

  if (size <= 0) {
    throw new Error('Size must be a positive number');
  }

  // Normalize email: trim whitespace and convert to lowercase
  const normalizedEmail: string = email.trim().toLowerCase();

  // Create MD5 hash of the normalized email
  const hash: string = crypto
    .createHash('md5')
    .update(normalizedEmail)
    .digest('hex');

  // Construct and return the Gravatar URL
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
};

export default gravatar;

interface GravatarOptions {
  size?: number;
  defaultImage?: string;
  rating?: 'g' | 'pg' | 'r' | 'x';
  forcedefault?: boolean;
}

/**
 * Advanced Gravatar URL generator with additional options
 * @param email - The email address for Gravatar
 * @param options - Configuration options for the Gravatar
 * @returns Complete Gravatar URL with all specified parameters
 */
const advancedGravatar = (
  email: string,
  options: GravatarOptions = {}
): string => {
  const {
    size = 100,
    defaultImage = 'identicon',
    rating = 'g',
    forcedefault = false
  } = options;

  // Input validation
  if (!email || typeof email !== 'string') {
    throw new Error('Valid email string is required');
  }

  const normalizedEmail: string = email.trim().toLowerCase();
  const hash: string = crypto
    .createHash('md5')
    .update(normalizedEmail)
    .digest('hex');

  // Build URL with URLSearchParams for better encoding
  const params = new URLSearchParams({
    s: size.toString(),
    d: defaultImage,
    r: rating,
    ...(forcedefault && { f: 'y' })
  });

  return `https://www.gravatar.com/avatar/${hash}?${params.toString()}`;
};

export { advancedGravatar };
export type { GravatarOptions };
