import {
  COURSE_STATUS_CONFIG,
  COURSE_STATUS_LIST,
  AVAILABLE_STATUS_CONFIG,
  REQ_STATUS_CONFIG,
  UNLOCKS_STATUS_CONFIG,
  getCourseStatusConfig,
  getCourseStatusLabel,
  getCourseStatusTag,
} from './course-status.constants';
import { CourseStatus } from '../models/course';

describe('CourseStatusConstants', () => {
  it('should contain configuration for all four statuses', () => {
    expect(COURSE_STATUS_LIST).toHaveLength(4);
    expect(COURSE_STATUS_CONFIG.pending.label).toBe('Pendiente');
    expect(COURSE_STATUS_CONFIG.coursing.label).toBe('Cursando');
    expect(COURSE_STATUS_CONFIG.coursed.label).toBe('Cursada');
    expect(COURSE_STATUS_CONFIG.approved.label).toBe('Aprobada');
  });

  it('should export correct auxiliary chip configs for available, req, and unlocks', () => {
    expect(AVAILABLE_STATUS_CONFIG.label).toBe('Disponible para cursar');
    expect(AVAILABLE_STATUS_CONFIG.bg).toBe('#e0f2fe');
    expect(AVAILABLE_STATUS_CONFIG.borderColor).toBe('#0284c7');

    expect(REQ_STATUS_CONFIG.label).toBe('Requisito');
    expect(REQ_STATUS_CONFIG.bg).toBe('#fde8ed');
    expect(REQ_STATUS_CONFIG.borderColor).toBe('#be123c');

    expect(UNLOCKS_STATUS_CONFIG.label).toBe('Desbloquea');
    expect(UNLOCKS_STATUS_CONFIG.bg).toBe('#ecfccb');
    expect(UNLOCKS_STATUS_CONFIG.borderColor).toBe('#4d7c0f');
  });

  it('should return correct config, label, and tag for given status', () => {
    const statuses: CourseStatus[] = ['pending', 'coursing', 'coursed', 'approved'];

    for (const status of statuses) {
      const config = getCourseStatusConfig(status);
      expect(config.key).toBe(status);
      expect(getCourseStatusLabel(status)).toBe(config.label);
      expect(getCourseStatusTag(status)).toBe(config.tag);
    }
  });

  it('should fallback to pending if status is invalid', () => {
    const fallback = getCourseStatusConfig('unknown' as CourseStatus);
    expect(fallback.key).toBe('pending');
    expect(fallback.label).toBe('Pendiente');
  });
});
