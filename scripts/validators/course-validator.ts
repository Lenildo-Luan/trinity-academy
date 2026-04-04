/**
 * Course Validator
 * Validates course input data for Phase 0 (Course Setup)
 */

export interface CourseInput {
  id: string;
  title: string;
  description: string;
  backgroundImage: string;
  initialModules?: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate course ID format (kebab-case)
 */
function validateCourseId(id: string): ValidationError | null {
  if (!id) {
    return { field: 'id', message: 'Course ID is required' };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    return {
      field: 'id',
      message: 'Course ID must be kebab-case (lowercase letters, numbers, and hyphens only)',
    };
  }

  if (id.length < 3 || id.length > 50) {
    return {
      field: 'id',
      message: 'Course ID must be between 3 and 50 characters',
    };
  }

  return null;
}

/**
 * Validate title
 */
function validateTitle(title: string): ValidationError | null {
  if (!title || title.trim().length === 0) {
    return { field: 'title', message: 'Course title is required' };
  }

  if (title.length < 3 || title.length > 100) {
    return {
      field: 'title',
      message: 'Course title must be between 3 and 100 characters',
    };
  }

  return null;
}

/**
 * Validate description
 */
function validateDescription(description: string): ValidationError | null {
  if (!description || description.trim().length === 0) {
    return { field: 'description', message: 'Course description is required' };
  }

  if (description.length < 50 || description.length > 500) {
    return {
      field: 'description',
      message: 'Course description must be between 50 and 500 characters',
    };
  }

  return null;
}

/**
 * Validate background image URL
 */
function validateBackgroundImage(url: string): ValidationError | null {
  if (!url || url.trim().length === 0) {
    return { field: 'backgroundImage', message: 'Background image URL is required' };
  }

  try {
    new URL(url);
  } catch {
    return {
      field: 'backgroundImage',
      message: 'Background image must be a valid URL',
    };
  }

  return null;
}

/**
 * Validate module ID
 */
function validateModuleId(id: string): ValidationError | null {
  if (!id) {
    return { field: 'module.id', message: 'Module ID is required' };
  }

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(id)) {
    return {
      field: 'module.id',
      message: 'Module ID must be kebab-case',
    };
  }

  return null;
}

/**
 * Validate module
 */
function validateModule(module: any, index: number): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!module.id) {
    errors.push({
      field: `initialModules[${index}].id`,
      message: 'Module ID is required',
    });
  } else {
    const idError = validateModuleId(module.id);
    if (idError) errors.push(idError);
  }

  if (!module.title || module.title.trim().length === 0) {
    errors.push({
      field: `initialModules[${index}].title`,
      message: 'Module title is required',
    });
  }

  if (!module.description || module.description.trim().length === 0) {
    errors.push({
      field: `initialModules[${index}].description`,
      message: 'Module description is required',
    });
  }

  return errors;
}

/**
 * Validate entire course input
 */
export function validateCourse(input: CourseInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate required fields
  const courseIdError = validateCourseId(input.id);
  if (courseIdError) errors.push(courseIdError);

  const titleError = validateTitle(input.title);
  if (titleError) errors.push(titleError);

  const descriptionError = validateDescription(input.description);
  if (descriptionError) errors.push(descriptionError);

  const bgImageError = validateBackgroundImage(input.backgroundImage);
  if (bgImageError) errors.push(bgImageError);

  // Validate initial modules if provided
  if (input.initialModules && input.initialModules.length > 0) {
    input.initialModules.forEach((module, index) => {
      const moduleErrors = validateModule(module, index);
      errors.push(...moduleErrors);
    });

    // Check for duplicate module IDs
    const moduleIds = input.initialModules.map((m) => m.id);
    const uniqueIds = new Set(moduleIds);
    if (moduleIds.length !== uniqueIds.size) {
      errors.push({
        field: 'initialModules',
        message: 'Module IDs must be unique',
      });
    }
  }

  return errors;
}

