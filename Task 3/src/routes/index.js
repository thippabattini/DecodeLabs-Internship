import { Router } from 'express';
import studentsRoutes from './students.routes.js';
import coursesRoutes from './courses.routes.js';
import enrollmentsRoutes from './enrollments.routes.js';

const router = Router();

router.use('/students', studentsRoutes);
router.use('/courses', coursesRoutes);
router.use('/enrollments', enrollmentsRoutes);

export default router;
