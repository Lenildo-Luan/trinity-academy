/**
 * Lesson Validator
 * Validates lesson input data for Phase 1 (Planning & Strategy)
 */

export interface LessonInput {
  courseId: string;
  chapterId: string;
  chapterTitle: string;
  description: string;
  objectives?: string[];
  prerequisites?: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate chapter ID format (kebab-case or charpter-N)
 */
function validateChapterId(id: string): ValidationError | null {
  if (!id) {
    return { field: 'chapterId', message: 'Chapter ID is required' };
  }

  // Allow either kebab-case or charpter-N format
  if (!/^(charpter-\d+|[a-z0-9]+(-[a-z0-9]+)*)$/.test(id)) {
    return {
      field: 'chapterId',
      message: 'Chapter ID must be kebab-case or charpter-N format',
    };
  }

  return null;
}

/**
 * Validate chapter title
 */
function validateChapterTitle(title: string): ValidationError | null {
  if (!title || title.trim().length === 0) {
    return { field: 'chapterTitle', message: 'Chapter title is required' };
  }

  if (title.length < 5 || title.length > 100) {
    return {
      field: 'chapterTitle',
      message: 'Chapter title must be between 5 and 100 characters',
    };
  }

  return null;
}

/**
 * Validate lesson description
 */
function validateLessonDescription(description: string): ValidationError | null {
  if (!description || description.trim().length === 0) {
    return { field: 'description', message: 'Lesson description is required' };
  }

  if (description.length < 10 || description.length > 300) {
    return {
      field: 'description',
      message: 'Lesson description must be between 10 and 300 characters',
    };
  }

  return null;
}

/**
 * Validate objectives
 */
function validateObjectives(objectives?: string[]): ValidationError | null {
  if (!objectives || objectives.length === 0) {
    return { field: 'objectives', message: 'At least one learning objective is required' };
  }

  if (objectives.length > 5) {
    return {
      field: 'objectives',
      message: 'Maximum 5 learning objectives allowed',
    };
  }

  for (let i = 0; i < objectives.length; i++) {
    if (!objectives[i] || objectives[i].trim().length === 0) {
      return {
        field: `objectives[${i}]`,
        message: 'Objective cannot be empty',
      };
    }

    if (objectives[i].length < 5 || objectives[i].length > 150) {
      return {
        field: `objectives[${i}]`,
        message: 'Each objective must be between 5 and 150 characters',
      };
    }
  }

  return null;
}

/**
 * Validate entire lesson input
 */
export function validateLesson(input: LessonInput): ValidationError[] {
  const errors: ValidationError[] = [];

  // Validate required fields
  const chapterIdError = validateChapterId(input.chapterId);
  if (chapterIdError) errors.push(chapterIdError);

  const titleError = validateChapterTitle(input.chapterTitle);
  if (titleError) errors.push(titleError);

  const descriptionError = validateLessonDescription(input.description);
  if (descriptionError) errors.push(descriptionError);

  // Validate objectives (required)
  const objectivesError = validateObjectives(input.objectives);
  if (objectivesError) errors.push(objectivesError);

  // Validate prerequisites (optional)
  if (input.prerequisites && input.prerequisites.length > 0) {
    if (input.prerequisites.length > 5) {
      errors.push({
        field: 'prerequisites',
        message: 'Maximum 5 prerequisites allowed',
      });
    }

    for (let i = 0; i < input.prerequisites.length; i++) {
      if (!input.prerequisites[i] || input.prerequisites[i].trim().length === 0) {
        errors.push({
          field: `prerequisites[${i}]`,
          message: 'Prerequisite cannot be empty',
        });
      }
    }
  }

  return errors;
}

