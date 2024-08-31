export const getOrganisations = `
/**
 * @swagger
 * /api/organisations:
 *   get:
 *     summary: List the organisations of the signed-in user
 *     tags: [Organisations]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Successfully returned user organisations
 *                 data:
 *                   type: object
 *                   properties:
 *                     organisations:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           organisationId:
 *                             type: string
 *                           organisationName:
 *                             type: string
 *       401:
 *         description: Unauthorized access, authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Unauthorized."
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 message:
 *                   type: string
 *                   example: Unauthorized access.
 */
`;

export const createOrganisation = `
/**
 * @swagger
 * /api/organisations:
 *   post:
 *     summary: Create a new organisation
 *     tags: [Organisations]
 *     parameters:
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: any
 *               description:
 *                 type: string
 *                 example: any
 *     responses:
 *       201:
 *         description: Organisation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Organisation created successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     orgId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: Bad Request
 *                 message:
 *                   type: string
 *                   example: Client error
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *       401:
 *         description: Unauthorized access, authentication required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized.
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 message:
 *                   type: string
 *                   example: Unauthorized access.
 *       422:
 *         description: Unprocessable Entity
 */
`;

export const getOrganisationById = `
/**
 * @swagger
 * /api/organisations/{id}:
 *   get:
 *     summary: Get organisation by ID
 *     tags: [Organisations]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the organisation to retrieve
 *       - name: authorization
 *         in: header
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *     responses:
 *       200:
 *         description: Successfully obtained organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Successfully obtained organisation
 *                 data:
 *                   type: object
 *                   properties:
 *                     orgId:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *       401:
 *         description: Unauthorized - Unable to get organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unable to get organisation
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: unsuccessful
 *                 message:
 *                   type: string
 *                   example: Unauthorized access.
 *       404:
 *         description: Not Found
 */
`;

export const addUserToOrganisation = `
/**
 * @swagger
 * /api/organisations/{orgId}/users:
 *   post:
 *     summary: Add a user to a specific organisation
 *     tags: [Organisations]
 *     parameters:
 *       - name: orgId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the organisation
 *       - name: authorization
 *         in: header
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT token for authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "12345"
 *     responses:
 *       200:
 *         description: User added to organisation successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User added to organisation successfully
 *       400:
 *         description: An error occurred while adding the user to the organisation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: An error occurred while adding the user to the organisation
 *       422:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                       message:
 *                         type: string
 *                       example: [{ "field": "userId", "message": "User ID is required" }]
 */
`;



